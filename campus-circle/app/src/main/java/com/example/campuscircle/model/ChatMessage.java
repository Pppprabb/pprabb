package com.example.campuscircle.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "chat_message_table")
public class ChatMessage {
    @PrimaryKey(autoGenerate = true)
    private int id;
    private int convId;
    private String fromId;
    private String toId;
    private String content;
    private String type; // text/image
    private long timestamp;

    public ChatMessage(int convId, String fromId, String toId, String content, String type, long timestamp) {
        this.convId = convId;
        this.fromId = fromId;
        this.toId = toId;
        this.content = content;
        this.type = type;
        this.timestamp = timestamp;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getConvId() { return convId; }
    public String getFromId() { return fromId; }
    public String getToId() { return toId; }
    public String getContent() { return content; }
    public String getType() { return type; }
    public long getTimestamp() { return timestamp; }
}
