package com.example.campuscircle.ui;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.example.campuscircle.R;
import com.example.campuscircle.databinding.ActivityMainBinding;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // 设置 Toolbar
        setSupportActionBar(binding.toolbar);

        // 设置消息按钮：进入消息页面
        binding.btnMessage.setOnClickListener(v -> {
            startActivity(new android.content.Intent(this, MessageActivity.class));
        });

        // 初始化底部导航栏
        BottomNavigationView navView = binding.bottomNavigation;

        // 设置默认选中首页
        loadFragment(new HomeFragment());

        navView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment selectedFragment = null;
                int id = item.getItemId(); // 获取点击项的 ID

                // 使用 if-else 代替 switch，解决常量报错问题
                if (id == R.id.navigation_home) {
                    selectedFragment = new HomeFragment();
                } else if (id == R.id.navigation_discover) {
                    selectedFragment = new DiscoverFragment();
                } else if (id == R.id.navigation_publish) {
                    selectedFragment = new PublishFragment();
                } else if (id == R.id.navigation_mine) {
                    selectedFragment = new MineFragment();
                }

                if (selectedFragment != null) {
                    loadFragment(selectedFragment);
                    return true;
                }
                return false;
            }
        });
    }

    /**
     * 辅助方法：加载 Fragment 到中间的容器里
     */
    private void loadFragment(Fragment fragment) {
        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        ft.replace(R.id.fragment_container, fragment);
        ft.commit();
    }
}