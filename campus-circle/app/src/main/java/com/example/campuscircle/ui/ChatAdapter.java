package com.example.campuscircle.ui;

import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.campuscircle.R;
import com.example.campuscircle.model.ChatMessage;

import java.util.List;
import java.util.Map;

public class ChatAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int TYPE_SENT = 1;
    private static final int TYPE_RECEIVED = 2;
    private List<ChatMessage> list;
    private String currentUser;
    private Map<String, String> avatarMap;

    public ChatAdapter(List<ChatMessage> list) { this.list = list; }

    public void setList(List<ChatMessage> list, String currentUser, Map<String, String> avatarMap) {
        this.list = list;
        this.currentUser = currentUser;
        this.avatarMap = avatarMap;
        notifyDataSetChanged();
    }

    @Override
    public int getItemViewType(int position) {
        ChatMessage m = list.get(position);
        return currentUser.equals(m.getFromId()) ? TYPE_SENT : TYPE_RECEIVED;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_SENT) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_chat_sent, parent, false);
            return new SentVH(v);
        } else {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_chat_received, parent, false);
            return new RecVH(v);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ChatMessage m = list.get(position);
        if (holder instanceof SentVH) {
            ((SentVH) holder).tv.setText(m.getType().equals("image") ? "[图片]" : m.getContent());
            // load avatar
            if (avatarMap != null) {
                String uri = avatarMap.get(m.getFromId());
                if (uri != null) ((SentVH) holder).avatar.setImageURI(Uri.parse(uri));
                else ((SentVH) holder).avatar.setImageResource(R.mipmap.ic_launcher);
            }
        } else {
            ((RecVH) holder).tv.setText(m.getType().equals("image") ? "[图片]" : m.getContent());
            if (avatarMap != null) {
                String uri = avatarMap.get(m.getFromId());
                if (uri != null) ((RecVH) holder).avatar.setImageURI(Uri.parse(uri));
                else ((RecVH) holder).avatar.setImageResource(R.mipmap.ic_launcher);
            }
        }
    }

    @Override
    public int getItemCount() { return list == null ? 0 : list.size(); }

    static class SentVH extends RecyclerView.ViewHolder {
        TextView tv; ImageView avatar;
        SentVH(@NonNull View v) { super(v); tv = v.findViewById(R.id.tv_message); avatar = v.findViewById(R.id.img_avatar); }
    }
    static class RecVH extends RecyclerView.ViewHolder {
        TextView tv; ImageView avatar;
        RecVH(@NonNull View v) { super(v); tv = v.findViewById(R.id.tv_message); avatar = v.findViewById(R.id.img_avatar); }
    }
}
