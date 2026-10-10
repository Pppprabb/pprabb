package com.example.campuscircle.ui;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.ChatMessage;
import com.example.campuscircle.model.Conversation;

import java.util.ArrayList;
import java.util.List;

public class ChatActivity extends AppCompatActivity {

    private androidx.recyclerview.widget.RecyclerView rv;
    private ChatAdapter adapter;
    private AppDatabase db;
    private int convId;
    private String otherUserId;
    private String currentUserId;
    private int taskId;

    private EditText etMessage;
    private Button btnSend;
    private ImageButton btnImage, btnBack;
    private ActivityResultLauncher<String> pickImage;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        rv = findViewById(R.id.rv_chat);
        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ChatAdapter(new ArrayList<>());
        rv.setAdapter(adapter);

        etMessage = findViewById(R.id.et_message);
        btnSend = findViewById(R.id.btn_send);
        btnImage = findViewById(R.id.btn_send_image);
        btnBack = findViewById(R.id.btn_chat_back);
        TextView tvTitle = findViewById(R.id.tv_chat_title);

        db = AppDatabase.getInstance(this);

        currentUserId = getSharedPreferences("user", MODE_PRIVATE).getString("userId", "unknown");

        Intent it = getIntent();
        convId = it.getIntExtra("convId", -1);
        otherUserId = it.getStringExtra("otherUserId");
        taskId = it.getIntExtra("taskId", 0);

        tvTitle.setText(otherUserId);

        pickImage = registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            if (uri != null) sendImage(uri);
        });

        btnImage.setOnClickListener(v -> pickImage.launch("image/*"));
        btnBack.setOnClickListener(v -> finish());

        btnSend.setOnClickListener(v -> {
            String txt = etMessage.getText().toString().trim();
            if (!txt.isEmpty()) {
                sendText(txt);
                etMessage.setText("");
            }
        });

        // observe messages
        db.chatMessageDao().getMessagesForConv(convId).observe(this, new Observer<List<ChatMessage>>() {
            @Override
            public void onChanged(List<ChatMessage> chatMessages) {
                // fetch avatars for current and other users in background then update adapter
                new Thread(() -> {
                    java.util.Map<String, String> avatarMap = new java.util.HashMap<>();
                    com.example.campuscircle.model.User u1 = db.userDao().getUserById(currentUserId);
                    com.example.campuscircle.model.User u2 = db.userDao().getUserById(otherUserId);
                    if (u1 != null && u1.getAvatarUri() != null) avatarMap.put(currentUserId, u1.getAvatarUri());
                    if (u2 != null && u2.getAvatarUri() != null) avatarMap.put(otherUserId, u2.getAvatarUri());
                    runOnUiThread(() -> {
                        adapter.setList(chatMessages, currentUserId, avatarMap);
                        if (chatMessages.size() > 0) rv.scrollToPosition(chatMessages.size()-1);
                    });
                }).start();
            }
        });
    }

    private void sendText(String txt) {
        new Thread(() -> {
            ChatMessage m = new ChatMessage(convId, currentUserId, otherUserId, txt, "text", System.currentTimeMillis());
            db.chatMessageDao().insert(m);
            // also insert Message for receiver notification
            com.example.campuscircle.model.Message notify = new com.example.campuscircle.model.Message(taskId, "chat", txt, System.currentTimeMillis(), currentUserId, null, otherUserId);
            db.messageDao().insert(notify);
        }).start();
    }

    private void sendImage(Uri uri) {
        new Thread(() -> {
            String uriStr = uri.toString();
            ChatMessage m = new ChatMessage(convId, currentUserId, otherUserId, uriStr, "image", System.currentTimeMillis());
            db.chatMessageDao().insert(m);
            com.example.campuscircle.model.Message notify = new com.example.campuscircle.model.Message(taskId, "chat", "[图片]", System.currentTimeMillis(), currentUserId, null, otherUserId);
            db.messageDao().insert(notify);
        }).start();
    }
}
