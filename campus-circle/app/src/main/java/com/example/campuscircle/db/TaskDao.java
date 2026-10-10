package com.example.campuscircle.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.campuscircle.model.Task;

import java.util.List;

@Dao
public interface TaskDao {

    @Insert
    long insert(Task task);

    @Query("UPDATE task_table SET status = :status, takerId = :takerId, takerName = :takerName WHERE id = :id")
    void updateStatus(int id, String status, String takerId, String takerName);

    @Query("DELETE FROM task_table WHERE id = :id")
    void deleteById(int id);

    @Query("SELECT * FROM task_table ORDER BY id DESC")
    LiveData<List<Task>> getAllTasks();

    @Query("SELECT * FROM task_table WHERE id = :id LIMIT 1")
    Task getTaskById(int id);

    @Query("SELECT * FROM task_table WHERE userId = :userId ORDER BY id DESC")
    List<Task> getTasksByUserId(String userId);

    @Query("SELECT * FROM task_table WHERE takerId = :takerId ORDER BY id DESC")
    List<Task> getTasksByTakerId(String takerId);

    @Query("UPDATE task_table SET userName = :newName WHERE userId = :userId")
    void updatePublisherName(String userId, String newName);

    @Query("SELECT * FROM task_table")
    List<Task> getAllTasksSync();
}