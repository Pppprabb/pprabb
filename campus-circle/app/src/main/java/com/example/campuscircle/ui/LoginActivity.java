package com.example.campuscircle.ui;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Random;

import com.example.campuscircle.databinding.ActivityLoginBinding;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private String realCode = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // 获取验证码
        binding.btnGetCode.setOnClickListener(v -> {
            if (!checkPhone()) return;

            realCode = generateCode();
            Toast.makeText(this, "验证码已发送：" + realCode, Toast.LENGTH_LONG).show();
            startCountDown();
        });

        // 登录
        binding.btnLogin.setOnClickListener(v -> {
            if (!checkPhone()) return;

            String code = binding.etCode.getText().toString().trim();
            if (TextUtils.isEmpty(code)) {
                Toast.makeText(this, "请输入验证码", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!code.equals(realCode)) {
                Toast.makeText(this, "验证码错误", Toast.LENGTH_SHORT).show();
                return;
            }

            saveLoginState();
            startActivity(new Intent(LoginActivity.this, MainActivity.class));
            finish();
        });
    }

    /** 校验手机号 */
    private boolean checkPhone() {
        String phone = binding.etPhone.getText().toString().trim();
        if (TextUtils.isEmpty(phone)) {
            Toast.makeText(this, "请输入手机号", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (!phone.matches("^1[3-9]\\d{9}$")) {
            Toast.makeText(this, "手机号格式不正确", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    /** 生成6位验证码 */
    private String generateCode() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    /** 倒计时 */
    private void startCountDown() {
        binding.btnGetCode.setEnabled(false);
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                binding.btnGetCode.setText(millisUntilFinished / 1000 + "s");
            }
            public void onFinish() {
                binding.btnGetCode.setText("获取验证码");
                binding.btnGetCode.setEnabled(true);
            }
        }.start();
    }

    /** 保存登录状态 */
    private void saveLoginState() {
        String phone = binding.etPhone.getText().toString().trim();

        // save into generic user prefs used across app
        SharedPreferences sp = getSharedPreferences("user", MODE_PRIVATE);
        sp.edit()
                .putBoolean("is_login", true)
                .putString("token", "mock_token_" + System.currentTimeMillis())
                .putString("userId", phone)
                .putString("userName", "android")
                .apply();

        // ensure User record exists in DB
        new Thread(() -> {
            com.example.campuscircle.db.AppDatabase db = com.example.campuscircle.db.AppDatabase.getInstance(LoginActivity.this);
            com.example.campuscircle.model.User u = db.userDao().getUserById(phone);
            if (u == null) {
                db.userDao().insert(new com.example.campuscircle.model.User(phone, "android", null));
            }
        }).start();
    }
}