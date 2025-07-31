import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, Language } from "@/contexts/LanguageContext";
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
  Volume2,
  Languages
} from "lucide-react";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      {/* 用户信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("settings.profile.title")}</CardTitle>
              <CardDescription>{t("settings.profile.days")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <User className="h-4 w-4 mr-2" />
            {t("settings.profile.edit")}
          </Button>
        </CardContent>
      </Card>

      {/* 设置选项 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{t("settings.app_settings")}</h3>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Languages className="h-5 w-5 text-forest-primary" />
                <div>
                  <div className="font-medium text-sm">{t("settings.language")}</div>
                  <div className="text-xs text-muted-foreground">{t("settings.language.desc")}</div>
                </div>
              </div>
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-forest-primary" />
                <div>
                  <div className="font-medium text-sm">{t("settings.notifications")}</div>
                  <div className="text-xs text-muted-foreground">{t("settings.notifications.desc")}</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-forest-secondary" />
                <div>
                  <div className="font-medium text-sm">{t("settings.offline")}</div>
                  <div className="text-xs text-muted-foreground">{t("settings.offline.desc")}</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5 text-earth-accent" />
                <div>
                  <div className="font-medium text-sm">{t("settings.voice")}</div>
                  <div className="text-xs text-muted-foreground">{t("settings.voice.desc")}</div>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 功能入口 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{t("settings.more_features")}</h3>
        
        <div className="grid gap-3">
          {[
            { icon: Download, title: t("settings.offline_maps"), desc: t("settings.offline_maps.desc"), badge: t("settings.new_feature") },
            { icon: Shield, title: t("settings.privacy"), desc: t("settings.privacy.desc") },
            { icon: Smartphone, title: t("settings.device"), desc: t("settings.device.desc") },
            { icon: HelpCircle, title: t("settings.help"), desc: t("settings.help.desc") },
            { icon: Star, title: t("settings.rate"), desc: t("settings.rate.desc") }
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
        <div className="text-sm font-medium">{t("app.title")}</div>
        <div className="text-xs text-muted-foreground">{t("settings.version")}</div>
        <div className="text-xs text-muted-foreground">
          {t("app.subtitle")}
        </div>
      </div>
    </div>
  );
};

export default Settings;