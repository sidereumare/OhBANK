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

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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
            Log.i("response", requestData.toString());
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


        // Encrypt the data before sending
        String encryptedFileId = EncryptDecrypt.encrypt(FileID);
        finalurl+="?file_id="+encryptedFileId;

        InputStreamVolleyRequest inputStreamVolleyRequest = new InputStreamVolleyRequest(Request.Method.GET, finalurl,
                new Response.Listener<byte[]>() {
                    @Override
                    public void onResponse(byte[] response) {
                        // do something with response
                        // get filename from header fields
                        String fileName = InputStreamVolleyRequest.responseHeaders.get("Content-Disposition").split("filename=")[1];
                        fileName = fileName.substring(1, fileName.length()-1);
                        File file = null;
                        StringBuilder fileEncData = new StringBuilder();
                        try{
                            // 파일 있으면 다른 이름으로 저장
                            file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fileName);
                            if(file.exists()){
                                int i = 1;
                                while(file.exists()){
                                    file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "("+i+")"+fileName);
                                    i++;
                                }
                            }

                            BufferedOutputStream output = new BufferedOutputStream(new FileOutputStream(file));

                            long lengthOfFile = response.length;

                            byte[] data = new byte[1024];
                            InputStream input = new ByteArrayInputStream(response);
                            long total = 0, count;
                            while((count = input.read(data))!=-1){
                                total+=count;
//                                fileEncData.append(new String(Arrays.copyOfRange(data, 0, (int) count)));
                                output.write(data, 0, (int) count);
                            }
                            output.flush();
                            output.close();
                            input.close();

                        } catch (IOException e) {
                            e.printStackTrace();
                        }
//                        Log.i("response", fileEncData.toString());
//                        download file in android storage
//                        create a File object for the parent directory

//                        FileOutputStream fos = null;
//                        try {
//                            fos = new FileOutputStream(file);
//                            fos.write(Base64.decode(fileData.split(",")[1], Base64.DEFAULT));
//                            Log.i("response", EncryptDecrypt.decrypt(fileEncData.toString()));
//                            fos.write(fileEncData.toString().getBytes());
//                            fos.flush();
//                            fos.close();
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                        }
//                        Toast.makeText(getApplicationContext(), "File Downloaded", Toast.LENGTH_SHORT).show();

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
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // error
                Log.e("Error.Response", error.toString());
            }
        }, null) {
            @Override
            public Map getHeaders() throws AuthFailureError {
                HashMap headers=new HashMap();
                headers.put("Authorization","Bearer "+retrivedToken);
                return headers;
            }
        };
//         //download file json request
//         final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, finalurl, requestDataEncrypted,
//                 new Response.Listener<JSONObject>()  {
//                     @Override
//                     public void onResponse(JSONObject response) {
//                         try {
// //                            JSONObject decryptedResponse = new JSONObject(EncryptDecrypt.decrypt(response.get("enc_data").toString()));
//                             JSONObject decryptedResponse = new JSONObject(response.get("enc_data").toString());
//                             String fileName=decryptedResponse.getString("file_name");
//                             String fileData=decryptedResponse.getString("file_data");

//                             //download file in android storage
//                             // create a File object for the parent directory
//                             File file = new File(Environment.getExternalStorageDirectory() + "/Download", fileName);
//                             FileOutputStream fos = new FileOutputStream(file);
//                             fos.write(Base64.decode(fileData.split(",")[1], Base64.DEFAULT));
//                             fos.flush();
//                             fos.close();
//                             Toast.makeText(getApplicationContext(), "File Downloaded", Toast.LENGTH_SHORT).show();

//                             // 권한 설정
//                             StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
//                             StrictMode.setVmPolicy(builder.build());
//                             // 외부 앱으로 파일 열기
//                             Intent intent = new Intent(Intent.ACTION_VIEW);
//                             // 파일 타입 추론
//                             String mimeType = URLConnection.guessContentTypeFromName(file.getName());
//                             // 외부 앱 실행
//                             intent.setDataAndType(Uri.fromFile(file), mimeType);
//                             intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//                             intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
//                             startActivity(intent);

//                         } catch (JSONException | FileNotFoundException e) {
//                             e.printStackTrace();
//                         } catch (IOException e) {
//                             e.printStackTrace();
//                         }
//                     }
//                 }, new Response.ErrorListener() {
//             @Override
//             public void onErrorResponse(VolleyError error) {
//                 Toast.makeText(getApplicationContext(), "다운로드 에러", Toast.LENGTH_SHORT).show();
//             }
//         }) {
//             @Override
//             public Map getHeaders() throws AuthFailureError {
//                 HashMap headers=new HashMap();
//                 headers.put("Authorization","Bearer "+retrivedToken);
//                 return headers;
//             }
//         };
        

        requestQueue.add(inputStreamVolleyRequest);
        
    }
}