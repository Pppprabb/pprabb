package com.example.campuscircle.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.campuscircle.model.ChatMessage;

import java.util.List;

@Dao
public interface ChatMessageDao {
    @Insert
    void insert(ChatMessage msg);

    @Query("SELECT * FROM chat_message_table WHERE convId = :convId ORDER BY timestamp ASC")
    LiveData<List<ChatMessage>> getMessagesForConv(int convId);

    @Query("SELECT * FROM chat_message_table WHERE (fromId = :userId OR toId = :userId) ORDER BY timestamp DESC")
    List<ChatMessage> getRecentForUser(String userId);
}
