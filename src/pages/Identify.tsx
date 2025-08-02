import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Search, Loader2, Download, Lightbulb, Eye, Focus, RotateCcw, Clock, Trash2, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIdentification } from "@/lib/identification";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import GemmaInference from "@/lib/gemma-inference";

interface HistoryItem {
  id: string;
  commonName: string;
  confidence: number;
  timestamp: number;
  image: string;
}

const Identify = () => {
  const { t } = useLanguage();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [identificationHistory, setIdentificationHistory] = useState<HistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check model status and load history on component mount
  useEffect(() => {
    checkModelStatus();
    loadIdentificationHistory();
  }, []);

  const checkModelStatus = async () => {
    try {
      const status = await GemmaInference.isModelReady();
      setIsModelReady(status.ready);
      
      if (!status.ready) {
        toast({
          title: t("identify.model.not_ready"),
          description: t("identify.model.download_required"),
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error checking model status:", error);
      setIsModelReady(false);
    }
  };

  const loadIdentificationHistory = () => {
    try {
      const saved = localStorage.getItem("trailguard-identification-history");
      if (saved) {
        const history = JSON.parse(saved);
        setIdentificationHistory(history.slice(0, 3)); // 只显示最近3条
      }
    } catch (error) {
      console.error("Error loading identification history:", error);
    }
  };

  const addToHistory = (result: any, imagePath: string) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      commonName: result.commonName,
      confidence: result.confidence,
      timestamp: Date.now(),
      image: imagePath
    };

    const saved = localStorage.getItem("trailguard-identification-history");
    let history: HistoryItem[] = [];
    if (saved) {
      try {
        history = JSON.parse(saved);
      } catch (error) {
        history = [];
      }
    }

    // 添加新记录到开头，保留最新的10条
    history.unshift(historyItem);
    history = history.slice(0, 10);

    localStorage.setItem("trailguard-identification-history", JSON.stringify(history));
    setIdentificationHistory(history.slice(0, 3));
  };

  const clearHistory = () => {
    localStorage.removeItem("trailguard-identification-history");
    setIdentificationHistory([]);
    toast({
      title: t("identify.history.clear"),
      description: t("language") === "zh" ? "历史记录已清空" : "History cleared",
    });
  };

  const handleScanClick = async () => {
    if (!isModelReady) {
      toast({
        title: t("identify.model.not_ready"),
        description: t("identify.model.download_first"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Take photo using Capacitor Camera
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        await performIdentification(image.webPath);
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: t("identify.camera.error"),
        description: t("identify.camera.error_desc"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const performIdentification = async (imagePath: string) => {
    try {
      setIsProcessing(true);
      
      // Use Gemma AI for identification
      const aiResult = await GemmaInference.identifyObject({
        imagePath,
        prompt: t("identify.ai.prompt"),
        maxTokens: 512,
        temperature: 0.7
      });

      if (aiResult.success && aiResult.result) {
        // Add the user image to the result
        const resultWithImage = {
          ...aiResult.result,
          userImage: imagePath
        };
        
        // Add to history
        addToHistory(aiResult.result, imagePath);
        
        // Store result and navigate
        sessionStorage.setItem("identificationResult", JSON.stringify(resultWithImage));
        navigate("/identify/result");
      } else {
        throw new Error(aiResult.message || "AI identification failed");
      }
      
    } catch (error) {
      console.error("识别失败:", error);
      toast({
        title: t("identify.error.title"),
        description: t("identify.error.desc"),
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
        commonName: t('example.mushroom.death_cap'),
        scientificName: "Amanita phalloides",
        referenceImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
        edibility: "toxic",
        confidence: 92,
        guideId: "toxic-mushrooms"
      },
      otherMatches: [
        {
          name: t('example.mushroom.white_mushroom'),
          image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
          confidence: 78
        },
        {
          name: t('example.mushroom.wild_mushroom'), 
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

    if (!isModelReady) {
      toast({
        title: t("identify.model.not_ready"),
        description: t("identify.model.download_first"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create a temporary URL for the file
      const imageUrl = URL.createObjectURL(file);
      await performIdentification(imageUrl);
      
    } catch (error) {
      console.error("识别失败:", error);
      toast({
        title: t("identify.error.title"),
        description: t("identify.error.desc"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadModel = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      toast({
        title: t("identify.model.downloading"),
        description: t("identify.model.please_wait"),
      });

      // Use a default Gemma 3n model URL (in production, this should be configurable)
      const modelUrl = "https://storage.googleapis.com/mediapipe-models/llm_inference/gemma-2b-it-gpu-int4/float16/1/gemma-2b-it-gpu-int4.bin";
      
      const result = await GemmaInference.downloadModel({ modelUrl });
      
      if (result.success) {
        // Initialize the model after download
        const initResult = await GemmaInference.initializeModel({ 
          modelPath: "gemma-2b-it-gpu-int4.bin" 
        });
        
        if (initResult.success) {
          setIsModelReady(true);
          toast({
            title: t("identify.model.ready"),
            description: t("identify.model.ready_desc"),
            variant: "default",
          });
        } else {
          throw new Error("Failed to initialize model after download");
        }
      } else {
        throw new Error(result.message || "Download failed");
      }
      
    } catch (error) {
      console.error("Model download error:", error);
      toast({
        title: t("identify.model.download_error"),
        description: t("identify.model.download_error_desc"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="text-center space-y-2 mb-8 sm:mb-12">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("identify.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("identify.subtitle")}</p>
      </div>

      {/* Model download progress */}
      {isDownloading && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center space-y-4 max-w-sm mx-4">
            <Download className="h-8 w-8 animate-bounce mx-auto text-forest-primary" />
            <div className="text-lg font-medium">{t("identify.model.downloading")}</div>
            <div className="text-sm text-muted-foreground">{t("identify.model.download_progress")}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-forest-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground">{downloadProgress}%</div>
          </div>
        </div>
      )}

      {/* 处理中的遮罩层 */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-forest-primary" />
            <div className="text-lg font-medium">{t("identify.processing")}</div>
            <div className="text-sm text-muted-foreground">{t("identify.processing.desc")}</div>
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
      <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-center gap-6 lg:gap-8 px-4 py-6">
        
        {/* 左侧：主要功能区 */}
        <div className="flex flex-col items-center justify-center space-y-6 lg:w-96">
          {/* Model status indicator */}
          {!isModelReady && (
            <div className="w-full max-w-sm bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Download className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-sm text-yellow-800">{t("identify.model.not_ready")}</span>
              </div>
              <div className="text-xs text-yellow-700 mb-3">
                {t("identify.model.download_required")}
              </div>
              <Button 
                onClick={handleDownloadModel}
                disabled={isDownloading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? t("identify.model.downloading") : t("identify.model.download")}
              </Button>
            </div>
          )}

          {/* 主要扫描按钮 */}
          <Button 
            onClick={handleScanClick}
            disabled={!isModelReady || isProcessing || isDownloading}
            className="w-full max-w-sm h-20 text-xl font-semibold bg-forest-primary hover:bg-forest-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="h-8 w-8 mr-3" />
            {isModelReady ? t("identify.scan") : t("identify.model.required")}
          </Button>

          {/* 从相册选择链接 */}
          <button 
            onClick={handleUploadClick}
            disabled={!isModelReady || isProcessing || isDownloading}
            className="text-forest-primary hover:text-forest-primary/80 underline text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            <Upload className="h-4 w-4 inline mr-2" />
            {isModelReady ? t("identify.upload") : t("identify.model.required")}
          </button>

          {/* 预览示例按钮 */}
          <Button 
            variant="outline"
            onClick={handlePreviewExample}
            className="text-sm text-muted-foreground border-muted-foreground/30 hover:bg-muted"
          >
            {t("identify.preview")}
          </Button>

          {/* 移动端：识别准确率信息 */}
          <div className="block lg:hidden w-full max-w-sm">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-forest-primary" />
                  <span className="font-medium text-sm">{t("identify.accuracy")}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {t("identify.accuracy.desc")}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-forest-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-xs font-medium text-forest-primary">95%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 右侧：信息卡片区 (仅在大屏显示) */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 space-y-4">
          
          {/* 识别准确率信息 */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-forest-primary" />
                <span className="font-medium text-sm">{t("identify.accuracy")}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {t("identify.accuracy.desc")}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-forest-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-xs font-medium text-forest-primary">95%</span>
              </div>
            </CardContent>
          </Card>

          {/* 拍摄技巧卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                {t("identify.tips.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Eye className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium">{t("identify.tips.lighting")}</div>
                    <div className="text-xs text-muted-foreground">{t("identify.tips.lighting.desc")}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Focus className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium">{t("identify.tips.distance")}</div>
                    <div className="text-xs text-muted-foreground">{t("identify.tips.distance.desc")}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Search className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium">{t("identify.tips.focus")}</div>
                    <div className="text-xs text-muted-foreground">{t("identify.tips.focus.desc")}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RotateCcw className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium">{t("identify.tips.angle")}</div>
                    <div className="text-xs text-muted-foreground">{t("identify.tips.angle.desc")}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最近识别历史 */}
          {identificationHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    {t("identify.history.title")}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {identificationHistory.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded bg-forest-primary/10 flex items-center justify-center flex-shrink-0">
                      <Search className="h-3 w-3 text-forest-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{item.commonName}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.confidence}% • {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 移动端：底部信息区域 */}
      <div className="block lg:hidden px-4 pb-6 space-y-4">
        {/* 拍摄技巧卡片 - 可折叠 */}
        <Card>
          <CardHeader className="pb-3 cursor-pointer" onClick={() => {
            const content = document.getElementById('mobile-tips-content');
            const isHidden = content?.classList.contains('hidden');
            if (isHidden) {
              content?.classList.remove('hidden');
            } else {
              content?.classList.add('hidden');
            }
          }}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                {t("identify.tips.title")}
              </div>
              <div className="text-xs text-muted-foreground">点击展开</div>
            </CardTitle>
          </CardHeader>
          <CardContent id="mobile-tips-content" className="hidden space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{t("identify.tips.lighting")}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t("identify.tips.lighting.desc")}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Focus className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{t("identify.tips.distance")}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t("identify.tips.distance.desc")}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{t("identify.tips.focus")}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t("identify.tips.focus.desc")}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <RotateCcw className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{t("identify.tips.angle")}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t("identify.tips.angle.desc")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 最近识别历史 - 移动端 */}
        {identificationHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  {t("identify.history.title")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {identificationHistory.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded bg-forest-primary/10 flex items-center justify-center flex-shrink-0">
                      <Search className="h-3 w-3 text-forest-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{item.commonName}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.confidence}% • {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI 识别信息 */}
      <div className="w-full max-w-sm bg-muted rounded-lg p-4 mt-8 hidden">
        <div className="flex items-center space-x-2 mb-2">
          <Search className="h-4 w-4 text-forest-primary" />
          <span className="font-medium text-sm">{t("identify.ai.powered")}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {isModelReady ? t("identify.ai.ready_desc") : t("identify.ai.download_desc")}
        </div>
        {isModelReady && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">{t("identify.ai.status_ready")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Identify;