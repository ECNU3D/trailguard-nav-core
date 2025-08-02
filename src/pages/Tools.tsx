import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Mountain, Compass, Heart, Phone, MapPin, Navigation, Camera, Video, Shield, Volume2, CloudRain, Wind, Sun, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface CompassData {
  heading: number;
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'rescue' | 'police' | 'medical' | 'personal';
}

interface EnvironmentData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  sunrise: string;
  sunset: string;
  weather: string;
  uvIndex: number;
}

interface SentryData {
  isActive: boolean;
  lastAlert: string;
  threatLevel: 'low' | 'medium' | 'high';
  soundLevel: number;
  detectedSounds: string[];
}

const Tools = () => {
  const { t } = useLanguage();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [compassData, setCompassData] = useState<CompassData>({
    heading: 0,
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0
  });
  const [emergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: t('tools.emergency.mountain_rescue'), phone: '110', type: 'rescue' },
    { id: '2', name: t('tools.emergency.forest_police'), phone: '119', type: 'police' },
    { id: '3', name: t('tools.emergency.medical_emergency'), phone: '120', type: 'medical' }
  ]);
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({
    temperature: 18,
    windSpeed: 12,
    humidity: 65,
    sunrise: "06:15",
    sunset: "18:45",
    weather: "partly_cloudy",
    uvIndex: 6
  });
  const [sentryData, setSentryData] = useState<SentryData>({
    isActive: false,
    lastAlert: "",
    threatLevel: "low",
    soundLevel: 35,
    detectedSounds: []
  });
  const { toast } = useToast();

  // 从 Local Storage 加载清单
  useEffect(() => {
    const savedChecklist = localStorage.getItem("trailguard-checklist");
    if (savedChecklist) {
      try {
        setChecklist(JSON.parse(savedChecklist));
      } catch (error) {
        console.error("Failed to load checklist:", error);
      }
    }
  }, []);

  // 模拟指南针数据更新
  useEffect(() => {
    const updateCompass = () => {
      setCompassData({
        heading: Math.floor(Math.random() * 360),
        latitude: 31.2304 + (Math.random() - 0.5) * 0.01,
        longitude: 121.4737 + (Math.random() - 0.5) * 0.01,
        altitude: 10 + Math.floor(Math.random() * 100),
        accuracy: 3 + Math.floor(Math.random() * 7)
      });
    };

    updateCompass();
    const interval = setInterval(updateCompass, 2000);
    return () => clearInterval(interval);
  }, []);

  // 保存清单到 Local Storage
  const saveChecklist = (items: ChecklistItem[]) => {
    localStorage.setItem("trailguard-checklist", JSON.stringify(items));
    setChecklist(items);
  };

  // 添加新项目
  const addItem = () => {
    if (!newItem.trim()) {
      toast({
        title: t("tools.checklist.placeholder"),
        variant: "destructive",
      });
      return;
    }

    const newChecklistItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      completed: false,
      createdAt: Date.now()
    };

    const updatedChecklist = [...checklist, newChecklistItem];
    saveChecklist(updatedChecklist);
    setNewItem("");
    
    toast({
      title: t("language") === "zh" ? "已添加装备" : "Equipment Added",
      description: newItem.trim(),
    });
  };

  // 切换完成状态
  const toggleItem = (id: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveChecklist(updatedChecklist);
  };

  // 删除项目
  const deleteItem = (id: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== id);
    saveChecklist(updatedChecklist);
    
    toast({
      title: t("language") === "zh" ? "已删除装备" : "Equipment Removed",
    });
  };

  // 处理回车键添加
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  // 处理紧急呼叫
  const handleEmergencyCall = (phone: string, name: string) => {
    toast({
      title: t("language") === "zh" ? "正在拨打电话" : "Calling",
      description: `${name}: ${phone}`,
    });
  };

  // 分享位置
  const shareLocation = () => {
    const location = `${compassData.latitude.toFixed(6)}, ${compassData.longitude.toFixed(6)}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Location',
        text: `${t('tools.emergency.share_location')}: ${location}`,
      });
    } else {
      navigator.clipboard.writeText(location);
      toast({
        title: t('tools.emergency.location_shared'),
        description: location,
      });
    }
  };

  // 环境监测功能
  const startEnvironmentScan = () => {
    toast({
      title: t("tools.environment.start_scan"),
      description: t("tools.environment.scanning"),
    });
    
    // 模拟环境数据更新
    setTimeout(() => {
      setEnvironmentData({
        temperature: 15 + Math.floor(Math.random() * 20),
        windSpeed: Math.floor(Math.random() * 25),
        humidity: 40 + Math.floor(Math.random() * 40),
        sunrise: "06:15",
        sunset: "18:45",
        weather: ["sunny", "cloudy", "partly_cloudy", "rainy"][Math.floor(Math.random() * 4)],
        uvIndex: Math.floor(Math.random() * 11)
      });
      
      toast({
        title: t("tools.environment.scan_complete"),
        description: t("tools.environment.data_updated"),
      });
    }, 2000);
  };

  // 哨兵模式功能
  const toggleSentryMode = () => {
    const newActiveState = !sentryData.isActive;
    setSentryData(prev => ({
      ...prev,
      isActive: newActiveState,
      lastAlert: newActiveState ? "" : new Date().toLocaleTimeString(),
      detectedSounds: newActiveState ? [] : prev.detectedSounds
    }));
    
    toast({
      title: newActiveState 
        ? t("tools.sentry.activated")
        : t("tools.sentry.deactivated"),
      description: newActiveState 
        ? t("tools.sentry.monitoring")
        : t("tools.sentry.stopped"),
    });

    if (newActiveState) {
      // 模拟声音检测
      const detectionInterval = setInterval(() => {
        if (!sentryData.isActive) {
          clearInterval(detectionInterval);
          return;
        }
        
        const sounds = ["风声", "鸟叫", "树枝断裂", "脚步声"];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        const soundLevel = 20 + Math.floor(Math.random() * 60);
        
        setSentryData(prev => ({
          ...prev,
          soundLevel,
          detectedSounds: [...prev.detectedSounds.slice(-4), randomSound],
          threatLevel: soundLevel > 70 ? "high" : soundLevel > 50 ? "medium" : "low"
        }));
        
        if (soundLevel > 70) {
          toast({
            title: t("tools.sentry.high_sound_alert"),
            description: `${t("tools.sentry.detected")}: ${randomSound} (${soundLevel}dB)`,
            variant: "destructive"
          });
        }
      }, 3000);
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("tools.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("tools.subtitle")}</p>
      </div>

      {/* 行前装备清单 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center">
            <Mountain className="h-5 w-5 mr-2 text-forest-primary" />
            {t("tools.checklist.title")}
            {totalCount > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {completedCount}/{totalCount} {t("language") === "zh" ? "已完成" : "completed"}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 添加新装备 */}
          <div className="flex gap-2">
            <Input
              placeholder={t("tools.checklist.placeholder")}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={addItem}
              className="bg-forest-primary hover:bg-forest-primary/90 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 清单列表 */}
          {checklist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mountain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t("tools.checklist.empty")}</p>
              <p className="text-sm">{t("tools.checklist.empty.desc")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    item.completed 
                      ? "bg-muted/50 border-muted" 
                      : "bg-background border-border hover:bg-muted/30"
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span
                    className={`flex-1 ${
                      item.completed 
                        ? "line-through text-muted-foreground" 
                        : "text-foreground"
                    }`}
                  >
                    {item.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 其他工具 */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* 指南针工具 */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Compass className="h-4 w-4 mr-2 text-forest-secondary" />
                  {t('tools.compass.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('tools.compass.desc')}
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-forest-secondary" />
                {t('tools.compass.title')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* 指南针圆盘 */}
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-border bg-background">
                  <div 
                    className="absolute top-1 left-1/2 w-1 h-6 bg-red-500 origin-bottom transform -translate-x-1/2"
                    style={{ transform: `translateX(-50%) rotate(${compassData.heading}deg)` }}
                  />
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">E</div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">S</div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs">W</div>
                </div>
              </div>
              
              {/* 指南针数据 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">{t('tools.compass.heading')}</div>
                  <div className="font-mono">{compassData.heading}°</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">{t('tools.compass.accuracy')}</div>
                  <div className="font-mono">±{compassData.accuracy}m</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">{t('tools.compass.altitude')}</div>
                  <div className="font-mono">{compassData.altitude}m</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">{t('tools.compass.coordinates')}</div>
                  <div className="font-mono text-xs">
                    {compassData.latitude.toFixed(4)}, {compassData.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: t('tools.compass.calibrate'), description: t('language') === 'zh' ? '指南针已校准' : 'Compass calibrated' })}
              >
                {t('tools.compass.calibrate')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 紧急联系工具 */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-earth-accent" />
                  {t('tools.emergency.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('tools.emergency.desc')}
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-earth-accent" />
                {t('tools.emergency.title')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* 位置分享 */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={shareLocation}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t('tools.emergency.share_location')}
              </Button>
              
              {/* 紧急联系人列表 */}
              <div>
                <h4 className="text-sm font-medium mb-2">{t('tools.emergency.default_contacts')}</h4>
                <div className="space-y-2">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div>
                        <div className="font-medium text-sm">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.phone}</div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        {t('tools.emergency.call')}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 环境监测工具 */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Camera className="h-4 w-4 mr-2 text-sky-500" />
                  {t("tools.environment.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("tools.environment.desc")}
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-sky-500" />
                {t("tools.environment.title")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* 环境数据显示 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {t("tools.environment.temperature")}
                  </div>
                  <div className="font-mono">{environmentData.temperature}°C</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center">
                    <Wind className="h-3 w-3 mr-1" />
                    {t("tools.environment.wind_speed")}
                  </div>
                  <div className="font-mono">{environmentData.windSpeed} km/h</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center">
                    <CloudRain className="h-3 w-3 mr-1" />
                    {t("tools.environment.humidity")}
                  </div>
                  <div className="font-mono">{environmentData.humidity}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center">
                    <Sun className="h-3 w-3 mr-1" />
                    {t("tools.environment.uv_index")}
                  </div>
                  <div className="font-mono">{environmentData.uvIndex}/11</div>
                </div>
              </div>

              {/* 日出日落时间 */}
              <div className="border rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-medium">{t("tools.environment.sunlight")}</h4>
                <div className="flex justify-between text-sm">
                  <span>{t("tools.environment.sunrise")}: {environmentData.sunrise}</span>
                  <span>{t("tools.environment.sunset")}: {environmentData.sunset}</span>
                </div>
              </div>

              {/* 天气状况 */}
              <div className="border rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">{t("tools.environment.weather_forecast")}</h4>
                <div className="text-sm text-muted-foreground">
                  {environmentData.weather === "sunny" && t("tools.environment.weather.sunny")}
                  {environmentData.weather === "cloudy" && t("tools.environment.weather.cloudy")}
                  {environmentData.weather === "partly_cloudy" && t("tools.environment.weather.partly_cloudy")}
                  {environmentData.weather === "rainy" && t("tools.environment.weather.rainy")}
                </div>
              </div>
              
              <Button 
                onClick={startEnvironmentScan}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                {t("tools.environment.start_scan")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 哨兵模式工具 */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-amber-500" />
                  {t("tools.sentry.title")}
                  {sentryData.isActive && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("tools.sentry.desc")}
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2 text-amber-500" />
                {t("tools.sentry.title")}
                {sentryData.isActive && (
                  <div className="ml-auto flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                    {t("tools.sentry.active")}
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* 威胁等级指示器 */}
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{t("tools.sentry.threat_level")}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sentryData.threatLevel === 'high' ? 'bg-red-100 text-red-700' :
                    sentryData.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {sentryData.threatLevel === 'high' && t("tools.sentry.threat.high")}
                    {sentryData.threatLevel === 'medium' && t("tools.sentry.threat.medium")}
                    {sentryData.threatLevel === 'low' && t("tools.sentry.threat.low")}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("tools.sentry.current_volume")}: {sentryData.soundLevel}dB
                </div>
              </div>

              {/* 检测到的声音 */}
              {sentryData.detectedSounds.length > 0 && (
                <div className="border rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">{t("tools.sentry.recent_detections")}</h4>
                  <div className="space-y-1">
                    {sentryData.detectedSounds.slice(-3).map((sound, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        • {sound}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 控制按钮 */}
              <Button 
                onClick={toggleSentryMode}
                className={`w-full ${
                  sentryData.isActive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-amber-500 hover:bg-amber-600'
                } text-white`}
              >
                <Shield className="h-4 w-4 mr-2" />
                {sentryData.isActive 
                  ? t("tools.sentry.deactivate")
                  : t("tools.sentry.activate")
                }
              </Button>

              {sentryData.lastAlert && (
                <div className="text-xs text-muted-foreground text-center">
                  {t("tools.sentry.last_alert")}: {sentryData.lastAlert}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Tools;