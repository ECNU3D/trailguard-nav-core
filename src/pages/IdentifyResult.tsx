import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle, Info, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 模拟数据 - 将来会从识别API获取
const mockResult = {
  userImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
  bestMatch: {
    commonName: "野生蘑菇",
    scientificName: "Amanita phalloides",
    referenceImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    edibility: "toxic", // "toxic" | "not-edible" | "edible"
    confidence: 85,
    guideId: "toxic-mushrooms"
  },
  otherMatches: [
    {
      name: "白色蘑菇",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
      confidence: 72
    },
    {
      name: "野生菌类",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop", 
      confidence: 68
    }
  ]
};

const IdentifyResult = () => {
  const navigate = useNavigate();

  const getSafetyBanner = (edibility: string) => {
    switch (edibility) {
      case "toxic":
        return {
          icon: AlertTriangle,
          text: "警告：剧毒！切勿触摸或食用！",
          bgColor: "bg-red-500",
          textColor: "text-white",
          iconColor: "text-white"
        };
      case "not-edible":
        return {
          icon: Info,
          text: "注意：不可食用。",
          bgColor: "bg-yellow-500",
          textColor: "text-black",
          iconColor: "text-black"
        };
      case "edible":
        return {
          icon: CheckCircle,
          text: "已知可食用 - 但仍需专家确认。",
          bgColor: "bg-green-500",
          textColor: "text-white",
          iconColor: "text-white"
        };
      default:
        return {
          icon: Info,
          text: "安全性未知 - 请勿食用。",
          bgColor: "bg-gray-500",
          textColor: "text-white",
          iconColor: "text-white"
        };
    }
  };

  const safetyInfo = getSafetyBanner(mockResult.bestMatch.edibility);
  const SafetyIcon = safetyInfo.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 返回按钮 */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/identify")}
        className="flex items-center space-x-2 p-0 h-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回识别</span>
      </Button>

      {/* 页面标题 */}
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">识别结果</h1>
      </div>

      {/* 用户提交的图片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">您的照片</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-square max-w-sm mx-auto rounded-lg overflow-hidden">
            <img 
              src={mockResult.userImage} 
              alt="用户提交的图片"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* 安全警告横幅 - 最突出的元素 */}
      <div className={`${safetyInfo.bgColor} ${safetyInfo.textColor} p-4 rounded-lg border-2 border-current shadow-lg`}>
        <div className="flex items-center space-x-3">
          <SafetyIcon className={`h-6 w-6 ${safetyInfo.iconColor} flex-shrink-0`} />
          <div>
            <div className="font-bold text-lg">{safetyInfo.text}</div>
            <div className="text-sm mt-1 opacity-90">
              仅供参考，请咨询专家确认
            </div>
          </div>
        </div>
      </div>

      {/* 最佳匹配结果 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            最佳匹配
            <Badge variant="secondary">
              置信度: {mockResult.bestMatch.confidence}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <img 
                src={mockResult.bestMatch.referenceImage}
                alt={mockResult.bestMatch.commonName}
                className="w-full aspect-square rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">{mockResult.bestMatch.commonName}</h3>
              <p className="text-muted-foreground italic">{mockResult.bestMatch.scientificName}</p>
              <Button 
                onClick={() => navigate(`/guide/${mockResult.bestMatch.guideId}`)}
                className="w-full sm:w-auto"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                查看详细资料
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 其他可能匹配项 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">其他可能的匹配</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {mockResult.otherMatches.map((match, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg border">
                <img 
                  src={match.image}
                  alt={match.name}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{match.name}</div>
                  <div className="text-xs text-muted-foreground">{match.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 免责声明 */}
      <div className="bg-muted rounded-lg p-4 text-center">
        <div className="text-sm text-muted-foreground">
          <strong>免责声明：</strong>此识别结果仅供参考。在涉及食用、触摸或任何用途之前，
          请务必咨询专业人士或权威资料确认。
        </div>
      </div>
    </div>
  );
};

export default IdentifyResult;