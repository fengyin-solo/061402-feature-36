<template>
  <el-dialog
    v-model="visible"
    title="🎉 新功能解锁"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div class="unlock-content">
      <div v-for="(feature, index) in features" :key="index" class="feature-item">
        <div class="feature-icon">{{ feature.icon }}</div>
        <div class="feature-info">
          <h4 class="feature-title">{{ feature.title }}</h4>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleClose">
        太棒了！
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useTutorialStore } from '../store';

const tutorialStore = useTutorialStore();

const visible = ref(false);

const features = computed(() => {
  if (!tutorialStore.pendingFeatureUnlock) return [];
  return tutorialStore.pendingFeatureUnlock
    .map(id => tutorialStore.getFeatureDescription(id))
    .filter(Boolean);
});

watch(() => tutorialStore.showFeatureModal, (val) => {
  visible.value = val;
});

const handleClose = () => {
  tutorialStore.closeFeatureModal();
  visible.value = false;
};
</script>

<style scoped>
.unlock-content {
  max-height: 300px;
  overflow-y: auto;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #667eea30;
  animation: slideIn 0.5s ease;
}

.feature-item:last-child {
  margin-bottom: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  font-size: 40px;
  margin-right: 16px;
  flex-shrink: 0;
}

.feature-info {
  flex: 1;
}

.feature-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.feature-desc {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 18px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
