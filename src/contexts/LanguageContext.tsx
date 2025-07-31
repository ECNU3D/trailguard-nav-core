import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译资源
const translations = {
  zh: {
    // 通用
    'common.back': '返回',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.retry': '重试',
    
    // 应用标题
    'app.title': 'TrailGuard AI',
    'app.subtitle': '专业的户外探险智能助手',
    
    // 导航
    'nav.guide': '指南',
    'nav.identify': '识别',
    'nav.tools': '工具',
    'nav.settings': '设置',
    
    // 指南页面
    'guide.title': '户外指南',
    'guide.subtitle': '专业知识助您安全探险',
    'guide.categories.animals': '动物识别',
    'guide.categories.plants': '植物安全',
    'guide.categories.safety': '应急处理',
    'guide.categories.equipment': '装备指南',
    
    // 识别页面
    'identify.title': '智能识别',
    'identify.subtitle': 'AI助力快速识别动植物',
    'identify.scan': '扫描识别',
    'identify.upload': '从相册选择',
    'identify.preview': '预览识别结果示例',
    'identify.accuracy': '识别准确率',
    'identify.accuracy.desc': '基于深度学习技术，我们的AI模型在动植物识别方面达到了95%以上的准确率。',
    'identify.camera.instruction': '将物体置于框内中心位置',
    'identify.camera.capture': '拍照识别',
    'identify.processing': 'AI正在识别中...',
    'identify.processing.desc': '请稍候，这可能需要几秒钟',
    'identify.error.title': '识别失败',
    'identify.error.desc': '请重试或选择其他照片',
    
    // 识别结果页面
    'result.title': '识别结果',
    'result.best_match': '最佳匹配',
    'result.confidence': '置信度',
    'result.view_details': '查看详细信息',
    'result.other_matches': '其他可能匹配',
    'result.disclaimer': '识别结果仅供参考，请勿仅凭此结果做出涉及安全的决定。',
    'result.safety.toxic': '剧毒！切勿接触',
    'result.safety.not_edible': '不可食用',
    'result.safety.edible': '可安全食用',
    
    // 工具页面
    'tools.title': '实用工具',
    'tools.subtitle': '户外探险必备助手',
    'tools.checklist.title': '行前装备清单',
    'tools.checklist.desc': '定制您的户外装备清单',
    'tools.checklist.placeholder': '添加装备项目...',
    'tools.checklist.add': '添加',
    'tools.checklist.empty': '还没有添加任何装备项目',
    'tools.checklist.empty.desc': '开始添加您需要的装备吧！',
    'tools.emergency.title': '紧急联系',
    'tools.emergency.desc': '一键拨打救援电话',
    'tools.weather.title': '天气查询',
    'tools.weather.desc': '获取当前位置天气信息',
    'tools.compass.title': '指南针',
    'tools.compass.desc': '基础方向导航工具',
    
    // 设置页面
    'settings.title': '设置',
    'settings.subtitle': '个性化您的TrailGuard AI体验',
    'settings.profile.title': '户外探险者',
    'settings.profile.days': '加入TrailGuard AI 30天',
    'settings.profile.edit': '编辑个人资料',
    'settings.app_settings': '应用设置',
    'settings.language': '语言',
    'settings.language.desc': '选择您的首选语言',
    'settings.notifications': '推送通知',
    'settings.notifications.desc': '接收重要提醒和更新',
    'settings.offline': '离线模式',
    'settings.offline.desc': '在无网络时保持基本功能',
    'settings.voice': '语音提示',
    'settings.voice.desc': '启用语音导航和提醒',
    'settings.more_features': '更多功能',
    'settings.offline_maps': '离线地图',
    'settings.offline_maps.desc': '下载离线地图包',
    'settings.privacy': '隐私设置',
    'settings.privacy.desc': '管理数据和隐私选项',
    'settings.device': '设备管理',
    'settings.device.desc': '连接和管理外部设备',
    'settings.help': '帮助中心',
    'settings.help.desc': '使用指南和常见问题',
    'settings.rate': '评价应用',
    'settings.rate.desc': '在应用商店给我们评分',
    'settings.version': '版本 1.0.0',
    'settings.new_feature': '新功能',
    
    // 网络状态
    'network.offline': '您已离线，部分功能受限',
    'network.online': '在线，已同步',
  },
  
  en: {
    // 通用
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.retry': 'Retry',
    
    // 应用标题
    'app.title': 'TrailGuard AI',
    'app.subtitle': 'Professional Outdoor Adventure Assistant',
    
    // 导航
    'nav.guide': 'Guide',
    'nav.identify': 'Identify',
    'nav.tools': 'Tools',
    'nav.settings': 'Settings',
    
    // 指南页面
    'guide.title': 'Outdoor Guide',
    'guide.subtitle': 'Professional knowledge for safe adventures',
    'guide.categories.animals': 'Animal Identification',
    'guide.categories.plants': 'Plant Safety',
    'guide.categories.safety': 'Emergency Response',
    'guide.categories.equipment': 'Equipment Guide',
    
    // 识别页面
    'identify.title': 'Smart Identification',
    'identify.subtitle': 'AI-powered rapid species identification',
    'identify.scan': 'Scan & Identify',
    'identify.upload': 'Choose from Gallery',
    'identify.preview': 'Preview Result Example',
    'identify.accuracy': 'Identification Accuracy',
    'identify.accuracy.desc': 'Based on deep learning technology, our AI model achieves over 95% accuracy in species identification.',
    'identify.camera.instruction': 'Center the object within the frame',
    'identify.camera.capture': 'Capture & Identify',
    'identify.processing': 'AI is identifying...',
    'identify.processing.desc': 'Please wait, this may take a few seconds',
    'identify.error.title': 'Identification Failed',
    'identify.error.desc': 'Please try again or select another photo',
    
    // 识别结果页面
    'result.title': 'Identification Result',
    'result.best_match': 'Best Match',
    'result.confidence': 'Confidence',
    'result.view_details': 'View Details',
    'result.other_matches': 'Other Possible Matches',
    'result.disclaimer': 'Identification results are for reference only. Do not make safety decisions based solely on these results.',
    'result.safety.toxic': 'Highly Toxic! Do Not Touch',
    'result.safety.not_edible': 'Not Edible',
    'result.safety.edible': 'Safe to Consume',
    
    // 工具页面
    'tools.title': 'Utility Tools',
    'tools.subtitle': 'Essential outdoor adventure helpers',
    'tools.checklist.title': 'Pre-Trip Equipment Checklist',
    'tools.checklist.desc': 'Customize your outdoor gear checklist',
    'tools.checklist.placeholder': 'Add equipment item...',
    'tools.checklist.add': 'Add',
    'tools.checklist.empty': 'No equipment items added yet',
    'tools.checklist.empty.desc': 'Start adding the gear you need!',
    'tools.emergency.title': 'Emergency Contact',
    'tools.emergency.desc': 'One-tap emergency rescue call',
    'tools.weather.title': 'Weather Check',
    'tools.weather.desc': 'Get current location weather info',
    'tools.compass.title': 'Compass',
    'tools.compass.desc': 'Basic directional navigation tool',
    
    // 设置页面
    'settings.title': 'Settings',
    'settings.subtitle': 'Personalize your TrailGuard AI experience',
    'settings.profile.title': 'Outdoor Explorer',
    'settings.profile.days': 'Joined TrailGuard AI 30 days ago',
    'settings.profile.edit': 'Edit Profile',
    'settings.app_settings': 'App Settings',
    'settings.language': 'Language',
    'settings.language.desc': 'Choose your preferred language',
    'settings.notifications': 'Push Notifications',
    'settings.notifications.desc': 'Receive important alerts and updates',
    'settings.offline': 'Offline Mode',
    'settings.offline.desc': 'Maintain basic functionality when offline',
    'settings.voice': 'Voice Prompts',
    'settings.voice.desc': 'Enable voice navigation and alerts',
    'settings.more_features': 'More Features',
    'settings.offline_maps': 'Offline Maps',
    'settings.offline_maps.desc': 'Download offline map packages',
    'settings.privacy': 'Privacy Settings',
    'settings.privacy.desc': 'Manage data and privacy options',
    'settings.device': 'Device Management',
    'settings.device.desc': 'Connect and manage external devices',
    'settings.help': 'Help Center',
    'settings.help.desc': 'User guides and FAQ',
    'settings.rate': 'Rate App',
    'settings.rate.desc': 'Rate us on the app store',
    'settings.version': 'Version 1.0.0',
    'settings.new_feature': 'New',
    
    // 网络状态
    'network.offline': 'You are offline, some features limited',
    'network.online': 'Online, synchronized',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('trailguard_language');
    return (saved as Language) || 'zh';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('trailguard_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  useEffect(() => {
    // 初始化时设置语言
    localStorage.setItem('trailguard_language', language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};