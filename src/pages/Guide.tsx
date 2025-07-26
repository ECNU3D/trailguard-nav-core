import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User } from "lucide-react";

const guideTopics = [
  {
    title: "徒步安全基础",
    description: "学习基本的徒步安全知识和准备工作",
    difficulty: "初级",
    duration: "15分钟",
    category: "安全",
    icon: "🥾"
  },
  {
    title: "野生动物识别",
    description: "如何识别和安全地观察常见野生动物",
    difficulty: "中级", 
    duration: "25分钟",
    category: "动物",
    icon: "🦌"
  },
  {
    title: "植物辨识指南",
    description: "识别有毒植物和可食用植物的技巧",
    difficulty: "中级",
    duration: "30分钟", 
    category: "植物",
    icon: "🌿"
  },
  {
    title: "导航技能",
    description: "使用指南针和地图进行野外导航",
    difficulty: "高级",
    duration: "45分钟",
    category: "导航",
    icon: "🧭"
  }
];

const Guide = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">户外指南</h1>
        <p className="text-muted-foreground">探索自然，安全第一</p>
      </div>

      <div className="grid gap-4">
        {guideTopics.map((topic, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-mobile transition-all duration-200 border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{topic.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {topic.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{topic.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{topic.difficulty}</span>
                  </div>
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  {topic.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-nature rounded-lg p-6 text-center space-y-3">
        <h3 className="text-lg font-semibold text-foreground">开始你的户外之旅</h3>
        <p className="text-sm text-muted-foreground">
          通过AI智能指导，让每次户外探险都更加安全和有趣
        </p>
      </div>
    </div>
  );
};

export default Guide;