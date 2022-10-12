package com.app.damnvulnerablebank;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class Qadapter extends RecyclerView.Adapter<Qadapter.ViewHolder> {

    LayoutInflater inflater;
    List<QnAlistRecords> qrecords;
    private OnItemClickListener mListener;

    public interface OnItemClickListener{
        void onItemClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener){
        mListener = listener;
    }

    public Qadapter(Context ctx,List<QnAlistRecords> qrecords){
        this.inflater=LayoutInflater.from(ctx);
        this.qrecords=qrecords;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.custom_qna_list,parent,false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.subject.setText(qrecords.get(position).getSubject());
        holder.writer.setText(qrecords.get(position).getWriter());
        holder.date.setText(qrecords.get(position).getDate());
        holder.id.setText(qrecords.get(position).getId());

    }

    @Override
    public int getItemCount() {
        return qrecords.size();
    }

    public class ViewHolder extends  RecyclerView.ViewHolder{
        TextView subject,writer, date, id;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            subject=itemView.findViewById(R.id.subject);
            writer=itemView.findViewById(R.id.writer);
            date = itemView.findViewById(R.id.date);
            id = itemView.findViewById(R.id.id);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(mListener != null){
                        int position =getAdapterPosition();
                        if(position !=RecyclerView.NO_POSITION){
                            mListener.onItemClick(position);
                        }
                    }
                }
            });

        }
    }
}
