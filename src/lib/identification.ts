// AI识别服务 - 使用 Gemma 3n 离线推理
import GemmaInference from "./gemma-inference";

export interface IdentificationResult {
  userImage: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  edibility: "toxic" | "not-edible" | "edible";
  description: string;
  habitat?: string;
  features?: string[];
  warnings?: string[];
  guideId?: string;
  // Legacy compatibility
  bestMatch?: {
    commonName: string;
    scientificName: string;
    referenceImage: string;
    edibility: "toxic" | "not-edible" | "edible";
    confidence: number;
    guideId: string;
  };
  otherMatches?: Array<{
    name: string;
    image: string;
    confidence: number;
  }>;
}

/**
 * AI识别函数 - 使用 Gemma 3n 进行离线推理
 * @param imageData 图片数据 (File、Blob或base64字符串)
 * @param t 翻译函数
 * @returns Promise<IdentificationResult> 识别结果
 */
export async function getIdentification(imageData: File | Blob | string, t: (key: string) => string): Promise<IdentificationResult> {
  try {
    let imagePath: string;
    
    // 处理不同类型的图片数据
    if (imageData instanceof File || imageData instanceof Blob) {
      imagePath = URL.createObjectURL(imageData);
    } else if (typeof imageData === "string") {
      imagePath = imageData;
    } else {
      throw new Error("Unsupported image data type");
    }
    
    // 检查模型是否准备就绪
    const modelStatus = await GemmaInference.isModelReady();
    if (!modelStatus.ready) {
      throw new Error("Model not ready. Please download and initialize the model first.");
    }
    
    // 使用 Gemma AI 进行识别
    const aiResult = await GemmaInference.identifyObject({
      imagePath,
      prompt: t("identify.ai.prompt") || "Identify this plant or mushroom. Provide the common name, scientific name, edibility status (toxic/not-edible/edible), description, habitat, key features, and any safety warnings.",
      maxTokens: 512,
      temperature: 0.7
    });
    
    if (!aiResult.success || !aiResult.result) {
      throw new Error(aiResult.message || "AI identification failed");
    }
    
    // 构建完整的识别结果，确保包含所有必需字段
    const result: IdentificationResult = {
      userImage: imagePath,
      commonName: aiResult.result.commonName || "Unknown Species",
      scientificName: aiResult.result.scientificName || "Species unknown",
      confidence: aiResult.result.confidence || 50,
      edibility: aiResult.result.edibility || "not-edible",
      description: aiResult.result.description || "No description available",
      habitat: aiResult.result.habitat,
      features: aiResult.result.features,
      warnings: aiResult.result.warnings,
      guideId: aiResult.result.guideId,
      // Legacy compatibility for existing UI components
      bestMatch: {
        commonName: aiResult.result.commonName || "Unknown Species",
        scientificName: aiResult.result.scientificName || "Species unknown",
        referenceImage: imagePath, // Use the user's image as reference
        edibility: aiResult.result.edibility || "not-edible",
        confidence: aiResult.result.confidence || 50,
        guideId: aiResult.result.guideId || "general-guide"
      },
      otherMatches: [] // Could be extended to show alternative suggestions
    };
    
    return result;
    
  } catch (error) {
    console.error("Identification error:", error);
    
    // Return fallback result for debugging
    const fallbackResult: IdentificationResult = {
      userImage: typeof imageData === "string" ? imageData : URL.createObjectURL(imageData as Blob),
      commonName: "Unknown Species",
      scientificName: "Species unidentified", 
      confidence: 0,
      edibility: "not-edible",
      description: "AI identification failed: " + (error as Error).message,
      habitat: "Unknown",
      features: ["Analysis incomplete"],
      warnings: ["Unable to determine safety - do not consume"],
      guideId: "",
      bestMatch: {
        commonName: "Unknown Species",
        scientificName: "Species unidentified",
        referenceImage: typeof imageData === "string" ? imageData : URL.createObjectURL(imageData as Blob),
        edibility: "not-edible",
        confidence: 0,
        guideId: ""
      },
      otherMatches: []
    };
    
    return fallbackResult;
  }
}