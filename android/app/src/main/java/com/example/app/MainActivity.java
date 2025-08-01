package com.example.app;

import com.getcapacitor.BridgeActivity;
import com.example.app.plugins.GemmaInferencePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register our custom plugin
        registerPlugin(GemmaInferencePlugin.class);
    }
}
