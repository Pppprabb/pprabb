package com.example.campuscircle.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "message_table")
public class Message {
    @PrimaryKey(autoGenerate = true)
    private int id;

    private int taskId;
    private String type; // 接取/完成/放弃/删除/发布
    private String content;
    private long timestamp;
    private String actorId; // who triggered (e.g., takerId)
    private String actorName;
    private String receiverId; // message receiver (e.g., publisher userId)

    public Message(int taskId, String type, String content, long timestamp, String actorId, String actorName, String receiverId) {
        this.taskId = taskId;
        this.type = type;
        this.content = content;
        this.timestamp = timestamp;
        this.actorId = actorId;
        this.actorName = actorName;
        this.receiverId = receiverId;
    }

    public void setId(int id) { this.id = id; }
    public int getId() { return id; }
    public int getTaskId() { return taskId; }
    public String getType() { return type; }
    public String getContent() { return content; }
    public long getTimestamp() { return timestamp; }
    public String getActorId() { return actorId; }
    public String getActorName() { return actorName; }
    public String getReceiverId() { return receiverId; }
}
