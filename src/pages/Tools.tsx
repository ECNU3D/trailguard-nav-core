import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Mountain, Compass, Heart, Phone, MapPin, Navigation } from "lucide-react";
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
      </div>
    </div>
  );
};

export default Tools;