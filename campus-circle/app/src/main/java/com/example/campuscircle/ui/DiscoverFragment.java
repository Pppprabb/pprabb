package com.example.campuscircle.ui;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.Task;
import com.example.campuscircle.ui.adapter.TaskAdapter;
import com.google.gson.Gson;
import org.json.JSONObject;

import java.util.List;

public class DiscoverFragment extends Fragment {

    private WebView webView;
    private RecyclerView rvTasks;
    private TaskAdapter adapter;
    private AppDatabase db;                                                                              
    private String currentUserId;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.fragment_discover, container, false);
        webView = v.findViewById(R.id.web_map);
        rvTasks = v.findViewById(R.id.rv_nearby_tasks);

        db = AppDatabase.getInstance(requireContext());
        currentUserId = requireActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");

        setupWebView();
        setupList();

        // 监听数据库变化，发布/状态变更时同步到地图
        db.taskDao().getAllTasks().observe(getViewLifecycleOwner(), tasks -> {
            if (tasks == null) return;
            String json = new Gson().toJson(tasks);
            String quoted = JSONObject.quote(json);
            if (webView != null) {
                webView.post(() -> webView.evaluateJavascript("javascript:showTasks(" + quoted + ")", null));
            }
        });

        return v;
    }

    // action implementations
    private void acceptTask(Task task) {
        String userId = requireActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        String userName = requireActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userName", "匿名");
        if (userId.equals(task.getUserId())) {
            android.widget.Toast.makeText(requireContext(), "不能接取自己发布的任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            Task latest = db.taskDao().getTaskById(task.getId());
            if (!"待接取".equals(latest.getStatus())) {
                requireActivity().runOnUiThread(() -> android.widget.Toast.makeText(requireContext(), "任务已被他人接取", android.widget.Toast.LENGTH_SHORT).show());
                return;
            }
            db.taskDao().updateStatus(task.getId(), "进行中", userId, userName);
            // 插入消息给发布者
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(),
                    "接取",
                    "任务已被 " + userName + " 接取",
                    System.currentTimeMillis(),
                    userId,
                    userName,
                    task.getUserId()
            );
            db.messageDao().insert(msg);
            requireActivity().runOnUiThread(() -> {
                android.widget.Toast.makeText(requireContext(), "已接取任务", android.widget.Toast.LENGTH_SHORT).show();
                refreshTaskList();
            });
        }).start();
    }

    private void completeTask(Task task) {
        String userId = requireActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        if (!userId.equals(task.getTakerId())) {
            android.widget.Toast.makeText(requireContext(), "只有接取者可以完成任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            db.taskDao().updateStatus(task.getId(), "已完成", task.getTakerId(), task.getTakerName());
            // 插入消息给发布者
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(),
                    "完成",
                    "任务已由 " + task.getTakerName() + " 标记为完成",
                    System.currentTimeMillis(),
                    task.getTakerId(),
                    task.getTakerName(),
                    task.getUserId()
            );
            db.messageDao().insert(msg);
            requireActivity().runOnUiThread(() -> {
                android.widget.Toast.makeText(requireContext(), "已标记为完成", android.widget.Toast.LENGTH_SHORT).show();
                refreshTaskList();
            });
        }).start();
    }

    private void abandonTask(Task task) {
        String userId = requireActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        if (!userId.equals(task.getTakerId())) {
            android.widget.Toast.makeText(requireContext(), "只有接取者可以放弃任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            db.taskDao().updateStatus(task.getId(), "待接取", null, null);
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(),
                    "放弃",
                    "任务接取者已放弃任务",
                    System.currentTimeMillis(),
                    task.getTakerId(),
                    task.getTakerName(),
                    task.getUserId()
            );
            db.messageDao().insert(msg);
            requireActivity().runOnUiThread(() -> {
                android.widget.Toast.makeText(requireContext(), "已放弃任务", android.widget.Toast.LENGTH_SHORT).show();
                refreshTaskList();
            });
        }).start();
    }

    private void deleteTask(Task task) {
        String userId = requireActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        if (!userId.equals(task.getUserId())) {
            android.widget.Toast.makeText(requireContext(), "只有发布者可以删除任务", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            db.taskDao().deleteById(task.getId());
            com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                    task.getId(),
                    "删除",
                    "任务已被发布者删除",
                    System.currentTimeMillis(),
                    task.getUserId(),
                    task.getUserName(),
                    task.getUserId()
            );
            db.messageDao().insert(msg);
            requireActivity().runOnUiThread(() -> {
                android.widget.Toast.makeText(requireContext(), "任务已删除", android.widget.Toast.LENGTH_SHORT).show();
                refreshTaskList();
            });
        }).start();
    }

    private void refreshTaskList() {
        new Thread(() -> {
            List<Task> list = db.taskDao().getAllTasksSync();
            requireActivity().runOnUiThread(() -> adapter.setTaskList(list));
        }).start();
    }

    /* ✅ WebView 配置 */
    private void setupWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setGeolocationEnabled(true);
        // 允许从 file:// 页面访问网络资源（加载外部 JS/CSS）
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setAllowContentAccess(true);
        s.setJavaScriptCanOpenWindowsAutomatically(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        // 允许混合内容（http/https）在 file:// 页面中加载
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // WebView 外观与行为
        webView.setBackgroundColor(0x00000000);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // 开启 WebView 调试（便于调试控制台），仅在调试环境下可关
        WebView.setWebContentsDebuggingEnabled(true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin,
                                                           android.webkit.GeolocationPermissions.Callback cb) {
                cb.invoke(origin, true, false);
            }
        });

        webView.addJavascriptInterface(new JSBridge(), "AndroidBridge");
        webView.loadUrl("file:///android_asset/map.html");
    }

    private void setupList() {
        // showActionButtons=false and showAcceptInList=false for discovery list (no buttons in list)
        adapter = new TaskAdapter(currentUserId, new com.example.campuscircle.ui.adapter.TaskAdapter.OnTaskActionListener() {
            @Override
            public void onAccept(Task task) {
                acceptTask(task);
            }

            @Override
            public void onComplete(Task task) {
                completeTask(task);
            }

            @Override
            public void onAbandon(Task task) {
                abandonTask(task);
            }

            @Override
            public void onDelete(Task task) {
                deleteTask(task);
            }
        });
        rvTasks.setLayoutManager(new LinearLayoutManager(getContext()));
        rvTasks.setAdapter(adapter);
    }

    /* ✅ JS 调用：加载数据库任务 */
    public class JSBridge {
        @JavascriptInterface
        public void loadTasks(double lng, double lat) {
            new Thread(() -> {
                // ✅ 从 Room 数据库读取所有任务
                List<Task> list = db.taskDao().getAllTasksSync();

                // ✅ 按距离排序
                list.sort((a, b) -> {
                    double d1 = distance(lat, lng, a.getLatitude(), a.getLongitude());
                    double d2 = distance(lat, lng, b.getLatitude(), b.getLongitude());
                    return Double.compare(d1, d2);
                });

                // ✅ 转换为 JSON 传给 JS
                String json = new Gson().toJson(list);

                new Handler(Looper.getMainLooper()).post(() -> {
                    adapter.setTaskList(list);
                    // 将 JSON 做好 JS 字符串转义后传给页面，保持 showTasks 内使用 JSON.parse
                    String quoted = JSONObject.quote(json);
                    webView.evaluateJavascript(
                            "javascript:showTasks(" + quoted + ")",
                            null
                    );
                });
            }).start();
        }
    }

    /* ✅ 距离计算 */
    private double distance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6378137;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}