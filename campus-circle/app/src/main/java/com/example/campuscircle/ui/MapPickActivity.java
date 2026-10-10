package com.example.campuscircle.ui;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.campuscircle.R;

public class MapPickActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map_pick);

        webView = findViewById(R.id.web_map_pick);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new JSBridge(), "AndroidBridge");
        webView.loadUrl("file:///android_asset/map.html?pick=1");
    }

    public class JSBridge {
        @JavascriptInterface
        public void onPick(String lng, String lat) {
            try {
                double dl = Double.parseDouble(lng);
                double dt = Double.parseDouble(lat);
                Intent data = new Intent();
                data.putExtra("lng", dl);
                data.putExtra("lat", dt);
                setResult(Activity.RESULT_OK, data);
                finish();
            } catch (Exception e) {
                // ignore parse
            }
        }
    }
}
