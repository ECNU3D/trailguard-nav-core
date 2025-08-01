import { registerPlugin } from '@capacitor/core';

export interface GemmaInferencePlugin {
  /**
   * Initialize the Gemma model for inference
   */
  initializeModel(options: { modelPath: string }): Promise<{ success: boolean; message?: string }>;

  /**
   * Perform object detection and identification on an image
   */
  identifyObject(options: { 
    imagePath: string; 
    prompt?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{ 
    success: boolean; 
    result?: IdentificationResult; 
    message?: string 
  }>;

  /**
   * Check if model is initialized and ready
   */
  isModelReady(): Promise<{ ready: boolean }>;

  /**
   * Download model if not present
   */
  downloadModel(options: { modelUrl: string }): Promise<{ 
    success: boolean; 
    progress?: number; 
    message?: string 
  }>;

  /**
   * Get model download progress
   */
  getDownloadProgress(): Promise<{ progress: number; status: string }>;

  /**
   * Clean up model resources
   */
  cleanup(): Promise<{ success: boolean }>;
}

export interface IdentificationResult {
  commonName: string;
  scientificName: string;
  confidence: number;
  edibility: "toxic" | "not-edible" | "edible";
  description: string;
  habitat?: string;
  features?: string[];
  warnings?: string[];
  guideId?: string;
}

const GemmaInference = registerPlugin<GemmaInferencePlugin>('GemmaInference', {
  web: () => import('./gemma-inference-web').then(m => new m.GemmaInferenceWeb()),
});

export default GemmaInference;