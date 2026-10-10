package com.example.campuscircle.ui;

import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.Message;
import com.example.campuscircle.ui.adapter.MessageAdapter;

import java.util.List;

public class MessageActivity extends AppCompatActivity {

    private androidx.recyclerview.widget.RecyclerView rv;
    private MessageAdapter adapter;
    private AppDatabase db;
    private android.widget.ImageButton btnBack;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_messages);
        rv = findViewById(R.id.rv_messages);
        btnBack = findViewById(R.id.btn_messages_back);
        btnBack.setOnClickListener(v -> finish());
        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MessageAdapter();
        rv.setAdapter(adapter);

        db = AppDatabase.getInstance(this);
        String userId = getSharedPreferences("user", MODE_PRIVATE).getString("userId", "unknown");
        db.messageDao().getMessagesForUser(userId).observe(this, new Observer<List<Message>>() {
            @Override
            public void onChanged(List<Message> messages) {
                adapter.setList(messages);
            }
        });
    }
}
