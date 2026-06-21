<template>
  <div v-if="!tutorialStore.allCompleted" class="tutorial-wrapper">
    <div class="tutorial-toggle" @click="tutorialStore.toggleTaskPanel()">
      <span class="toggle-icon">{{ tutorialStore.showTaskPanel ? '›' : '‹' }}</span>
      <span class="toggle-text">任务</span>
    </div>

    <transition name="slide">
      <div v-show="tutorialStore.showTaskPanel" class="tutorial-panel">
        <div class="panel-header">
          <h3>📋 新手引导</h3>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: tutorialStore.progress.percentage + '%' }"></div>
          </div>
          <span class="progress-text">{{ tutorialStore.progress.completed }}/{{ tutorialStore.progress.total }}</span>
        </div>

        <div class="task-list">
          <div 
            v-for="task in tutorialStore.tasks" 
            :key="task.id"
            class="task-item"
            :class="{ 
              'completed': task.completed, 
              'current': tutorialStore.currentTaskId === task.id && !task.completed,
              'locked': !task.unlocked
            }"
            @click="selectTask(task)"
          >
            <div class="task-icon">
              <span v-if="task.completed">✅</span>
              <span v-else-if="!task.unlocked">🔒</span>
              <span v-else>{{ task.icon }}</span>
            </div>
            <div class="task-info">
              <div class="task-title">{{ task.title }}</div>
              <div v-if="!task.completed && task.unlocked" class="task-progress">
                进度: {{ task.currentCount }}/{{ task.targetCount }}
              </div>
              <div v-if="task.completed" class="task-completed">已完成</div>
              <div v-if="!task.unlocked" class="task-locked">待解锁</div>
            </div>
          </div>
        </div>

        <div v-if="currentTask" class="current-task-detail">
          <div class="detail-header">
            <span class="detail-icon">{{ currentTask.icon }}</span>
            <span class="detail-title">{{ currentTask.title }}</span>
          </div>
          <p class="detail-desc">{{ currentTask.description }}</p>
          <div class="detail-hint">
            <span class="hint-icon">💡</span>
            {{ currentTask.unlockHint }}
          </div>
        </div>

        <div class="panel-footer">
          <el-button size="small" type="danger" plain @click="confirmReset">
            重置引导
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useTutorialStore } from '../store';

const tutorialStore = useTutorialStore();

const currentTask = computed(() => tutorialStore.currentTask);

const selectTask = (task) => {
  if (task.unlocked && !task.completed) {
    tutorialStore.setCurrentTask(task.id);
  }
};

const confirmReset = () => {
  ElMessageBox.confirm(
    '确定要重置新手引导吗？所有进度将被清除。',
    '重置引导',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    tutorialStore.resetTutorial();
  }).catch(() => {});
};
</script>

<style scoped>
.tutorial-wrapper {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
}

.tutorial-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 8px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.tutorial-toggle:hover {
  transform: translateX(-2px);
}

.toggle-icon {
  font-size: 18px;
  font-weight: bold;
}

.toggle-text {
  font-size: 12px;
  writing-mode: vertical-rl;
  margin-top: 4px;
}

.tutorial-panel {
  width: 300px;
  background: white;
  border-radius: 8px 0 0 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  position: relative;
}

.panel-header h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  right: 15px;
  top: 18px;
  font-size: 12px;
}

.task-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.task-item:hover:not(.locked) {
  background: #f0f4ff;
}

.task-item.current {
  background: #e8f4fa;
  border-color: #409eff;
}

.task-item.completed {
  background: #f0f9eb;
  opacity: 0.8;
}

.task-item.locked {
  background: #f5f7fa;
  opacity: 0.6;
  cursor: not-allowed;
}

.task-icon {
  font-size: 24px;
  margin-right: 12px;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.task-progress {
  font-size: 12px;
  color: #409eff;
}

.task-completed {
  font-size: 12px;
  color: #67c23a;
}

.task-locked {
  font-size: 12px;
  color: #909399;
}

.current-task-detail {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.detail-icon {
  font-size: 28px;
  margin-right: 10px;
}

.detail-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.detail-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.detail-hint {
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  color: #e6a23c;
  background: #fdf6ec;
  padding: 8px;
  border-radius: 4px;
}

.hint-icon {
  margin-right: 6px;
}

.panel-footer {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  text-align: right;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .tutorial-wrapper {
    top: auto;
    bottom: 20px;
    right: 10px;
  }
  
  .tutorial-panel {
    width: 260px;
  }
}
</style>
