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
     'result.disclaimer_title': '免责声明',
     'result.user_photo': '您的照片',
    
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
    'tools.compass.heading': '方向',
    'tools.compass.coordinates': '坐标',
    'tools.compass.altitude': '海拔',
    'tools.compass.accuracy': '精度',
    'tools.compass.calibrate': '校准指南针',
    'tools.compass.location_error': '无法获取位置信息',
    
    // 紧急联系
    'tools.emergency.add_contact': '添加紧急联系人',
    'tools.emergency.default_contacts': '默认救援号码',
    'tools.emergency.share_location': '分享位置',
    'tools.emergency.location_shared': '位置已分享',
    'tools.emergency.call': '拨打电话',
    'tools.emergency.mountain_rescue': '山地救援',
    'tools.emergency.forest_police': '森林公安',
    'tools.emergency.medical_emergency': '医疗急救',
    
    // 示例数据
    'example.mushroom.death_cap': '死帽菇',
    'example.mushroom.white_mushroom': '白蘑菇',
    'example.mushroom.wild_mushroom': '野生蘑菇',
    'example.mushroom.porcini': '牛肝菌',
    'example.mushroom.fly_agaric': '毒蝇伞',
    'example.mushroom.morel': '羊肚菌',
    'example.plant.wild_rose': '野玫瑰',
    'example.plant.rose': '月季花',
    'example.plant.dog_rose': '蔷薇',
    
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
    
    // 指南详情页面
    'guide.detail.back': '返回指南列表',
    'guide.detail.not_found': '未找到指南内容',
    'guide.detail.read_time': '阅读时间',
    'guide.detail.difficulty': '难度',
    'guide.detail.description': '详细说明',
    'guide.detail.preparation': '准备工作',
    'guide.detail.steps': '操作步骤',
    'guide.detail.precautions': '注意事项',
    'guide.detail.safety_reminder': '重要提醒',
    'guide.detail.safety_note': '在执行任何户外生存技能时，安全始终是第一优先级。如果情况超出你的能力范围，请立即寻求专业帮助。',
    'guide.detail.image_loading': '图片加载中...',
    'guide.detail.step1': '第一步：观察并评估情况',
    'guide.detail.step2': '第二步：采取适当的预防措施',
    'guide.detail.step3': '第三步：执行主要操作',
    'guide.detail.step4': '第四步：检查结果并进行调整',
    'guide.detail.prep1': '确保周围环境安全',
    'guide.detail.prep2': '准备必要的工具和材料',
    'guide.detail.prep3': '评估当前状况',
    
    // 指南列表页面
    'guide.list.title': '户外生存指南',
    'guide.list.subtitle': '探索自然，安全第一',
    'guide.list.search': '搜索指南内容...',
    'guide.list.no_results': '没有找到相关指南',
    'guide.list.all': '全部',
    'guide.list.first_aid': '急救',
    'guide.list.shelter': '庇护所',
    'guide.list.plants': '植物',
    'guide.list.survival': '生存',
    'guide.list.navigation': '导航',
    
    // 指南条目
    'guide.entries.basic_first_aid': '基础急救处理',
    'guide.entries.basic_first_aid_desc': '处理外伤、止血和紧急医疗情况的基本方法',
    'guide.entries.shelter': '搭建临时庇护所',
    'guide.entries.shelter_desc': '使用自然材料快速搭建可靠的临时避难所',
    'guide.entries.edible_plants': '可食用野生植物识别',
    'guide.entries.edible_plants_desc': '识别常见可食用植物，避免有毒物种',
    'guide.entries.water': '寻找和净化水源',
    'guide.entries.water_desc': '在野外寻找安全水源并进行基本净化',
    'guide.entries.navigation': '户外导航基础',
    'guide.entries.navigation_desc': '使用指南针和自然标志进行方向定位',
    'guide.entries.fire': '生火技巧',
    'guide.entries.fire_desc': '在各种天气条件下安全生火的方法',
    
    // 级别
    'guide.level.beginner': '初级',
    'guide.level.intermediate': '中级',
    'guide.level.advanced': '高级',
    
    // 首页
    'index.welcome': '欢迎来到您的空白应用',
    'index.subtitle': '在这里开始构建您的精彩项目！',
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
     'result.disclaimer_title': 'Disclaimer',
     'result.user_photo': 'Your Photo',
    
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
    'tools.compass.heading': 'Heading',
    'tools.compass.coordinates': 'Coordinates',
    'tools.compass.altitude': 'Altitude',
    'tools.compass.accuracy': 'Accuracy',
    'tools.compass.calibrate': 'Calibrate Compass',
    'tools.compass.location_error': 'Unable to get location',
    
    // Emergency Contacts
    'tools.emergency.add_contact': 'Add Emergency Contact',
    'tools.emergency.default_contacts': 'Default Rescue Numbers',
    'tools.emergency.share_location': 'Share Location',
    'tools.emergency.location_shared': 'Location Shared',
    'tools.emergency.call': 'Call',
    'tools.emergency.mountain_rescue': 'Mountain Rescue',
    'tools.emergency.forest_police': 'Forest Police',
    'tools.emergency.medical_emergency': 'Medical Emergency',
    
    // 示例数据
    'example.mushroom.death_cap': 'Death Cap',
    'example.mushroom.white_mushroom': 'White Mushroom', 
    'example.mushroom.wild_mushroom': 'Wild Mushroom',
    'example.mushroom.porcini': 'Porcini',
    'example.mushroom.fly_agaric': 'Fly Agaric',
    'example.mushroom.morel': 'Morel',
    'example.plant.wild_rose': 'Wild Rose',
    'example.plant.rose': 'Rose',
    'example.plant.dog_rose': 'Dog Rose',
    
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
    
    // 指南详情页面
    'guide.detail.back': 'Back to Guide List',
    'guide.detail.not_found': 'Guide content not found',
    'guide.detail.read_time': 'Reading time',
    'guide.detail.difficulty': 'Difficulty',
    'guide.detail.description': 'Detailed Description',
    'guide.detail.preparation': 'Preparation',
    'guide.detail.steps': 'Steps',
    'guide.detail.precautions': 'Precautions',
    'guide.detail.safety_reminder': 'Important Reminder',
    'guide.detail.safety_note': 'Safety is always the top priority when performing any outdoor survival skills. If the situation exceeds your capabilities, seek professional help immediately.',
    'guide.detail.image_loading': 'Loading image...',
    'guide.detail.step1': 'Step 1: Observe and assess the situation',
    'guide.detail.step2': 'Step 2: Take appropriate precautions',
    'guide.detail.step3': 'Step 3: Execute main operation',
    'guide.detail.step4': 'Step 4: Check results and make adjustments',
    'guide.detail.prep1': 'Ensure surrounding environment is safe',
    'guide.detail.prep2': 'Prepare necessary tools and materials',
    'guide.detail.prep3': 'Assess current situation',
    
    // 指南列表页面
    'guide.list.title': 'Outdoor Survival Guide',
    'guide.list.subtitle': 'Explore nature, safety first',
    'guide.list.search': 'Search guide content...',
    'guide.list.no_results': 'No related guides found',
    'guide.list.all': 'All',
    'guide.list.first_aid': 'First Aid',
    'guide.list.shelter': 'Shelter',
    'guide.list.plants': 'Plants',
    'guide.list.survival': 'Survival',
    'guide.list.navigation': 'Navigation',
    
    // 指南条目
    'guide.entries.basic_first_aid': 'Basic First Aid',
    'guide.entries.basic_first_aid_desc': 'Basic methods for treating wounds, bleeding, and emergency medical situations',
    'guide.entries.shelter': 'Building Temporary Shelter',
    'guide.entries.shelter_desc': 'Quickly build reliable temporary shelters using natural materials',
    'guide.entries.edible_plants': 'Edible Wild Plant Identification',
    'guide.entries.edible_plants_desc': 'Identify common edible plants and avoid toxic species',
    'guide.entries.water': 'Finding and Purifying Water',
    'guide.entries.water_desc': 'Find safe water sources in the wild and perform basic purification',
    'guide.entries.navigation': 'Outdoor Navigation Basics',
    'guide.entries.navigation_desc': 'Use compass and natural landmarks for directional positioning',
    'guide.entries.fire': 'Fire Making Skills',
    'guide.entries.fire_desc': 'Safe fire making methods in various weather conditions',
    
    // 级别
    'guide.level.beginner': 'Beginner',
    'guide.level.intermediate': 'Intermediate',
    'guide.level.advanced': 'Advanced',
    
    // 首页
    'index.welcome': 'Welcome to Your Blank App',
    'index.subtitle': 'Start building your amazing project here!',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('trailguard_language');
    if (saved) {
      return saved as Language;
    }
    
    // 根据浏览器语言自动设置
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
    return 'en';
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