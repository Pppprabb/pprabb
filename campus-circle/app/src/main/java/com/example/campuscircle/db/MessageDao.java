package com.example.campuscircle.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.campuscircle.model.Message;

import java.util.List;

@Dao
public interface MessageDao {
    @Insert
    void insert(Message message);

    @Query("SELECT * FROM message_table ORDER BY timestamp DESC")
    LiveData<List<Message>> getAllMessages();

    @Query("SELECT * FROM message_table WHERE taskId = :taskId ORDER BY timestamp DESC")
    LiveData<List<Message>> getMessagesForTask(int taskId);
    
    @Query("SELECT * FROM message_table WHERE receiverId = :userId ORDER BY timestamp DESC")
    LiveData<List<Message>> getMessagesForUser(String userId);
}
