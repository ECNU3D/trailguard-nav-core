import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Mountain, Compass, Heart, Phone, MessageSquare, Navigation, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'rescue' | 'medical' | 'custom';
}

const Tools = () => {
  const { t } = useLanguage();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [compassHeading, setCompassHeading] = useState(0);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
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

    // 初始化默认紧急联系人
    const defaultContacts: EmergencyContact[] = [
      { id: '1', name: t('tools.emergency.default.police'), phone: '110', type: 'police' },
      { id: '2', name: t('tools.emergency.default.rescue'), phone: '120', type: 'rescue' },
      { id: '3', name: t('tools.emergency.default.medical'), phone: '119', type: 'medical' },
    ];
    setEmergencyContacts(defaultContacts);

    // 模拟指南针更新
    const updateCompass = () => {
      setCompassHeading(prev => (prev + 1) % 360);
    };
    const interval = setInterval(updateCompass, 1000);
    return () => clearInterval(interval);
  }, [t]);

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

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  // 获取方向名称
  const getCompassDirection = (heading: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  // 紧急联系功能
  const makeEmergencyCall = (contact: EmergencyContact) => {
    toast({
      title: `${t('tools.emergency.call')} ${contact.name}`,
      description: contact.phone,
    });
  };

  const sendLocationMessage = (contact: EmergencyContact) => {
    toast({
      title: t('tools.emergency.message'),
      description: `${t('tools.emergency.location.desc')} ${contact.name}`,
    });
  };

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

      {/* 指南针工具 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center">
            <Compass className="h-5 w-5 mr-2 text-forest-secondary" />
            {t('tools.compass.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {/* 指南针显示 */}
            <div className="relative w-32 h-32 border-4 border-border rounded-full bg-gradient-to-br from-background to-muted">
              <div 
                className="absolute inset-2 bg-forest-primary rounded-full flex items-center justify-center transform transition-transform duration-1000"
                style={{ transform: `rotate(${compassHeading}deg)` }}
              >
                <Navigation className="h-8 w-8 text-white" />
              </div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-foreground">N</div>
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-muted-foreground">E</div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-muted-foreground">S</div>
              <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-muted-foreground">W</div>
            </div>
            
            {/* 方位信息 */}
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">
                {compassHeading}° {getCompassDirection(compassHeading)}
              </div>
              <p className="text-sm text-muted-foreground">{t('tools.compass.heading')}</p>
            </div>
            
            {/* 模拟数据 */}
            <div className="grid grid-cols-2 gap-4 w-full text-sm">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <MapPin className="h-4 w-4 mr-1 text-forest-primary" />
                  <span className="font-medium">{t('tools.compass.coordinates')}</span>
                </div>
                <div className="text-xs text-muted-foreground">39.9042°N<br />116.4074°E</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Mountain className="h-4 w-4 mr-1 text-forest-primary" />
                  <span className="font-medium">{t('tools.compass.altitude')}</span>
                </div>
                <div className="text-xs text-muted-foreground">43m</div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              {t('tools.compass.calibrate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 紧急联系工具 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center">
            <Heart className="h-5 w-5 mr-2 text-earth-accent" />
            {t('tools.emergency.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 位置共享 */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-forest-primary" />
                <span className="font-medium">{t('tools.emergency.location.sharing')}</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground">{t('tools.emergency.location.desc')}</p>
          </div>
          
          {/* 紧急联系人列表 */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">{t('tools.emergency.contacts')}</h4>
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-3 ${
                    contact.type === 'police' ? 'bg-blue-500' :
                    contact.type === 'rescue' ? 'bg-orange-500' :
                    contact.type === 'medical' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-foreground">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.phone}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => makeEmergencyCall(contact)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendLocationMessage(contact)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tools;