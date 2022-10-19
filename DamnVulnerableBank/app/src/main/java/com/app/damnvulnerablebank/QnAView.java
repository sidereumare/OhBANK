package com.app.damnvulnerablebank;

import static android.os.Environment.DIRECTORY_DOWNLOADS;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.app.DownloadManager;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Debug;
import android.os.Environment;
import android.os.StrictMode;
import android.provider.MediaStore;
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
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
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
        ArrayList<FileInfo> file_list = new ArrayList<>();
        for(int i = 0; i<fadapter.getItemCount(); i++){
            file_list.add(fadapter.getItem(i));
        }
        intent.putExtra("file_id_list", file_list);
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
        downLoadFile(clickedItem.getFileName());
    }

    public void downLoadFile(String fileName){
        //download file
        String endpoint="/api/qna/filedown";
        String finalurl = url+endpoint;

        DownloadManager downloadManager = (DownloadManager)getSystemService(Context.DOWNLOAD_SERVICE);


        // Encrypt the data before sending
        finalurl+="?filename=upload/"+fileName;

        File file = new File(Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS), fileName);

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(finalurl));

        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setDestinationUri(Uri.fromFile(file));

        downloadManager.enqueue(request);




//
//        InputStreamVolleyRequest inputStreamVolleyRequest = new InputStreamVolleyRequest(Request.Method.GET, finalurl,
//                new Response.Listener<byte[]>() {
//                    @Override
//                    public void onResponse(byte[] response) {
//
//                        if(Build.VERSION.SDK_INT >= 29) {
//                            String fileName = InputStreamVolleyRequest.responseHeaders.get("Content-Disposition").split("filename=")[1]; //저장 이름
//                            fileName = fileName.substring(1, fileName.length()-1);
//                            String subDirectory = "myAppSubDirectory"; // Downloads/ {subDirectory}
//                            String mimeType = URLConnection.guessContentTypeFromName(fileName); //mimeType
//
//                            ContentValues values = new ContentValues();
//                            values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
//                            values.put(MediaStore.Downloads.IS_PENDING, 0);
//
//                            if(subDirectory != null) {
//                                values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + File.separator + subDirectory);
//                            }
//
//                            ContentResolver database = getBaseContext().getContentResolver();
//                            Uri uri = database.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
//
//                            try{
//
//                                OutputStream outputStream = getBaseContext().getContentResolver().openOutputStream(uri);
//
//                                byte[] data = new byte[1024];
//                                InputStream input = new ByteArrayInputStream(response);
//                                long count;
//
//                                while((count = input.read(data))!=-1){
//                                    outputStream.write(data, 0, (int) count);
//                                }
//
//                                outputStream.close();
//
//                            }catch(Exception e) {
//                                e.printStackTrace();
//                            }
//
//                            values.clear();
//                            values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
//                            values.put(MediaStore.Downloads.IS_PENDING, 0);
//
//                            database.update(uri, values, null, null);
//
//
//                            // 권한 설정
//                            StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
//                            StrictMode.setVmPolicy(builder.build());
//                            // 외부 앱으로 파일 열기
//                            Intent intent = new Intent(Intent.ACTION_VIEW);
//                            // 파일 타입 추론
//                            String mimeType2 = URLConnection.guessContentTypeFromName(fileName);
//                            // 외부 앱 실행
//                            intent.setDataAndType(uri, mimeType2);
//                            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//                            intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
//                            startActivity(intent);
//                        }
//                        else {
//                            String fileName = InputStreamVolleyRequest.responseHeaders.get("Content-Disposition").split("filename=")[1];
//                            fileName = fileName.substring(1, fileName.length()-1);
//                            File file = null;
//                            StringBuilder fileEncData = new StringBuilder();
//                            try{
//                                // 파일 있으면 다른 이름으로 저장
//                                file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fileName);
//                                if(file.exists()){
//                                    int i = 1;
//                                    while(file.exists()){
//                                        file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "("+i+")"+fileName);
//                                        i++;
//                                    }
//                                }
//
//                                BufferedOutputStream output = new BufferedOutputStream(new FileOutputStream(file));
//
//                                long lengthOfFile = response.length;
//
//                                byte[] data = new byte[1024];
//                                InputStream input = new ByteArrayInputStream(response);
//                                long total = 0, count;
//                                while((count = input.read(data))!=-1){
//                                    total+=count;
////                                fileEncData.append(new String(Arrays.copyOfRange(data, 0, (int) count)));
//                                    output.write(data, 0, (int) count);
//                                }
//                                output.flush();
//                                output.close();
//                                input.close();
//
//                            } catch (IOException e) {
//                                e.printStackTrace();
//                            }
//
//                            // 권한 설정
//                            StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
//                            StrictMode.setVmPolicy(builder.build());
//                            // 외부 앱으로 파일 열기
//                            Intent intent = new Intent(Intent.ACTION_VIEW);
//                            // 파일 타입 추론
//                            String mimeType = URLConnection.guessContentTypeFromName(file.getName());
//                            // 외부 앱 실행
//                            intent.setDataAndType(Uri.fromFile(file), mimeType);
//                            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//                            intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
//                            startActivity(intent);
//                        }
//
//                    }
//                }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                // error
//                Log.e("Error.Response", error.toString());
//            }
//        }, null) {
//            @Override
//            public Map getHeaders() throws AuthFailureError {
//                HashMap headers=new HashMap();
//                headers.put("Authorization","Bearer "+retrivedToken);
//                return headers;
//            }
//        };
//
//        requestQueue.add(inputStreamVolleyRequest);
//
    }
}