package com.app.damnvulnerablebank;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Debug;
import android.os.Environment;
import android.os.StrictMode;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
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

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class QnAWrite extends AppCompatActivity implements FileAdapter.OnItemClickListener{
    RecyclerView recyclerView;
    FileAdapter fadapter;
    String url;
    String retrivedToken;
    String subject;
    String contents;
    RequestQueue requestQueue;
    String qnaID;
    TextView title;
    TextView content;
    Button writeBtn;
    boolean rewrite;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qna_write);

        title = findViewById(R.id.edt);
        content = findViewById(R.id.content_write);

        Intent intent = getIntent();

        subject = intent.getStringExtra("title");
        contents = intent.getStringExtra("content");
        rewrite = intent.getBooleanExtra("rewrite",false);

        title.setText(subject);
        content.setText(contents);

        writeBtn = findViewById(R.id.writeBtn);
        if(rewrite){
            writeBtn.setText("수정");
        }

        recyclerView = findViewById(R.id.files_write);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        fadapter = new FileAdapter(getApplicationContext(), new ArrayList<FileInfo>());
        fadapter.setOnItemClickListener(QnAWrite.this);
        recyclerView.setAdapter(fadapter);

        SharedPreferences sharedPreferences = getSharedPreferences("jwt", MODE_PRIVATE);
        retrivedToken = sharedPreferences.getString("accesstoken", null);
        
        sharedPreferences = getSharedPreferences("apiurl", MODE_PRIVATE);
        url = sharedPreferences.getString("apiurl", null);
//        url = "https://c0907315-9d56-485c-9837-59867dbd35f9.mock.pstmn.io";

        requestQueue = Volley.newRequestQueue(this);
    }

    public void writePost(View view) {
        String endpoint;
        JSONObject requestData;
        JSONObject requestDataEncrypted;
        if (rewrite) {
            endpoint = url + "/api/qna/rewrite";
            requestData = new JSONObject();
            requestDataEncrypted = new JSONObject();
            try {
                requestData.put("title", title.getText().toString());
                requestData.put("content", content.getText().toString());
                requestData.put("qna_id", qnaID);
                JSONArray file_ids = new JSONArray();
                for(int i = 0; i<fadapter.getItemCount(); i++){
                    file_ids.put(fadapter.getItem(i).getFileID());
                }
                requestData.put("file_id_list", file_ids);
                requestDataEncrypted.put("enc_data", EncryptDecrypt.encrypt(requestData.toString()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            endpoint = url + "/api/qna/write";
            requestData = new JSONObject();
            requestDataEncrypted = new JSONObject();
            try {
                requestData.put("title", title.getText().toString());
                requestData.put("content", content.getText().toString());
                JSONArray file_ids = new JSONArray();
                for(int i = 0; i<fadapter.getItemCount(); i++){
                    file_ids.put(fadapter.getItem(i).getFileID());
                }
                requestData.put("file_id_list", file_ids);
                requestDataEncrypted.put("enc_data", EncryptDecrypt.encrypt(requestData.toString()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, endpoint, requestDataEncrypted, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject decryptedResponse = new JSONObject(EncryptDecrypt.decrypt(response.get("enc_data").toString()));
                    Log.i("dec_data", decryptedResponse.toString());
                    qnaID = decryptedResponse.getString("data");
//                    if (fadapter.getItemCount() > 0) {
//                        // upload
//                    } else {
//                        Toast.makeText(getApplicationContext(), "QnA 게시글이 작성되었습니다.", Toast.LENGTH_SHORT).show();
//                        finish();
//                    }
                    // test
                    finish();
                    writeComplete();
                    Toast.makeText(getApplicationContext(), "QnA 게시글이 작성되었습니다.", Toast.LENGTH_SHORT).show();
                } catch (JSONException e) {
                    e.printStackTrace();
                    // test
                    Toast.makeText(getApplicationContext(), "QnA 게시글 작성에 실패1", Toast.LENGTH_SHORT).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "QnA 게시글 작성에 실패하였습니다.", Toast.LENGTH_SHORT).show();
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Authorization","Bearer "+retrivedToken);
                return params;
            }
        };

        requestQueue.add(jsonObjectRequest);
        requestQueue.getCache().clear();
    }
    @Override
    public void onItemClick(int position) {

    }

    void writeComplete(){
        Intent de = new Intent(this, QnAView.class);

        de.putExtra("qna_id", qnaID);
        startActivity(de);
    }
}
