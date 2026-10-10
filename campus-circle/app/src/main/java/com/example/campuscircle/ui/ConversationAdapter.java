package com.example.campuscircle.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.campuscircle.R;
import com.example.campuscircle.model.Conversation;

import java.util.List;

public class ConversationAdapter extends RecyclerView.Adapter<ConversationAdapter.VH> {

    public interface Callback { void onOpen(Conversation conv, String otherUserId); }

    private List<Conversation> list;
    private Callback cb;
    private String currentUser;

    public ConversationAdapter(List<Conversation> list, Callback cb) { this.list = list; this.cb = cb; }

    public void setList(List<Conversation> list, String currentUser) { this.list = list; this.currentUser = currentUser; notifyDataSetChanged(); }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new VH(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_conversation, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        Conversation c = list.get(position);
        String other = currentUser.equals(c.getUserA()) ? c.getUserB() : c.getUserA();
        holder.title.setText("对话：" + other);
        holder.sub.setText("任务ID: " + c.getTaskId());
        holder.itemView.setOnClickListener(v -> cb.onOpen(c, other));
    }

    @Override
    public int getItemCount() { return list == null ? 0 : list.size(); }

    static class VH extends RecyclerView.ViewHolder {
        TextView title, sub;
        VH(@NonNull View itemView) { super(itemView); title = itemView.findViewById(R.id.tv_conv_title); sub = itemView.findViewById(R.id.tv_conv_sub); }
    }
}
