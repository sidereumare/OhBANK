package com.app.damnvulnerablebank;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QnAlist extends AppCompatActivity implements Qadapter.OnItemClickListener {
    RecyclerView recyclerView;
    List<QnAlistRecords> qrecords;
    private TextView emptyView;
    Qadapter qadapter;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qna_board);
        recyclerView=findViewById(R.id.listb);
        qrecords = new ArrayList<>();
        emptyView = findViewById(R.id.empty_view);
        viewQnAlist();
    }

    public void viewQnAlist(){
        SharedPreferences sharedPreferences = getSharedPreferences("apiurl", Context.MODE_PRIVATE);
        final String url = "https://c0907315-9d56-485c-9837-59867dbd35f9.mock.pstmn.io";
        String endpoint = "/api/qna/list";
        final String finalurl = url+endpoint;
        RequestQueue queue = Volley.newRequestQueue(this);
        JSONObject requests = new JSONObject();
        try{
            requests.put("enc_data", "123456");
        }catch (JSONException e) {
            e.printStackTrace();
        }
        JsonObjectRequest jsonArrayRequest = new JsonObjectRequest(Request.Method.POST, finalurl, requests,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try {
//                            JSONObject decryptedResponse = new JSONObject(response.get("posts").toString());
//
//                            // Check for error message
//                            if(decryptedResponse.getJSONObject("status").getInt("code") != 200) {
//                                Toast.makeText(getApplicationContext(), "Error: " + decryptedResponse.getJSONObject("data").getString("message"), Toast.LENGTH_SHORT).show();
//                                return;
//                                // This is buggy. Need to call Login activity again if incorrect credentials are given
//                            }

                            JSONArray jsonArray = response.getJSONArray("posts");

                            for(int i = 0; i<jsonArray.length(); i++){
                                JSONObject qnalistobject = jsonArray.getJSONObject(i);
                                QnAlistRecords qrecorder = new QnAlistRecords();
                                String subject = qnalistobject.getString("subject");
                                String writer = qnalistobject.getString("writer");
                                String date = qnalistobject.getString("date");
                                String id = qnalistobject.getString("id");

                                qrecorder.setSubject(subject);
                                qrecorder.setWriter(writer);
                                qrecorder.setDate(date);
                                qrecorder.setId(id);

                                qrecords.add(qrecorder);
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
                        qadapter = new Qadapter(getApplicationContext(), qrecords);
                        recyclerView.setAdapter(qadapter);

                        Integer count = qadapter.getItemCount();
                        if(count==0){
                            recyclerView.setVisibility(View.GONE);
                            emptyView.setVisibility(View.VISIBLE);
                        }
                        else {
                            recyclerView.setVisibility(View.VISIBLE);
                            emptyView.setVisibility(View.GONE);
                        }
                        qadapter.setOnItemClickListener(QnAlist.this);

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "Something went wrong", Toast.LENGTH_SHORT).show();
            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                SharedPreferences sharedPreferences = getSharedPreferences("jwt", Context.MODE_PRIVATE);
                final String retrivedToken  = sharedPreferences.getString("accesstoken",null);
                HashMap headers=new HashMap();
                headers.put("Authorization","Bearer "+retrivedToken);
                return headers;
            }
        };

        queue.add(jsonArrayRequest);
        queue.getCache().clear();
    }


    @Override
    public void onItemClick(int position) {

    }
}
