package com.example.campuscircle.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.campuscircle.R;
import com.example.campuscircle.model.Message;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.VH> {

    private List<Message> list = new ArrayList<>();

    public void setList(List<Message> msgs) {
        this.list = msgs;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_message, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        Message m = list.get(position);
        holder.title.setText(m.getType());
        holder.content.setText(m.getContent());
        String time = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.CHINA).format(new Date(m.getTimestamp()));
        String meta = (m.getActorName() == null ? m.getActorId() : m.getActorName()) + " • " + time;
        holder.meta.setText(meta);
    }

    @Override
    public int getItemCount() { return list.size(); }

    static class VH extends RecyclerView.ViewHolder {
        TextView title, content, meta;
        VH(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.tv_msg_title);
            content = itemView.findViewById(R.id.tv_msg_content);
            meta = itemView.findViewById(R.id.tv_msg_meta);
        }
    }
}
