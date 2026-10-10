package com.example.campuscircle.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.campuscircle.R;
import com.example.campuscircle.model.Task;

import java.util.ArrayList;
import java.util.List;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.TaskViewHolder> {

    public interface OnTaskActionListener {
        void onAccept(Task task);
        void onComplete(Task task);
        void onAbandon(Task task);
        void onDelete(Task task);
    }

    private List<Task> taskList = new ArrayList<>();
    private String currentUserId;
    private OnTaskActionListener listener;

    private boolean showActionButtons = false; // delete/complete/abandon (personal page)
    private boolean showAcceptInList = false; // accept visible in list (detail page only)

    public TaskAdapter() {}

    public TaskAdapter(String currentUserId, OnTaskActionListener listener) {
        this(currentUserId, listener, false, false);
    }

    public TaskAdapter(String currentUserId, OnTaskActionListener listener, boolean showActionButtons, boolean showAcceptInList) {
        this.currentUserId = currentUserId;
        this.listener = listener;
        this.showActionButtons = showActionButtons;
        this.showAcceptInList = showAcceptInList;
    }

    public void setTaskList(List<Task> tasks) {
        this.taskList = tasks;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_task, parent, false);
        return new TaskViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, int position) {
        Task task = taskList.get(position);
        holder.tvUserName.setText(task.getUserName());
        holder.tvTime.setText(task.getTime());
        holder.tvContent.setText(task.getContent());
        holder.tvType.setText(task.getType());
        holder.tvLocation.setText("📍 屏峰校区");
        // 显示任务状态
        if (task.getStatus() != null) {
            holder.tvTime.setText(task.getTime() + " · " + task.getStatus());
        }

        // 点击打开详情（通过 Activity 或 Fragment 回调可扩展）
        holder.itemView.setOnClickListener(v -> {
            // 使用 fragment 通信或 activity 启动详情页
            // 这里简化：假设宿主 activity 会监听并处理
            v.getContext().startActivity(new android.content.Intent(v.getContext(), com.example.campuscircle.ui.TaskDetailActivity.class)
                    .putExtra("taskId", task.getId()));
        });

        // 操作按钮显示逻辑
        if (listener != null && currentUserId != null) {
            // hide all by default
            holder.btnAccept.setVisibility(View.GONE);
            holder.btnComplete.setVisibility(View.GONE);
            holder.btnAbandon.setVisibility(View.GONE);
            holder.btnDelete.setVisibility(View.GONE);

            boolean isPublisher = currentUserId.equals(task.getUserId());
            boolean isTaker = currentUserId.equals(task.getTakerId());
            String status = task.getStatus() == null ? "" : task.getStatus();

            if (showActionButtons) {
                if (isPublisher) {
                    // publisher can delete
                    holder.btnDelete.setVisibility(View.VISIBLE);
                }
                if (isTaker && "进行中".equals(status)) {
                    holder.btnComplete.setVisibility(View.VISIBLE);
                    holder.btnAbandon.setVisibility(View.VISIBLE);
                }
            }

            // accept only when explicitly allowed (detail view)
            if (showAcceptInList && "待接取".equals(status) && !isPublisher) {
                holder.btnAccept.setVisibility(View.VISIBLE);
            }

            holder.btnAccept.setOnClickListener(v -> listener.onAccept(task));
            holder.btnComplete.setOnClickListener(v -> listener.onComplete(task));
            holder.btnAbandon.setOnClickListener(v -> listener.onAbandon(task));
            holder.btnDelete.setOnClickListener(v -> listener.onDelete(task));
        }
    }

    @Override
    public int getItemCount() {
        return taskList.size();
    }

    static class TaskViewHolder extends RecyclerView.ViewHolder {
        TextView tvUserName, tvTime, tvType, tvContent, tvLocation;
        Button btnAccept, btnComplete, btnAbandon, btnDelete;
        ImageView ivAvatar;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            ivAvatar = itemView.findViewById(R.id.iv_avatar);
            tvUserName = itemView.findViewById(R.id.tv_user_name);
            tvTime = itemView.findViewById(R.id.tv_time);
            tvType = itemView.findViewById(R.id.tv_type);
            tvContent = itemView.findViewById(R.id.tv_content);
            tvLocation = itemView.findViewById(R.id.tv_location);
            btnAccept = itemView.findViewById(R.id.btn_accept);
            btnComplete = itemView.findViewById(R.id.btn_complete);
            btnAbandon = itemView.findViewById(R.id.btn_abandon);
            btnDelete = itemView.findViewById(R.id.btn_delete);
        }
    }
}