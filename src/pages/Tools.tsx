import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Thermometer, Wind, Sun, Moon, MapPin, Timer, AlertTriangle } from "lucide-react";

const tools = [
  {
    icon: Compass,
    title: "指南针",
    description: "数字指南针导航",
    action: "打开指南针",
    color: "forest-primary"
  },
  {
    icon: Thermometer,
    title: "天气检测",
    description: "实时天气和温度",
    action: "查看天气",
    color: "forest-secondary"
  },
  {
    icon: Wind,
    title: "风速监测",
    description: "风速和风向信息",
    action: "检测风速",
    color: "earth-accent"
  },
  {
    icon: Sun,
    title: "日出日落",
    description: "日照时间计算",
    action: "查看时间",
    color: "forest-primary"
  },
  {
    icon: MapPin,
    title: "GPS定位",
    description: "当前位置坐标",
    action: "获取位置",
    color: "forest-secondary"
  },
  {
    icon: Timer,
    title: "徒步计时",
    description: "记录行程时间",
    action: "开始计时",
    color: "earth-accent"
  }
];

const Tools = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">户外工具</h1>
        <p className="text-muted-foreground">实用的户外探险工具集</p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card key={index} className="cursor-pointer hover:shadow-mobile transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${tool.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`w-full border-${tool.color} text-${tool.color} hover:bg-${tool.color}/10`}
                >
                  {tool.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-nature border-border/50">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-12 h-12 bg-earth-accent rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-lg">紧急求助</CardTitle>
          <CardDescription>
            一键发送位置信息给紧急联系人
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />
            紧急求助
          </Button>
        </CardContent>
      </Card>

      <div className="bg-muted rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Moon className="h-4 w-4 text-forest-primary" />
          <span className="font-medium text-sm">离线可用</span>
        </div>
        <div className="text-xs text-muted-foreground">
          大部分工具功能在没有网络连接时也可以正常使用，确保您在野外的安全。
        </div>
      </div>
    </div>
  );
};

export default Tools;