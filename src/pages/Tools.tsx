import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Mountain, Compass, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const Tools = () => {
  const { t } = useLanguage();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");
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

      {/* 其他工具预览 */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Compass className="h-4 w-4 mr-2 text-forest-secondary" />
              指南针工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              基于设备传感器的数字指南针（即将推出）
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Heart className="h-4 w-4 mr-2 text-earth-accent" />
              急救助手
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              步骤式急救指导和紧急联系（即将推出）
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tools;