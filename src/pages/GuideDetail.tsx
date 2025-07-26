import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User } from "lucide-react";
import { guideEntries } from "./GuideList";

interface GuideDetailProps {
  entryId: number;
  onGoBack: () => void;
}

const GuideDetail = ({ entryId, onGoBack }: GuideDetailProps) => {
  const entry = guideEntries.find(e => e.id === entryId);

  if (!entry) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={onGoBack}
          className="flex items-center space-x-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回指南列表</span>
        </Button>
        <div className="text-center py-8">
          <p className="text-muted-foreground">未找到指南内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 返回按钮 */}
      <Button 
        variant="ghost" 
        onClick={onGoBack}
        className="flex items-center space-x-2 text-sm hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回指南列表</span>
      </Button>

      {/* 标题区域 */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            {entry.title}
          </h1>
        </div>

        {/* 代表性图片 */}
        <div className="w-full h-48 sm:h-64 bg-muted rounded-lg flex items-center justify-center">
          <img 
            src={entry.image} 
            alt={entry.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="text-muted-foreground text-sm">图片加载中...</div>';
              }
            }}
          />
        </div>

        {/* 元信息 */}
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>阅读时间: {entry.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>难度: {entry.difficulty}</span>
                </div>
              </div>
              <Badge variant="secondary" className="self-start sm:self-center">
                {entry.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细内容 */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">详细说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm sm:prose-base max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {entry.description}
            </p>
            
            {/* 示例内容结构 */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-foreground">准备工作</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-medium">•</span>
                  <span>确保周围环境安全</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-medium">•</span>
                  <span>准备必要的工具和材料</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-medium">•</span>
                  <span>评估当前状况</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">操作步骤</h3>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                  <span>第一步：观察并评估情况</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                  <span>第二步：采取适当的预防措施</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                  <span>第三步：执行主要操作</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                  <span>第四步：检查结果并进行调整</span>
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-foreground">注意事项</h3>
              <div className="bg-accent/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">重要提醒：</span> 
                  在执行任何户外生存技能时，安全始终是第一优先级。如果情况超出你的能力范围，请立即寻求专业帮助。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 返回按钮 - 底部 */}
      <div className="flex justify-center pb-4">
        <Button 
          variant="outline" 
          onClick={onGoBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回指南列表</span>
        </Button>
      </div>
    </div>
  );
};

export default GuideDetail;