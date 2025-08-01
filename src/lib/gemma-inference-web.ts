import { WebPlugin } from '@capacitor/core';
import type { GemmaInferencePlugin, IdentificationResult } from './gemma-inference';

export class GemmaInferenceWeb extends WebPlugin implements GemmaInferencePlugin {
  async initializeModel(_options: { modelPath: string }): Promise<{ success: boolean; message?: string }> {
    console.warn('GemmaInference: Web implementation - using mock data');
    return { success: true, message: 'Mock initialization successful' };
  }

  async identifyObject(options: { 
    imagePath: string; 
    prompt?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{ 
    success: boolean; 
    result?: IdentificationResult; 
    message?: string 
  }> {
    console.warn('GemmaInference: Web implementation - using mock data');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock result for web testing
    const mockResult: IdentificationResult = {
      commonName: "Mock Mushroom",
      scientificName: "Mockus testicus",
      confidence: 85,
      edibility: "not-edible",
      description: "This is a mock result for web testing. Real identification requires the Android implementation.",
      habitat: "Mock forest environments",
      features: ["Mock cap", "Mock stem", "Mock gills"],
      warnings: ["This is test data only"],
      guideId: "mock-guide"
    };

    return { 
      success: true, 
      result: mockResult,
      message: 'Mock identification completed' 
    };
  }

  async isModelReady(): Promise<{ ready: boolean }> {
    return { ready: true };
  }

  async downloadModel(_options: { modelUrl: string }): Promise<{ 
    success: boolean; 
    progress?: number; 
    message?: string 
  }> {
    console.warn('GemmaInference: Web implementation - mock download');
    return { success: true, progress: 100, message: 'Mock download completed' };
  }

  async getDownloadProgress(): Promise<{ progress: number; status: string }> {
    return { progress: 100, status: 'completed' };
  }

  async cleanup(): Promise<{ success: boolean }> {
    return { success: true };
  }
}