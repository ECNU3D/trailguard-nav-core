import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  HelpCircle, 
  Star,
  ChevronRight,
  Smartphone,
  Wifi,
  Volume2
} from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">设置</h1>
        <p className="text-sm sm:text-base text-muted-foreground">个性化您的TrailGuard AI体验</p>
      </div>

      {/* 用户信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">户外探险者</CardTitle>
              <CardDescription>加入TrailGuard AI 30天</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <User className="h-4 w-4 mr-2" />
            编辑个人资料
          </Button>
        </CardContent>
      </Card>

      {/* 设置选项 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">应用设置</h3>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-forest-primary" />
                <div>
                  <div className="font-medium text-sm">推送通知</div>
                  <div className="text-xs text-muted-foreground">接收重要提醒和更新</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-forest-secondary" />
                <div>
                  <div className="font-medium text-sm">离线模式</div>
                  <div className="text-xs text-muted-foreground">在无网络时保持基本功能</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5 text-earth-accent" />
                <div>
                  <div className="font-medium text-sm">语音提示</div>
                  <div className="text-xs text-muted-foreground">启用语音导航和提醒</div>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 功能入口 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">更多功能</h3>
        
        <div className="grid gap-3">
          {[
            { icon: Download, title: "离线地图", desc: "下载离线地图包", badge: "新功能" },
            { icon: Shield, title: "隐私设置", desc: "管理数据和隐私选项" },
            { icon: Smartphone, title: "设备管理", desc: "连接和管理外部设备" },
            { icon: HelpCircle, title: "帮助中心", desc: "使用指南和常见问题" },
            { icon: Star, title: "评价应用", desc: "在应用商店给我们评分" }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-mobile transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-forest-primary" />
                      <div>
                        <div className="font-medium text-sm flex items-center space-x-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs py-0">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 应用信息 */}
      <div className="bg-muted rounded-lg p-4 text-center space-y-2">
        <div className="text-sm font-medium">TrailGuard AI</div>
        <div className="text-xs text-muted-foreground">版本 1.0.0</div>
        <div className="text-xs text-muted-foreground">
          专业的户外探险智能助手
        </div>
      </div>
    </div>
  );
};

export default Settings;