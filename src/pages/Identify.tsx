import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Search, Zap } from "lucide-react";

const Identify = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">智能识别</h1>
        <p className="text-muted-foreground">AI助力快速识别动植物</p>
      </div>

      <div className="grid gap-4">
        <Card className="border-forest-primary/20 bg-gradient-nature">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto w-16 h-16 bg-forest-primary rounded-full flex items-center justify-center mb-3">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">拍照识别</CardTitle>
            <CardDescription>
              拍摄照片，AI立即识别动植物种类
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-forest-primary hover:bg-forest-primary/90 text-white">
              <Camera className="h-4 w-4 mr-2" />
              打开相机
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center pb-3">
            <div className="mx-auto w-16 h-16 bg-forest-secondary rounded-full flex items-center justify-center mb-3">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">上传照片</CardTitle>
            <CardDescription>
              从相册选择照片进行识别
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-forest-secondary text-forest-secondary hover:bg-forest-secondary/10">
              <Upload className="h-4 w-4 mr-2" />
              选择照片
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Zap className="h-5 w-5 mr-2 text-earth-accent" />
          快速识别功能
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🌸", name: "花卉识别", desc: "识别野花品种" },
            { icon: "🍄", name: "菌类识别", desc: "区分可食用菌类" },
            { icon: "🦋", name: "昆虫识别", desc: "了解昆虫习性" },
            { icon: "🐦", name: "鸟类识别", desc: "观鸟爱好者必备" }
          ].map((item, index) => (
            <Card key={index} className="p-3 cursor-pointer hover:shadow-mobile transition-all">
              <div className="text-center space-y-2">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-forest-primary" />
          <span className="font-medium text-sm">识别准确率</span>
        </div>
        <div className="text-xs text-muted-foreground">
          基于深度学习技术，我们的AI模型在动植物识别方面达到了95%以上的准确率。
        </div>
      </div>
    </div>
  );
};

export default Identify;