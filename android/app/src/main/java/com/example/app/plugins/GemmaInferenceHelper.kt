package com.example.app.plugins

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.getcapacitor.JSObject
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicInteger

class GemmaInferenceHelper(private val context: Context) {
    
    private val TAG = "GemmaInferenceHelper"
    private var llmInference: LlmInference? = null
    private val isModelInitialized = AtomicBoolean(false)
    private val downloadProgress = AtomicInteger(0)
    private var downloadStatus = "idle"
    private val gson = Gson()

    companion object {
        private const val MODEL_FILENAME = "gemma-3n-2b-it-gpu-int4.bin"
        private const val MODELS_DIR = "gemma_models"
        
        // Default Gemma 3n model URL (this would be the actual model URL)
        private const val DEFAULT_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/llm_inference/gemma-2b-it-gpu-int4/float16/1/gemma-2b-it-gpu-int4.bin"
    }

    fun initializeModel(modelPath: String): Boolean {
        return try {
            Log.d(TAG, "Initializing Gemma model from: $modelPath")
            
            val modelFile = File(context.filesDir, "$MODELS_DIR/$MODEL_FILENAME")
            if (!modelFile.exists()) {
                Log.e(TAG, "Model file not found: ${modelFile.absolutePath}")
                return false
            }

            val options = LlmInferenceOptions.builder()
                .setBaseOptions(
                    BaseOptions.builder()
                        .setModelAssetPath(modelFile.absolutePath)
                        .build()
                )
                .setMaxTokens(512)
                .setTopK(40)
                .setTopP(0.9f)
                .setTemperature(0.7f)
                .setRandomSeed(0)
                .build()

            llmInference = LlmInference.createFromOptions(context, options)
            isModelInitialized.set(true)
            
            Log.d(TAG, "Gemma model initialized successfully")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize model", e)
            isModelInitialized.set(false)
            false
        }
    }

    suspend fun identifyObject(
        imagePath: String, 
        prompt: String, 
        maxTokens: Int, 
        temperature: Float
    ): JSObject? = withContext(Dispatchers.IO) {
        try {
            if (!isModelInitialized.get() || llmInference == null) {
                Log.e(TAG, "Model not initialized")
                return@withContext null
            }

            Log.d(TAG, "Starting object identification for: $imagePath")

            // Load and analyze the image
            val bitmap = loadImageFromPath(imagePath)
            if (bitmap == null) {
                Log.e(TAG, "Failed to load image from path: $imagePath")
                return@withContext null
            }

            // Prepare the enhanced prompt for object identification
            val enhancedPrompt = buildObjectIdentificationPrompt(prompt, bitmap)
            
            Log.d(TAG, "Sending prompt to Gemma model: $enhancedPrompt")

            // Generate response using the LLM
            val response = llmInference?.generateResponse(enhancedPrompt)
            
            if (response.isNullOrBlank()) {
                Log.e(TAG, "Empty response from model")
                return@withContext null
            }

            Log.d(TAG, "Received response from model: $response")

            // Parse the response and convert to the expected format
            parseIdentificationResponse(response)

        } catch (e: Exception) {
            Log.e(TAG, "Error during object identification", e)
            null
        }
    }

    private fun loadImageFromPath(imagePath: String): Bitmap? {
        return try {
            when {
                imagePath.startsWith("content://") -> {
                    val uri = Uri.parse(imagePath)
                    val inputStream = context.contentResolver.openInputStream(uri)
                    BitmapFactory.decodeStream(inputStream)
                }
                imagePath.startsWith("file://") -> {
                    val file = File(Uri.parse(imagePath).path!!)
                    BitmapFactory.decodeFile(file.absolutePath)
                }
                else -> {
                    val file = File(imagePath)
                    BitmapFactory.decodeFile(file.absolutePath)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error loading image", e)
            null
        }
    }

    private fun buildObjectIdentificationPrompt(basePrompt: String, bitmap: Bitmap): String {
        // Analyze basic image properties
        val imageAnalysis = analyzeImageProperties(bitmap)
        
        return """
            $basePrompt
            
            Please analyze this image and provide the following information in JSON format:
            {
                "commonName": "string",
                "scientificName": "string", 
                "confidence": number (0-100),
                "edibility": "toxic" | "not-edible" | "edible",
                "description": "string",
                "habitat": "string",
                "features": ["string array"],
                "warnings": ["string array"],
                "guideId": "string"
            }
            
            Image properties: $imageAnalysis
            
            Focus on identifying plants, mushrooms, or other natural objects. Be accurate about edibility and provide safety warnings when appropriate.
        """.trimIndent()
    }

    private fun analyzeImageProperties(bitmap: Bitmap): String {
        return try {
            val width = bitmap.width
            val height = bitmap.height
            val aspectRatio = width.toFloat() / height.toFloat()
            
            // Simple color analysis
            val centerPixel = bitmap.getPixel(width / 2, height / 2)
            val red = (centerPixel shr 16) and 0xFF
            val green = (centerPixel shr 8) and 0xFF
            val blue = centerPixel and 0xFF
            
            "Image: ${width}x${height}, aspect ratio: $aspectRatio, center color: RGB($red,$green,$blue)"
        } catch (e: Exception) {
            "Image analysis failed: ${e.message}"
        }
    }

    private fun parseIdentificationResponse(response: String): JSObject? {
        return try {
            // Try to extract JSON from the response
            val jsonStart = response.indexOf("{")
            val jsonEnd = response.lastIndexOf("}") + 1
            
            if (jsonStart == -1 || jsonEnd <= jsonStart) {
                // If no JSON found, create a structured response from text
                return createFallbackResponse(response)
            }
            
            val jsonString = response.substring(jsonStart, jsonEnd)
            val jsonObject = gson.fromJson(jsonString, JsonObject::class.java)
            
            // Convert to JSObject
            val result = JSObject()
            result.put("commonName", jsonObject.get("commonName")?.asString ?: "Unknown")
            result.put("scientificName", jsonObject.get("scientificName")?.asString ?: "Unknown")
            result.put("confidence", jsonObject.get("confidence")?.asInt ?: 50)
            result.put("edibility", jsonObject.get("edibility")?.asString ?: "not-edible")
            result.put("description", jsonObject.get("description")?.asString ?: response)
            result.put("habitat", jsonObject.get("habitat")?.asString ?: "")
            
            // Handle arrays
            val features = jsonObject.getAsJsonArray("features")
            val warnings = jsonObject.getAsJsonArray("warnings")
            
            if (features != null) {
                val featuresArray = mutableListOf<String>()
                features.forEach { featuresArray.add(it.asString) }
                result.put("features", featuresArray)
            }
            
            if (warnings != null) {
                val warningsArray = mutableListOf<String>()
                warnings.forEach { warningsArray.add(it.asString) }
                result.put("warnings", warningsArray)
            }
            
            result.put("guideId", jsonObject.get("guideId")?.asString ?: "")
            
            result
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing response", e)
            createFallbackResponse(response)
        }
    }

    private fun createFallbackResponse(response: String): JSObject {
        val result = JSObject()
        result.put("commonName", "Unknown Species")
        result.put("scientificName", "Species unknown")
        result.put("confidence", 30)
        result.put("edibility", "not-edible")
        result.put("description", response)
        result.put("habitat", "Unknown")
        result.put("features", listOf("Analysis incomplete"))
        result.put("warnings", listOf("Unable to determine safety - do not consume"))
        result.put("guideId", "")
        return result
    }

    suspend fun downloadModel(
        modelUrl: String, 
        progressCallback: (Int) -> Unit
    ): Boolean = withContext(Dispatchers.IO) {
        return@withContext try {
            downloadStatus = "downloading"
            progressCallback(0)
            
            val modelsDir = File(context.filesDir, MODELS_DIR)
            if (!modelsDir.exists()) {
                modelsDir.mkdirs()
            }
            
            val modelFile = File(modelsDir, MODEL_FILENAME)
            
            val url = URL(modelUrl)
            val connection = url.openConnection() as HttpURLConnection
            connection.connect()
            
            val totalSize = connection.contentLength
            val input: InputStream = connection.inputStream
            val output = FileOutputStream(modelFile)
            
            val buffer = ByteArray(8192)
            var bytesRead = 0
            var totalBytesRead = 0
            
            while (input.read(buffer).also { bytesRead = it } != -1) {
                output.write(buffer, 0, bytesRead)
                totalBytesRead += bytesRead
                
                val progress = if (totalSize > 0) {
                    (totalBytesRead * 100) / totalSize
                } else {
                    0
                }
                
                downloadProgress.set(progress)
                progressCallback(progress)
            }
            
            output.close()
            input.close()
            connection.disconnect()
            
            downloadStatus = "completed"
            progressCallback(100)
            
            Log.d(TAG, "Model downloaded successfully to: ${modelFile.absolutePath}")
            true
            
        } catch (e: Exception) {
            Log.e(TAG, "Error downloading model", e)
            downloadStatus = "failed"
            false
        }
    }

    fun isModelReady(): Boolean {
        val modelFile = File(context.filesDir, "$MODELS_DIR/$MODEL_FILENAME")
        return isModelInitialized.get() && modelFile.exists()
    }

    fun getDownloadProgress(): Pair<Int, String> {
        return Pair(downloadProgress.get(), downloadStatus)
    }

    fun cleanup() {
        try {
            llmInference?.close()
            llmInference = null
            isModelInitialized.set(false)
            Log.d(TAG, "Model resources cleaned up")
        } catch (e: Exception) {
            Log.e(TAG, "Error during cleanup", e)
        }
    }
}