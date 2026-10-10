package com.example.campuscircle.ui;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.Task;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class PublishFragment extends Fragment {

    private EditText etContent;
    private Spinner spType;
    private Button btnPickLocation, btnPublish;
    private ImageView ivPreview;

    private double pickedLng = 120.041114, pickedLat = 30.228378;

    private AppDatabase db;

    // 图片选择（头像上传 reuse）
    private ActivityResultLauncher<String> pickImage;
    private String pickedImageUri = null;
    private androidx.activity.result.ActivityResultLauncher<android.content.Intent> pickLocationLauncher;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_publish, container, false);

        // show current user info
        etContent = v.findViewById(R.id.et_content);
        TextView tvUserName = v.findViewById(R.id.tv_user_name);
        TextView tvUserPhone = v.findViewById(R.id.tv_user_phone);
        ImageView ivUserAvatar = v.findViewById(R.id.iv_user_avatar);
        spType = v.findViewById(R.id.sp_type);
        btnPickLocation = v.findViewById(R.id.btn_pick_location);
        btnPublish = v.findViewById(R.id.btn_publish);
        ivPreview = v.findViewById(R.id.iv_preview);

        db = AppDatabase.getInstance(requireContext());

        // SharedPreferences
        String userNamePref = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userName", "");
        String userIdPref = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        String avatarUri = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("avatarUri", null);
        if (userNamePref != null && !userNamePref.isEmpty()) tvUserName.setText(userNamePref);
        tvUserPhone.setText(userIdPref);
        if (avatarUri != null) {
            try { ivUserAvatar.setImageURI(Uri.parse(avatarUri)); } catch (Exception ignored) {}
        }

        // ensure user exists in DB
        new Thread(() -> {
            com.example.campuscircle.model.User u = db.userDao().getUserById(userIdPref);
            if (u == null) {
                db.userDao().insert(new com.example.campuscircle.model.User(userIdPref, userNamePref == null || userNamePref.isEmpty() ? "android" : userNamePref, avatarUri));
            }
        }).start();

        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item,
                new String[]{"跑腿代取","失物招领","二手交换"});
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spType.setAdapter(adapter);

        pickImage = registerForActivityResult(new ActivityResultContracts.GetContent(),
                (ActivityResultCallback<Uri>) uri -> {
                    if (uri != null) {
                        ivPreview.setImageURI(uri);
                        ivPreview.setVisibility(View.VISIBLE);
                        pickedImageUri = uri.toString();
                    }
                });

        pickLocationLauncher = registerForActivityResult(new androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult(), result -> {
            if (result != null && result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                double lng = result.getData().getDoubleExtra("lng", pickedLng);
                double lat = result.getData().getDoubleExtra("lat", pickedLat);
                pickedLng = lng;
                pickedLat = lat;
                android.widget.Toast.makeText(requireContext(), "已选位置：" + lat + "," + lng, android.widget.Toast.LENGTH_SHORT).show();
            }
        });

        v.findViewById(R.id.btn_pick_image).setOnClickListener(t -> pickImage.launch("image/*"));

        btnPickLocation.setOnClickListener(t -> {
            // 打开地图选择位置（MapPickActivity）
            android.content.Intent it = new android.content.Intent(requireContext(), MapPickActivity.class);
            pickLocationLauncher.launch(it);
        });

        btnPublish.setOnClickListener(t -> publishTask());

        return v;
    }

    private void publishTask() {
        String userId = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userId", "unknown");
        String userName = getActivity().getSharedPreferences("user", Activity.MODE_PRIVATE).getString("userName", "匿名用户");
        String type = (String) spType.getSelectedItem();
        String content = etContent.getText().toString().trim();

        if (userName.isEmpty() || content.isEmpty()) return;

        Task task = new Task(userId, userName, type, content, pickedLat, pickedLng,
            new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.CHINA).format(new Date()), pickedImageUri);

        new Thread(() -> {
            db.taskDao().insert(task);
            // 发布后可通过广播/LiveData 自动更新 HomeFragment 和 DiscoverFragment
            requireActivity().runOnUiThread(() -> {
                // 清空内容并提示
                etContent.setText("");
                pickedImageUri = null;
                ivPreview.setVisibility(View.GONE);
                android.widget.Toast.makeText(requireContext(), "任务发布成功", android.widget.Toast.LENGTH_SHORT).show();
            });
        }).start();
    }
}