package com.example.campuscircle.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.Conversation;

import java.util.ArrayList;
import java.util.List;

public class ChatListActivity extends AppCompatActivity {

    private androidx.recyclerview.widget.RecyclerView rv;
    private ConversationAdapter adapter;
    private AppDatabase db;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat_list);
        rv = findViewById(R.id.rv_conversations);
        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ConversationAdapter(new ArrayList<>(), this::openConversation);
        rv.setAdapter(adapter);

        db = AppDatabase.getInstance(this);
        String userId = getSharedPreferences("user", MODE_PRIVATE).getString("userId", "unknown");
        new Thread(() -> {
            List<Conversation> list = db.conversationDao().getConversationsForUser(userId);
            runOnUiThread(() -> adapter.setList(list, userId));
        }).start();
    }

    private void openConversation(Conversation conv, String otherUserId) {
        Intent it = new Intent(this, ChatActivity.class);
        it.putExtra("convId", conv.getId());
        it.putExtra("otherUserId", otherUserId);
        it.putExtra("taskId", conv.getTaskId());
        startActivity(it);
    }
}
