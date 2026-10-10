package com.example.campuscircle.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "conversation_table")
public class Conversation {
    @PrimaryKey(autoGenerate = true)
    private int id;
    private String userA; // userId
    private String userB; // userId
    private int taskId; // associated task if any (0 if none)

    public Conversation(String userA, String userB, int taskId) {
        this.userA = userA;
        this.userB = userB;
        this.taskId = taskId;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getUserA() { return userA; }
    public String getUserB() { return userB; }
    public int getTaskId() { return taskId; }
}
