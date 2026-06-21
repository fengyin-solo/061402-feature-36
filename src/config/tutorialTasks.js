export const tutorialTasksConfig = [
  {
    id: 'first-gather',
    title: '首次采集',
    description: '学习如何在海岛上采集生存资源。点击"采集食物"按钮开始你的第一次采集！',
    icon: '🍓',
    type: 'gather',
    targetAction: 'gatherFood',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    unlocked: true,
    unlockHint: '完成后解锁：探索系统入口提示',
    unlockFeatures: ['explore-hint'],
    order: 1
  },
  {
    id: 'first-explore',
    title: '首次探索',
    description: '海岛还有很多未知区域等待发现。点击地图上未探索的格子开始探索！',
    icon: '🗺️',
    type: 'explore',
    targetAction: 'exploreCell',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    unlocked: false,
    unlockHint: '完成后解锁：建造系统入口提示',
    unlockFeatures: ['build-hint'],
    order: 2
  },
  {
    id: 'first-build',
    title: '首次建造',
    description: '建造庇护所是生存的关键。收集足够的木材和石头，点击"建造庇护所"！',
    icon: '🏠',
    type: 'build',
    targetAction: 'buildShelter',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    unlocked: false,
    unlockHint: '完成后解锁：制作工具和高级功能',
    unlockFeatures: ['craft-tools', 'advanced-features'],
    order: 3
  }
];

export const featureDescriptions = {
  'explore-hint': {
    title: '探索系统已解锁',
    description: '你现在可以探索海岛上的未知区域了！点击地图上模糊的格子可能会发现资源或遇到危险。',
    icon: '🗺️'
  },
  'build-hint': {
    title: '建造系统已解锁',
    description: '你现在可以建造各种设施了！庇护所可以保护你免受恶劣天气的影响。',
    icon: '🏗️'
  },
  'craft-tools': {
    title: '制作工具已解锁',
    description: '制作工具可以大幅提高你的采集效率！尝试制作斧头和镐子吧。',
    icon: '🔨'
  },
  'advanced-features': {
    title: '高级功能已解锁',
    description: '恭喜完成新手引导！你现在可以体验游戏的全部内容，包括种植、养殖、交易等高级玩法。',
    icon: '🎉'
  }
};
