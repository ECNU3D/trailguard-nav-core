package com.example.app.plugins

import android.content.Context
import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@CapacitorPlugin(name = "GemmaInference")
class GemmaInferencePlugin : Plugin() {

    private val scope = CoroutineScope(Dispatchers.Main)
    private lateinit var gemmaHelper: GemmaInferenceHelper
    private val TAG = "GemmaInferencePlugin"

    override fun load() {
        super.load()
        try {
            gemmaHelper = GemmaInferenceHelper(context)
            Log.d(TAG, "GemmaInferencePlugin loaded successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize GemmaInferenceHelper", e)
        }
    }

    @PluginMethod
    fun initializeModel(call: PluginCall) {
        val modelPath = call.getString("modelPath")
        if (modelPath == null) {
            call.reject("Model path is required")
            return
        }

        scope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    gemmaHelper.initializeModel(modelPath)
                }
                
                if (result) {
                    val ret = JSObject()
                    ret.put("success", true)
                    ret.put("message", "Model initialized successfully")
                    call.resolve(ret)
                } else {
                    call.reject("Failed to initialize model")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error initializing model", e)
                call.reject("Error initializing model: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun identifyObject(call: PluginCall) {
        val imagePath = call.getString("imagePath")
        val prompt = call.getString("prompt") ?: "Identify this plant or mushroom. Provide the common name, scientific name, edibility status (toxic/not-edible/edible), description, habitat, key features, and any safety warnings."
        val maxTokens = call.getInt("maxTokens") ?: 512
        val temperature = call.getFloat("temperature") ?: 0.7f

        if (imagePath == null) {
            call.reject("Image path is required")
            return
        }

        scope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    gemmaHelper.identifyObject(imagePath, prompt, maxTokens, temperature)
                }
                
                if (result != null) {
                    val ret = JSObject()
                    ret.put("success", true)
                    ret.put("result", result)
                    call.resolve(ret)
                } else {
                    call.reject("Failed to identify object")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error identifying object", e)
                call.reject("Error identifying object: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun isModelReady(call: PluginCall) {
        try {
            val ready = gemmaHelper.isModelReady()
            val ret = JSObject()
            ret.put("ready", ready)
            call.resolve(ret)
        } catch (e: Exception) {
            Log.e(TAG, "Error checking model status", e)
            call.reject("Error checking model status: ${e.message}")
        }
    }

    @PluginMethod
    fun downloadModel(call: PluginCall) {
        val modelUrl = call.getString("modelUrl")
        if (modelUrl == null) {
            call.reject("Model URL is required")
            return
        }

        scope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    gemmaHelper.downloadModel(modelUrl) { progress ->
                        // Send progress updates
                        val progressData = JSObject()
                        progressData.put("progress", progress)
                        progressData.put("status", "downloading")
                        notifyListeners("downloadProgress", progressData)
                    }
                }
                
                if (result) {
                    val ret = JSObject()
                    ret.put("success", true)
                    ret.put("progress", 100)
                    ret.put("message", "Model downloaded successfully")
                    call.resolve(ret)
                } else {
                    call.reject("Failed to download model")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error downloading model", e)
                call.reject("Error downloading model: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun getDownloadProgress(call: PluginCall) {
        try {
            val progress = gemmaHelper.getDownloadProgress()
            val ret = JSObject()
            ret.put("progress", progress.first)
            ret.put("status", progress.second)
            call.resolve(ret)
        } catch (e: Exception) {
            Log.e(TAG, "Error getting download progress", e)
            call.reject("Error getting download progress: ${e.message}")
        }
    }

    @PluginMethod
    fun cleanup(call: PluginCall) {
        try {
            gemmaHelper.cleanup()
            val ret = JSObject()
            ret.put("success", true)
            call.resolve(ret)
        } catch (e: Exception) {
            Log.e(TAG, "Error during cleanup", e)
            call.reject("Error during cleanup: ${e.message}")
        }
    }
}