import { Button } from "@/components/ui/button";
import { Camera, Upload, Search, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getIdentification } from "@/lib/identification";
import { useToast } from "@/hooks/use-toast";

const Identify = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScanClick = () => {
    setIsCameraActive(true);
    // 这里将来会添加真实的摄像头访问逻辑
    // 现在模拟拍照后的识别流程
  };

  const handleCameraCapture = async () => {
    setIsCameraActive(false);
    setIsProcessing(true);
    
    try {
      // 模拟拍照获得的图片数据
      const mockImageData = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop";
      
      // 调用识别函数
      const result = await getIdentification(mockImageData);
      
      // 将结果存储到sessionStorage，以便结果页面使用
      sessionStorage.setItem("identificationResult", JSON.stringify(result));
      
      // 导航到结果页面
      navigate("/identify/result");
      
    } catch (error) {
      console.error("识别失败:", error);
      toast({
        title: "识别失败",
        description: "请重试或选择其他照片",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePreviewExample = () => {
    // 设置示例识别结果
    const exampleResult = {
      userImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
      bestMatch: {
        commonName: "死帽菇",
        scientificName: "Amanita phalloides",
        referenceImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
        edibility: "toxic",
        confidence: 92,
        guideId: "toxic-mushrooms"
      },
      otherMatches: [
        {
          name: "白蘑菇",
          image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
          confidence: 78
        },
        {
          name: "野生菌类", 
          image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
          confidence: 65
        }
      ]
    };
    
    sessionStorage.setItem("identificationResult", JSON.stringify(exampleResult));
    navigate("/identify/result");
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // 调用识别函数
      const result = await getIdentification(file);
      
      // 将结果存储到sessionStorage，以便结果页面使用
      sessionStorage.setItem("identificationResult", JSON.stringify(result));
      
      // 导航到结果页面
      navigate("/identify/result");
      
    } catch (error) {
      console.error("识别失败:", error);
      toast({
        title: "识别失败",
        description: "请重试或选择其他照片",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="text-center space-y-2 mb-8 sm:mb-12">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">智能识别</h1>
        <p className="text-sm sm:text-base text-muted-foreground">AI助力快速识别动植物</p>
      </div>

      {/* 相机取景框 overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative w-80 h-80 border-4 border-white rounded-lg">
            <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-lg m-4"></div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm">
              将物体置于框内中心位置
            </div>
            <Button 
              onClick={handleCameraCapture}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-white/90 mr-4"
            >
              拍照识别
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsCameraActive(false)}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 translate-x-20 bg-transparent border-white text-white hover:bg-white/10"
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {/* 处理中的遮罩层 */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-forest-primary" />
            <div className="text-lg font-medium">AI正在识别中...</div>
            <div className="text-sm text-muted-foreground">请稍候，这可能需要几秒钟</div>
          </div>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 px-4">
        {/* 主要扫描按钮 */}
        <Button 
          onClick={handleScanClick}
          className="w-full max-w-sm h-16 sm:h-20 text-lg sm:text-xl font-semibold bg-forest-primary hover:bg-forest-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Camera className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
          扫描识别
        </Button>

        {/* 从相册选择链接 */}
        <button 
          onClick={handleUploadClick}
          className="text-forest-primary hover:text-forest-primary/80 underline text-base sm:text-lg font-medium transition-colors"
        >
          <Upload className="h-4 w-4 inline mr-2" />
          从相册选择
        </button>

        {/* 预览示例按钮 */}
        <Button 
          variant="outline"
          onClick={handlePreviewExample}
          className="text-sm text-muted-foreground border-muted-foreground/30 hover:bg-muted"
        >
          预览识别结果示例
        </Button>

        {/* 识别准确率信息 */}
        <div className="w-full max-w-sm bg-muted rounded-lg p-4 mt-8">
          <div className="flex items-center space-x-2 mb-2">
            <Search className="h-4 w-4 text-forest-primary" />
            <span className="font-medium text-sm">识别准确率</span>
          </div>
          <div className="text-xs text-muted-foreground">
            基于深度学习技术，我们的AI模型在动植物识别方面达到了95%以上的准确率。
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identify;