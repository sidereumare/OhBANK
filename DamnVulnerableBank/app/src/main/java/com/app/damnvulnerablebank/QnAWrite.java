package com.app.damnvulnerablebank;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import androidx.loader.content.CursorLoader;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.app.DownloadManager;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
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
import android.webkit.MimeTypeMap;
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

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;


public class QnAWrite extends AppCompatActivity implements FileAdapter.OnItemClickListener{
    RecyclerView recyclerView;
    FileAdapter fadapter;
    String url;
    String retrivedToken;
    String subject;
    String contents;
    RequestQueue requestQueue;
    String qnaID="-1";
    TextView title;
    TextView content;
    Button writeBtn;
    ArrayList<FileInfo> fileInfoArray;
    boolean rewrite;
    Intent intent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qna_write);

        title = findViewById(R.id.edt);
        content = findViewById(R.id.content_write);

        intent = getIntent();

        subject = intent.getStringExtra("title");
        contents = intent.getStringExtra("content");
        rewrite = intent.getBooleanExtra("rewrite",false);
        fileInfoArray = (ArrayList<FileInfo>) intent.getSerializableExtra("file_id_list");
        title.setText(subject);
        content.setText(contents);

        writeBtn = findViewById(R.id.writeBtn);
        if(rewrite){
            writeBtn.setText("수정");
        }

        recyclerView = findViewById(R.id.files_write);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        if(fileInfoArray==null){
            fileInfoArray = new ArrayList<FileInfo>();
        }
        fadapter = new FileAdapter(getApplicationContext(), fileInfoArray);
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

                    if(rewrite){
                        finish();
                        writeComplete();
                        Toast.makeText(getApplicationContext(), "QnA 게시글이 수정되었습니다.", Toast.LENGTH_SHORT).show();
                    }
                    else{
                        qnaID = decryptedResponse.getString("data");
                        finish();
                        writeComplete();
                        Toast.makeText(getApplicationContext(), "QnA 게시글이 작성되었습니다.", Toast.LENGTH_SHORT).show();
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(getApplicationContext(), "QnA 게시글 작성 리턴 값 미 일치", Toast.LENGTH_SHORT).show();
                    finish();
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

    public void selectFile(View view){

        // 파일 선택
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        try {
            startActivityForResult(
                    Intent.createChooser(intent, "파일을 선택하세요."),
                    0);
        } catch (android.content.ActivityNotFoundException ex) {
            Toast.makeText(getApplicationContext(), "파일 관련 앱이 없습니다.", Toast.LENGTH_SHORT).show();
        }
    }

    public void uploadFile(Uri uri){
        // 파일 업로드
        String endpoint = url + "/api/qna/fileup";


        final String fileName = "123.txt";
        String mimeType = "text/plain";
        String d = "dfjaisladf";
        byte[] file = d.getBytes();

        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", fileName, RequestBody.create(MediaType.parse(mimeType), file))
                .build();
        okhttp3.Request request = new okhttp3.Request.Builder()
                .url(endpoint)
                .addHeader("Authorization", "Bearer "+retrivedToken)
                .post(requestBody)
                .build();
        OkHttpClient client = new OkHttpClient();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, okhttp3.Response response) throws IOException {
                if(response.isSuccessful()){

                    try {
                        JSONObject myResponse = new JSONObject(response.body().string());
                        JSONObject decryptedResponse = new JSONObject(EncryptDecrypt.decrypt(myResponse.get("enc_data").toString()));
                        JSONObject fileResponse = new JSONObject(decryptedResponse.getString("data"));
                        fileInfoArray.add(new FileInfo(fileName, fileResponse.getString("id")));
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                fadapter.notifyDataSetChanged();
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });


    }

    private String getRealPathFromURI(Uri uri) {
        String[] proj = { MediaStore.Images.Media.DATA };
        CursorLoader loader = new CursorLoader(getApplicationContext(), uri, proj, null, null, null);
        Cursor cursor = loader.loadInBackground();
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        return cursor.getString(column_index);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==0 && resultCode==RESULT_OK){
            Toast.makeText(QnAWrite.this, "파일 선택 성공", Toast.LENGTH_SHORT).show();

            Uri uri = data.getData();
            uploadFile(uri);

        }else {
            Toast.makeText(QnAWrite.this, "파일 선택 실패", Toast.LENGTH_SHORT).show();
        }
    }

}
