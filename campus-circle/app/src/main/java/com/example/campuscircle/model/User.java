package com.example.campuscircle.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "user_table")
public class User {

    @PrimaryKey
    @NonNull
    private String userId; // 手机号作为唯一ID

    private String userName;
    private String avatarUri;

    public User(@NonNull String userId, String userName, String avatarUri) {
        this.userId = userId;
        this.userName = userName;
        this.avatarUri = avatarUri;
    }

    @NonNull
    public String getUserId() { return userId; }
    public void setUserId(@NonNull String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getAvatarUri() { return avatarUri; }
    public void setAvatarUri(String avatarUri) { this.avatarUri = avatarUri; }
}
