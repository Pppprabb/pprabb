package com.example.campuscircle.db;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import android.content.Context;

import com.example.campuscircle.model.Task;
import com.example.campuscircle.model.User;
import com.example.campuscircle.model.Message;
import com.example.campuscircle.model.Conversation;
import com.example.campuscircle.model.ChatMessage;

@Database(entities = {Task.class, User.class, Message.class, Conversation.class, ChatMessage.class}, version = 7, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {

    private static AppDatabase INSTANCE;

    public abstract TaskDao taskDao();
    public abstract UserDao userDao();
    public abstract MessageDao messageDao();
    public abstract ConversationDao conversationDao();
    public abstract ChatMessageDao chatMessageDao();

    public static synchronized AppDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            INSTANCE = Room.databaseBuilder(
                            context.getApplicationContext(),
                            AppDatabase.class,
                            "campus_circle_db"
                    )
                    .fallbackToDestructiveMigration() // 版本升级时清空旧数据
                    .build();
        }
        return INSTANCE;
    }
}