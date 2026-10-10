package com.example.campuscircle.ui;

import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.campuscircle.R;
import com.example.campuscircle.db.AppDatabase;
import com.example.campuscircle.model.Task;
import com.example.campuscircle.ui.adapter.TaskAdapter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class HomeFragment extends Fragment {

    private SwipeRefreshLayout swipeRefresh;
    private RecyclerView recyclerView;
    private TaskAdapter adapter;
    private AppDatabase db;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        swipeRefresh = view.findViewById(R.id.swipe_refresh);
        recyclerView = view.findViewById(R.id.recycler_view);

        db = AppDatabase.getInstance(requireContext());

        setupRecyclerView();
        setupSwipeRefresh();
        loadTasksFromDB();

        // 首次进入插入模拟数据
        insertMockTasksIfNeeded();

        return view;
    }

    private void setupRecyclerView() {
        adapter = new TaskAdapter();
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeColors(0x3F51B5);
        swipeRefresh.setOnRefreshListener(this::loadTasksFromDB);
    }

    private void loadTasksFromDB() {
        new Thread(() -> {
            List<Task> list = db.taskDao().getAllTasksSync();
            requireActivity().runOnUiThread(() -> {
                adapter.setTaskList(list);
                swipeRefresh.setRefreshing(false);
            });
        }).start();
    }

    private void insertMockTasksIfNeeded() {
        new Thread(() -> {
            if (db.taskDao().getAllTasksSync().isEmpty()) {
                String[] types = {"跑腿代取", "失物招领", "二手交换"};
                String[] contents = {
                        "帮忙取个快递到家和堂",
                        "捡到一个黑色钱包，在图书馆二楼",
                        "九成新蓝牙耳机低价出",
                        "代买午饭送到养息府",
                        "丢失校园卡一张，求归还"
                };

                double baseLat = 30.227;
                double baseLng = 120.038;

                for (int i = 0; i < 5; i++) {
                        Task task = new Task(
                            "1380000000" + i,
                            "学生" + i,
                            types[i % types.length],
                            contents[i],
                            baseLat + Math.random() * 0.002,
                            baseLng + Math.random() * 0.002,
                            new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.CHINA).format(new Date()),
                            null
                        );
                    db.taskDao().insert(task);
                }
                loadTasksFromDB();
            }
        }).start();
    }
}