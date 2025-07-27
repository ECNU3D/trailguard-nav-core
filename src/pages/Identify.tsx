import { Button } from "@/components/ui/button";
import { Camera, Upload, Search } from "lucide-react";
import { useState } from "react";

const Identify = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleScanClick = () => {
    setIsCameraActive(true);
    // 这里将来会添加摄像头访问逻辑
  };

  const handleUploadClick = () => {
    // 这里将来会添加文件选择逻辑
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
              variant="outline" 
              onClick={() => setIsCameraActive(false)}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-white/90"
            >
              关闭相机
            </Button>
          </div>
        </div>
      )}

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