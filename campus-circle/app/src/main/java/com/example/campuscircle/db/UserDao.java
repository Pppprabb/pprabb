package com.example.campuscircle.db;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.campuscircle.model.User;

@Dao
public interface UserDao {

    @Insert
    void insert(User user);

    @Query("SELECT * FROM user_table WHERE userId = :userId LIMIT 1")
    User getUserById(String userId);

    @Query("UPDATE user_table SET userName = :userName, avatarUri = :avatarUri WHERE userId = :userId")
    void updateUser(String userId, String userName, String avatarUri);
}
