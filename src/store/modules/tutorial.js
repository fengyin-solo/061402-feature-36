import { defineStore } from 'pinia';
import { tutorialTasksConfig, featureDescriptions } from '../../config/tutorialTasks';

const STORAGE_KEY = 'island-survival-tutorial';

export default defineStore('tutorial', {
  state: () => ({
    tasks: JSON.parse(JSON.stringify(tutorialTasksConfig)),
    currentTaskId: null,
    allCompleted: false,
    showTaskPanel: true,
    unlockedFeatures: [],
    firstTime: true,
    pendingFeatureUnlock: null,
    showFeatureModal: false
  }),

  getters: {
    currentTask: (state) => {
      if (!state.currentTaskId) return null;
      return state.tasks.find(task => task.id === state.currentTaskId);
    },
    nextTask: (state) => {
      return state.tasks.find(task => !task.completed && task.unlocked);
    },
    progress: (state) => {
      const completed = state.tasks.filter(task => task.completed).length;
      const total = state.tasks.length;
      return { completed, total, percentage: Math.round((completed / total) * 100) };
    },
    isFeatureUnlocked: (state) => (featureId) => {
      return state.unlockedFeatures.includes(featureId);
    },
    getFeatureDescription: () => (featureId) => {
      return featureDescriptions[featureId] || null;
    }
  },

  actions: {
    init() {
      this.loadFromStorage();
      if (this.firstTime) {
        this.currentTaskId = this.tasks[0]?.id || null;
        this.firstTime = false;
        this.saveToStorage();
      }
    },

    loadFromStorage() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          this.tasks = data.tasks || this.tasks;
          this.currentTaskId = data.currentTaskId;
          this.allCompleted = data.allCompleted || false;
          this.showTaskPanel = data.showTaskPanel !== undefined ? data.showTaskPanel : true;
          this.unlockedFeatures = data.unlockedFeatures || [];
          this.firstTime = data.firstTime !== undefined ? data.firstTime : true;
        }
      } catch (error) {
        console.error('Failed to load tutorial state:', error);
      }
    },

    saveToStorage() {
      try {
        const data = {
          tasks: this.tasks,
          currentTaskId: this.currentTaskId,
          allCompleted: this.allCompleted,
          showTaskPanel: this.showTaskPanel,
          unlockedFeatures: this.unlockedFeatures,
          firstTime: this.firstTime
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save tutorial state:', error);
      }
    },

    trackAction(actionName) {
      if (this.allCompleted) return;

      const task = this.tasks.find(t => 
        t.targetAction === actionName && !t.completed && t.unlocked
      );

      if (!task) return;

      task.currentCount++;

      if (task.currentCount >= task.targetCount) {
        this.completeTask(task.id);
      }

      this.saveToStorage();
    },

    completeTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task || task.completed) return;

      task.completed = true;

      task.unlockFeatures.forEach(feature => {
        if (!this.unlockedFeatures.includes(feature)) {
          this.unlockedFeatures.push(feature);
        }
      });

      this.pendingFeatureUnlock = task.unlockFeatures;
      this.showFeatureModal = true;

      const nextTaskIndex = this.tasks.findIndex(t => !t.completed);
      if (nextTaskIndex !== -1) {
        const nextTask = this.tasks[nextTaskIndex];
        nextTask.unlocked = true;
        this.currentTaskId = nextTask.id;
      } else {
        this.allCompleted = true;
        this.currentTaskId = null;
      }

      this.saveToStorage();
    },

    closeFeatureModal() {
      this.showFeatureModal = false;
      this.pendingFeatureUnlock = null;
    },

    toggleTaskPanel() {
      this.showTaskPanel = !this.showTaskPanel;
      this.saveToStorage();
    },

    setCurrentTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task && task.unlocked && !task.completed) {
        this.currentTaskId = taskId;
        this.saveToStorage();
      }
    },

    resetTutorial() {
      this.tasks = JSON.parse(JSON.stringify(tutorialTasksConfig));
      this.currentTaskId = this.tasks[0]?.id || null;
      this.allCompleted = false;
      this.showTaskPanel = true;
      this.unlockedFeatures = [];
      this.firstTime = false;
      this.pendingFeatureUnlock = null;
      this.showFeatureModal = false;
      this.saveToStorage();
    }
  }
});
