package com.example.campuscircle.ui;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.Task;

public class TaskDetailActivity extends AppCompatActivity {

    private TextView tvDetail;
    private TextView tvAddress;
    private Button btnAccept, btnBack;
    private Button btnChat;
    private AppDatabase db;
    private Task task;
    private WebView webView;
    private boolean pageLoaded = false;
    private static final int DETAIL_MAP_ZOOM = 21; // 21 ~ ~25 meters视野

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_detail);

        tvDetail = findViewById(R.id.tv_detail);
        tvAddress = findViewById(R.id.tv_address);
        webView = findViewById(R.id.web_map_detail);
        btnAccept = findViewById(R.id.btn_accept);
        btnChat = findViewById(R.id.btn_chat);
        btnBack = findViewById(R.id.btn_back);

        db = AppDatabase.getInstance(this);

        int taskId = getIntent().getIntExtra("taskId", -1);
        if (taskId == -1) finish();

        new Thread(() -> {
            task = db.taskDao().getTaskById(taskId);
            runOnUiThread(() -> bindTask());
        }).start();

        setupWebView();

        btnBack.setOnClickListener(v -> finish());
        btnAccept.setOnClickListener(v -> acceptTask());
        btnChat.setOnClickListener(v -> openChatForTask());
    }

    private void openChatForTask() {
        String currentUser = getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        String other = currentUser.equals(task.getUserId()) ? task.getTakerId() : task.getUserId();
        if (other == null || other.isEmpty() || "unknown".equals(other)) {
            android.widget.Toast.makeText(this, "对方尚未参与此任务，无法聊天", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            com.example.campuscircle.db.AppDatabase db = com.example.campuscircle.db.AppDatabase.getInstance(this);
            com.example.campuscircle.model.Conversation conv = db.conversationDao().findBetween(currentUser, other);
            int convIdLocal = -1;
            if (conv == null) {
                long id = db.conversationDao().insert(new com.example.campuscircle.model.Conversation(currentUser, other, task.getId()));
                convIdLocal = (int) id;
            } else convIdLocal = conv.getId();
            int finalConvId = convIdLocal;
            runOnUiThread(() -> {
                android.content.Intent it = new android.content.Intent(this, ChatActivity.class);
                it.putExtra("convId", finalConvId);
                it.putExtra("otherUserId", other);
                it.putExtra("taskId", task.getId());
                startActivity(it);
            });
        }).start();
    }

    private void bindTask() {
        if (task == null) return;
        // 显示发布者姓名与联系方式（手机号为 userId）
        String contact = task.getUserId() == null ? "未知" : task.getUserId();
        tvDetail.setText("发布者:" + task.getUserName() + " (" + contact + ")\n类型:" + task.getType() + "\n内容:" + task.getContent() + "\n时间:" + task.getTime() + "\n状态:" + task.getStatus());
        // 显示经纬作为地址信息
        tvAddress.setText("地址：" + String.format("%s, %s", String.valueOf(task.getLatitude()), String.valueOf(task.getLongitude())));
        btnAccept.setText(task.getStatus().equals("待接取") ? "接取任务" : "已被接取");
        btnAccept.setEnabled(task.getStatus().equals("待接取"));

        // 如果地图已加载，直接定位；否则 onPageFinished 会触发定位
        if (pageLoaded && webView != null) {
            try {
                double lat = task.getLatitude();
                double lng = task.getLongitude();
                int zoom = DETAIL_MAP_ZOOM;
                String js = String.format("javascript:showSingleMarker(%s, %s, %d)", lng, lat, zoom);
                webView.post(() -> webView.evaluateJavascript(js, null));
            } catch (Exception e) { }
        }
    }

    private void acceptTask() {
        // 使用登录用户作为接取者
        String userId = getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        String userName = getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userName", "匿名");
        if (userId.equals(task.getUserId())) {
            android.widget.Toast.makeText(this, "不能接取自己发布的任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }

        new Thread(() -> {
            // double-check status to avoid race
            Task latest = db.taskDao().getTaskById(task.getId());
            if (!"待接取".equals(latest.getStatus())) {
                runOnUiThread(() -> android.widget.Toast.makeText(this, "任务已被他人接取", android.widget.Toast.LENGTH_SHORT).show());
                return;
            }
            db.taskDao().updateStatus(task.getId(), "进行中", userId, userName);
            // 插入消息给发布者
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(), "接取", "任务已被 " + userName + " 接取", System.currentTimeMillis(), userId, userName, task.getUserId()
            );
            db.messageDao().insert(msg);
            task = db.taskDao().getTaskById(task.getId());
            runOnUiThread(() -> bindTask());
        }).start();
    }

    // For completing or abandoning from detail view
    private void completeTask() {
        String userId = getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        if (!userId.equals(task.getTakerId())) {
            android.widget.Toast.makeText(this, "只有接取者可以完成任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            db.taskDao().updateStatus(task.getId(), "已完成", task.getTakerId(), task.getTakerName());
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(), "完成", "任务已由 " + task.getTakerName() + " 标记为完成", System.currentTimeMillis(), task.getTakerId(), task.getTakerName(), task.getUserId()
            );
            db.messageDao().insert(msg);
            task = db.taskDao().getTaskById(task.getId());
            runOnUiThread(() -> bindTask());
        }).start();
    }

    private void abandonTask() {
        String userId = getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        if (!userId.equals(task.getTakerId())) {
            android.widget.Toast.makeText(this, "只有接取者可以放弃任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            db.taskDao().updateStatus(task.getId(), "待接取", null, null);
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(), "放弃", "任务接取者已放弃任务", System.currentTimeMillis(), task.getTakerId(), task.getTakerName(), task.getUserId()
            );
            db.messageDao().insert(msg);
            task = db.taskDao().getTaskById(task.getId());
            runOnUiThread(() -> bindTask());
        }).start();
    }

    private void deleteTask() {
        String userId = getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        if (!userId.equals(task.getUserId())) {
            android.widget.Toast.makeText(this, "只有发布者可以删除任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            db.taskDao().deleteById(task.getId());
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(), "删除", "任务已被发布者删除", System.currentTimeMillis(), task.getUserId(), task.getUserName(), task.getUserId()
            );
            db.messageDao().insert(msg);
            runOnUiThread(this::finish);
        }).start();
    }

    private void setupWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                pageLoaded = true;
                // 如果 task 已经加载过，立刻调用 JS 定位
                if (task != null) {
                    try {
                        double lat = task.getLatitude();
                        double lng = task.getLongitude();
                            int zoom = DETAIL_MAP_ZOOM;
                            String js = String.format("javascript:showSingleMarker(%s, %s, %d)", lng, lat, zoom);
                        webView.post(() -> webView.evaluateJavascript(js, null));
                    } catch (Exception e) { }
                }
            }
        });
        webView.loadUrl("file:///android_asset/map.html");
    }
}
