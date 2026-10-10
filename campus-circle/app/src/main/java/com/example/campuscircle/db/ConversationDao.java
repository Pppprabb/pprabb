package com.example.campuscircle.db;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.campuscircle.model.Conversation;

import java.util.List;

@Dao
public interface ConversationDao {
    @Insert
    long insert(Conversation conv);

    @Query("SELECT * FROM conversation_table WHERE (userA = :userId OR userB = :userId)")
    List<Conversation> getConversationsForUser(String userId);

    @Query("SELECT * FROM conversation_table WHERE (userA = :a AND userB = :b) OR (userA = :b AND userB = :a) LIMIT 1")
    Conversation findBetween(String a, String b);
}
