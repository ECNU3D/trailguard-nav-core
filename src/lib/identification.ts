// 模拟AI识别服务
export interface IdentificationResult {
  userImage: string;
  bestMatch: {
    commonName: string;
    scientificName: string;
    referenceImage: string;
    edibility: "toxic" | "not-edible" | "edible";
    confidence: number;
    guideId: string;
  };
  otherMatches: Array<{
    name: string;
    image: string;
    confidence: number;
  }>;
}

// 模拟识别数据集
const mockResults: IdentificationResult[] = [
  {
    userImage: "",
    bestMatch: {
      commonName: "牛肝菌",
      scientificName: "Boletus edulis",
      referenceImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
      edibility: "edible",
      confidence: 85,
      guideId: "edible-mushrooms"
    },
    otherMatches: [
      {
        name: "毒蝇伞",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
        confidence: 72
      },
      {
        name: "羊肚菌",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
        confidence: 68
      }
    ]
  },
  {
    userImage: "",
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
  },
  {
    userImage: "",
    bestMatch: {
      commonName: "野玫瑰",
      scientificName: "Rosa canina",
      referenceImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop",
      edibility: "not-edible",
      confidence: 78,
      guideId: "wild-roses"
    },
    otherMatches: [
      {
        name: "月季花",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&h=100&fit=crop",
        confidence: 69
      },
      {
        name: "蔷薇",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&h=100&fit=crop",
        confidence: 64
      }
    ]
  }
];

/**
 * 模拟AI识别函数
 * @param imageData 图片数据 (File、Blob或base64字符串)
 * @returns Promise<IdentificationResult> 识别结果
 */
export async function getIdentification(imageData: File | Blob | string): Promise<IdentificationResult> {
  // 模拟2秒的AI处理延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 随机选择一个模拟结果
  const randomIndex = Math.floor(Math.random() * mockResults.length);
  const result = { ...mockResults[randomIndex] };
  
  // 如果传入的是File或Blob，创建URL用于显示用户图片
  if (imageData instanceof File || imageData instanceof Blob) {
    result.userImage = URL.createObjectURL(imageData);
  } else if (typeof imageData === "string") {
    result.userImage = imageData;
  } else {
    // 使用默认图片
    result.userImage = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop";
  }
  
  return result;
}