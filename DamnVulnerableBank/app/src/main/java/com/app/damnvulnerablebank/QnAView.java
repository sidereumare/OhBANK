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

public class QnAView extends AppCompatActivity implements FileAdapter.OnItemClickListener{
    FileAdapter fadapter;
    RecyclerView recyclerView;
    String url;
    String retrivedToken;
    String subject;
    String content;
    RequestQueue requestQueue;
    String qnaID;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qna_view);
        Intent intent = getIntent();

        qnaID = intent.getStringExtra("qna_id");

        SharedPreferences sharedPreferences = getSharedPreferences("jwt", Context.MODE_PRIVATE);
        retrivedToken = sharedPreferences.getString("accesstoken",null);

        sharedPreferences = getSharedPreferences("apiurl", Context.MODE_PRIVATE);
        url = sharedPreferences.getString("apiurl",null);
        String endpoint="/api/qna/view";
        String finalurl = url+endpoint;
        requestQueue = Volley.newRequestQueue(getApplicationContext());

        // view qna
        final TextView subjectView=findViewById(R.id.subject);
        final TextView contentView=findViewById(R.id.content);
        recyclerView = findViewById(R.id.files);

        // create request body
        JSONObject requestData = new JSONObject();
        JSONObject requestDataEncrypted = new JSONObject();
        try {
            requestData.put("qna_id", qnaID);

            // Encrypt the data before sending
            requestDataEncrypted.put("enc_data", EncryptDecrypt.encrypt(requestData.toString()));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // create request
        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, finalurl, requestDataEncrypted,
                new Response.Listener<JSONObject>()  {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONObject decryptedResponse = new JSONObject(EncryptDecrypt.decrypt(response.get("enc_data").toString()));
//                              JSONObject decryptedResponse = new JSONObject(response.get("enc_data").toString());

                            JSONObject data = decryptedResponse.getJSONObject("data");

                            subject=data.getString("title");
                            content=data.getString("content");
                            JSONArray file=data.getJSONArray("file");

                            // make fileinfo list
                            List<FileInfo> fileInfoes = new ArrayList<>();
                            for(int i=0; i<file.length(); i++){
                                FileInfo fileInfo = new FileInfo();
                                fileInfo.setFileName(file.getJSONObject(i).getString("file_name"));
                                fileInfo.setFileID(file.getJSONObject(i).getString("id"));
                                fileInfoes.add(fileInfo);
                            }

                            subjectView.setText(subject);
                            contentView.setText(content);
                            recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
                            fadapter = new FileAdapter(getApplicationContext(), fileInfoes);
                            fadapter.setOnItemClickListener(QnAView.this);
                            recyclerView.setAdapter(fadapter);

                            Integer count = fadapter.getItemCount();
                            if(count == 0){
                                recyclerView.setVisibility(View.GONE);
                            }else{
                                recyclerView.setVisibility(View.VISIBLE);
                            }
                            //add recyclerview texts
//                            files.setAdapter(new FileAdapter(getApplicationContext(), fileNames, fileIds, retrivedToken, url));
                            recyclerView.setHasFixedSize(true);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "Error: " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Override
            public Map getHeaders() throws AuthFailureError {
                HashMap headers=new HashMap();
                headers.put("Authorization","Bearer "+retrivedToken);
                return headers;
            }
        };
        requestQueue.add(jsonObjectRequest);

    }

    public void edit(View view){
        Intent intent = new Intent(getApplicationContext(), QnAWrite.class);
        intent.putExtra("title", subject);
        intent.putExtra("content", content);
        intent.putExtra("qna_id", qnaID);
        intent.putExtra("rewrite", true);
        startActivity(intent);
        finish();
    }

    public void delete(View view){
        String endPoint = "/api/qna/delete";
        String finalurl = url+endPoint;

        JSONObject requestData = new JSONObject();
        JSONObject requestDataEncrypted = new JSONObject();
        try {
            requestData.put("qna_id", qnaID);

            // Encrypt the data before sending
            requestDataEncrypted.put("enc_data", EncryptDecrypt.encrypt(requestData.toString()));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // create request
        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, finalurl, requestDataEncrypted,
                new Response.Listener<JSONObject>()  {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(getApplicationContext(), "QnA deleted successfully", Toast.LENGTH_SHORT).show();
                        finish();
                        startActivity(new Intent(getApplicationContext(), QnAlist.class));
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "Error: " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Override
            public Map getHeaders() throws AuthFailureError {
                HashMap headers=new HashMap();
                headers.put("Authorization","Bearer "+retrivedToken);
                return headers;
            }
        };

        requestQueue.add(jsonObjectRequest);
    }

    @Override
    public void onItemClick(int position) {
        //get item from adapter
        FileInfo clickedItem = fadapter.getItem(position);
        Log.i("itemesss", clickedItem.getFileID());
        downLoadFile(clickedItem.getFileID());
    }

    public void downLoadFile(String FileID){
        //download file
        String endpoint="/api/qna/filedown";
        String finalurl = url+endpoint;

        // create request body
        JSONObject requestData = new JSONObject();
        JSONObject requestDataEncrypted = new JSONObject();
        try {
            requestData.put("file_id", FileID);

            // Encrypt the data before sending
            requestDataEncrypted.put("enc_data", EncryptDecrypt.encrypt(requestData.toString()));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        //download file json request
        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, finalurl, requestDataEncrypted,
                new Response.Listener<JSONObject>()  {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
//                            JSONObject decryptedResponse = new JSONObject(EncryptDecrypt.decrypt(response.get("enc_data").toString()));
                            JSONObject decryptedResponse = new JSONObject(response.get("enc_data").toString());
                            String fileName=decryptedResponse.getString("file_name");
                            String fileData=decryptedResponse.getString("file_data");

                            //download file in android storage
                            // create a File object for the parent directory
                            File file = new File(Environment.getExternalStorageDirectory() + "/Download", fileName);
                            FileOutputStream fos = new FileOutputStream(file);
                            fos.write(Base64.decode(fileData.split(",")[1], Base64.DEFAULT));
                            fos.flush();
                            fos.close();
                            Toast.makeText(getApplicationContext(), "File Downloaded", Toast.LENGTH_SHORT).show();

                            // 권한 설정
                            StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
                            StrictMode.setVmPolicy(builder.build());
                            // 외부 앱으로 파일 열기
                            Intent intent = new Intent(Intent.ACTION_VIEW);
                            // 파일 타입 추론
                            String mimeType = URLConnection.guessContentTypeFromName(file.getName());
                            // 외부 앱 실행
                            intent.setDataAndType(Uri.fromFile(file), mimeType);
                            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                            intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                            startActivity(intent);

                        } catch (JSONException | FileNotFoundException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "다운로드 에러", Toast.LENGTH_SHORT).show();
            }
        }) {
            @Override
            public Map getHeaders() throws AuthFailureError {
                HashMap headers=new HashMap();
                headers.put("Authorization","Bearer "+retrivedToken);
                return headers;
            }
        };
        

        requestQueue.add(jsonObjectRequest);
        
    }
}