package com.example.campuscircle.model;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

@Entity(tableName = "task_table")
public class Task {

    @PrimaryKey(autoGenerate = true)
    private int id;

    private String userId;      // 用户手机号（唯一ID）
    private String userName;    // 用户名（初始为手机号）
    private String type;         // 失物招领 / 跑腿 / 二手交换
    private String content;      // 任务描述
    private double latitude;      // 纬度
    private double longitude;     // 经度
    private String time;          // 发布时间
    private String status;        // 任务状态：待接取 / 进行中 / 已完成
    private String takerId;       // 接取者 userId（可空）
    private String takerName;     // 接取者姓名（可空）
    private String imageUri;      // 任务附带图片 URI（可空）

    // Room 必须使用这个构造方法
    public Task(String userId, String userName, String type, String content,
                double latitude, double longitude, String time, String imageUri) {
        this.userId = userId;
        this.userName = userName;
        this.type = type;
        this.content = content;
        this.latitude = latitude;
        this.longitude = longitude;
        this.time = time;
        this.status = "待接取";
        this.takerId = null;
        this.takerName = null;
        this.imageUri = imageUri;
    }

    @Ignore
    public Task(int id, String userId, String userName, String type, String content,
                double latitude, double longitude, String time, String imageUri) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.type = type;
        this.content = content;
        this.latitude = latitude;
        this.longitude = longitude;
        this.time = time;
        this.status = "待接取";
        this.takerId = null;
        this.takerName = null;
        this.imageUri = imageUri;
    }

    // ===== Getter & Setter =====
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTakerId() { return takerId; }
    public void setTakerId(String takerId) { this.takerId = takerId; }

    public String getTakerName() { return takerName; }
    public void setTakerName(String takerName) { this.takerName = takerName; }

    public String getImageUri() { return imageUri; }
    public void setImageUri(String imageUri) { this.imageUri = imageUri; }
}