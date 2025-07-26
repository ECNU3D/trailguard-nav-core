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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">户外指南</h1>
        <p className="text-sm sm:text-base text-muted-foreground">探索自然，安全第一</p>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">{/* 在大屏幕上使用两列布局 */}
        {guideTopics.map((topic, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-mobile transition-all duration-200 border-border">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{topic.icon}</div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg">{topic.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      {topic.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{topic.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{topic.difficulty}</span>
                  </div>
                </div>
                
                <Badge variant="secondary" className="text-xs self-start sm:self-center flex-shrink-0">
                  {topic.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-nature rounded-lg p-4 sm:p-6 text-center space-y-2 sm:space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">开始你的户外之旅</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          通过AI智能指导，让每次户外探险都更加安全和有趣
        </p>
      </div>
    </div>
  );
};

export default Guide;