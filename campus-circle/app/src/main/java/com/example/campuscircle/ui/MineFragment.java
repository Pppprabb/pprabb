package com.example.campuscircle.ui;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.ImageView;

import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.campuscircle.R;
import com.example.campuscircle.model.Task;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.ui.adapter.TaskAdapter;

import java.util.List;

public class MineFragment extends Fragment {

    private ImageView ivAvatar;
    private TextView tvMineName;
    private Button btnEditProfile, btnViewPublished, btnViewTaken;
    private Button btnLogout;
    private Button btnOpenChat;
    private androidx.recyclerview.widget.RecyclerView rvTasks;

    private ActivityResultLauncher<String> pickImage;
    private AppDatabase db;
    private TaskAdapter adapter;
    private static final int MODE_PUBLISHED = 0;
    private static final int MODE_TAKEN = 1;
    private int currentMode = MODE_PUBLISHED;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_mine, container, false);
        ivAvatar = v.findViewById(R.id.iv_avatar);
        tvMineName = v.findViewById(R.id.tv_mine_name);
        TextView tvMinePhone = v.findViewById(R.id.tv_mine_phone);
        btnEditProfile = v.findViewById(R.id.btn_edit_profile);
        btnViewPublished = v.findViewById(R.id.btn_view_published);
        btnViewTaken = v.findViewById(R.id.btn_view_taken);
        rvTasks = v.findViewById(R.id.rv_mine_tasks);

        db = AppDatabase.getInstance(requireContext());

        String currentUserId = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        // showActionButtons=true: show delete/complete/abandon in personal lists
        adapter = new com.example.campuscircle.ui.adapter.TaskAdapter(currentUserId, new com.example.campuscircle.ui.adapter.TaskAdapter.OnTaskActionListener() {
            @Override
            public void onAccept(Task task) {
                // Not used in Mine view
            }

            @Override
            public void onComplete(Task task) {
                new Thread(() -> {
                    db.taskDao().updateStatus(task.getId(), "已完成", task.getTakerId(), task.getTakerName());
                    com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                            task.getId(), "完成", "任务已由 " + task.getTakerName() + " 标记为完成", System.currentTimeMillis(), task.getTakerId(), task.getTakerName(), task.getUserId()
                    );
                    db.messageDao().insert(msg);
                    requireActivity().runOnUiThread(() -> refreshCurrentList());
                }).start();
            }

            @Override
            public void onAbandon(Task task) {
                new Thread(() -> {
                    db.taskDao().updateStatus(task.getId(), "待接取", null, null);
                    com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                            task.getId(), "放弃", "任务接取者已放弃任务", System.currentTimeMillis(), task.getTakerId(), task.getTakerName(), task.getUserId()
                    );
                    db.messageDao().insert(msg);
                    requireActivity().runOnUiThread(() -> refreshCurrentList());
                }).start();
            }

            @Override
            public void onDelete(Task task) {
                new Thread(() -> {
                    db.taskDao().deleteById(task.getId());
                    com.example.campuscircle.model.Message msg = new com.example.campuscircle.model.Message(
                            task.getId(), "删除", "任务已被发布者删除", System.currentTimeMillis(), task.getUserId(), task.getUserName(), task.getUserId()
                    );
                    db.messageDao().insert(msg);
                    requireActivity().runOnUiThread(() -> refreshCurrentList());
                }).start();
            }
        }, true, false);
        rvTasks.setLayoutManager(new LinearLayoutManager(getContext()));
        rvTasks.setAdapter(adapter);


        pickImage = registerForActivityResult(new ActivityResultContracts.GetContent(), (ActivityResultCallback<Uri>) uri -> {
            if (uri != null) {
                ivAvatar.setImageURI(uri);
                // save avatar uri to preferences
                getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).edit().putString("avatarUri", uri.toString()).apply();
            }
        });

        ivAvatar.setOnClickListener(t -> pickImage.launch("image/*"));

        btnEditProfile.setOnClickListener(t -> {
            // show a simple input dialog to change display name
            android.widget.EditText input = new android.widget.EditText(requireContext());
            new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                    .setTitle("修改用户名")
                    .setView(input)
                    .setPositiveButton("保存", (dialog, which) -> {
                        String newName = input.getText().toString().trim();
                        if (!newName.isEmpty()) {
                            tvMineName.setText(newName);
                            String userId = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
                            getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).edit().putString("userName", newName).apply();
                            new Thread(() -> {
                                db.taskDao().updatePublisherName(userId, newName);
                                // also update user table
                                if (db.userDao().getUserById(userId) != null) {
                                    db.userDao().updateUser(userId, newName, getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("avatarUri", null));
                                }
                            }).start();
                        }
                    })
                    .setNegativeButton("取消", null)
                    .show();
        });

        btnOpenChat = v.findViewById(R.id.btn_open_chat);
        btnOpenChat.setOnClickListener(c -> startActivity(new android.content.Intent(requireContext(), ChatListActivity.class)));

        // logout button
        btnLogout = v.findViewById(R.id.btn_logout);
        btnLogout.setOnClickListener(l -> {
            // clear login state and go to LoginActivity
            getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).edit()
                    .putBoolean("is_login", false)
                    .remove("userId")
                    .remove("userName")
                    .remove("avatarUri")
                    .apply();
            android.content.Intent it = new android.content.Intent(requireContext(), LoginActivity.class);
            it.addFlags(android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK | android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(it);
            requireActivity().finish();
        });

        btnViewPublished.setOnClickListener(t -> {
            currentMode = MODE_PUBLISHED;
            loadPublished();
        });
        btnViewTaken.setOnClickListener(t -> {
            currentMode = MODE_TAKEN;
            loadTaken();
        });

        // load saved user info initially and default to published
        loadUserInfo();
        currentMode = MODE_PUBLISHED;
        loadPublished();

        return v;
    }

    @Override
    public void onResume() {
        super.onResume();
        loadUserInfo();
    }

    private void loadUserInfo() {
        if (getActivity() == null) return;
        String savedName = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userName", "用户名");
        String savedPhone = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "未知手机号");
        String avatarUri = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("avatarUri", null);
        tvMineName.setText(savedName);
        TextView tvMinePhone = getView() != null ? getView().findViewById(R.id.tv_mine_phone) : null;
        if (tvMinePhone != null) tvMinePhone.setText(savedPhone);
        if (avatarUri != null) {
            try { ivAvatar.setImageURI(Uri.parse(avatarUri)); } catch (Exception ignored) {}
        }
    }

    private void loadPublished() {
        String userId = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        new Thread(() -> {
            List<com.example.campuscircle.model.Task> list = db.taskDao().getTasksByUserId(userId);
            requireActivity().runOnUiThread(() -> adapter.setTaskList(list));
        }).start();
    }

    private void loadTaken() {
        String userId = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        new Thread(() -> {
            List<com.example.campuscircle.model.Task> list = db.taskDao().getTasksByTakerId(userId);
            requireActivity().runOnUiThread(() -> adapter.setTaskList(list));
        }).start();
    }

    private void refreshCurrentList() {
        if (currentMode == MODE_PUBLISHED) loadPublished(); else loadTaken();
    }
}
