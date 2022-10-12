package com.app.damnvulnerablebank;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Debug;
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

import java.util.HashMap;
import java.util.Map;

public class QnAView extends AppCompatActivity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qna_view);
        Intent intent = getIntent();

//        String qnaID = intent.getStringExtra("qna_id");
        String qnaID = "123456";

        SharedPreferences sharedPreferences = getSharedPreferences("jwt", Context.MODE_PRIVATE);
        final String retrivedToken  = sharedPreferences.getString("accesstoken",null);
        final RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        sharedPreferences = getSharedPreferences("apiurl", Context.MODE_PRIVATE);
        final String url  = "https://c0907315-9d56-485c-9837-59867dbd35f9.mock.pstmn.io";//sharedPreferences.getString("apiurl",null);
        String endpoint="/api/qna/view";
        String finalurl = url+endpoint;

        // view qna
        final TextView subjectView=findViewById(R.id.subject);
        final TextView contentView=findViewById(R.id.content);
//        final TextView dateView=findViewById(R.id.date);
//        final TextView writerView=findViewById(R.id.writer);
//        final TextView fileView=findViewById(R.id.file);
        final RecyclerView files = findViewById(R.id.files);

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

//                            JSONObject decryptedResponse = new JSONObject(EncryptDecrypt.decrypt(response.get("enc_data").toString()));
                              JSONObject decryptedResponse = new JSONObject(response.get("enc_data").toString());

//                            // Check for error message
//                            if(decryptedResponse.getJSONObject("status").getInt("code") != 200) {
//                                Toast.makeText(getApplicationContext(), "Error: " + decryptedResponse.getJSONObject("data").getString("message"), Toast.LENGTH_SHORT).show();
//                                return;
//                                // This is buggy. Need to call Login activity again if incorrect credentials are given
//                            }

                            String subject=decryptedResponse.getString("subject");
                            String content=decryptedResponse.getString("content");
                            String writer=decryptedResponse.getString("writer");
                            String date=decryptedResponse.getString("date");
                            JSONArray fileNames=decryptedResponse.getJSONArray("file_name");
                            JSONArray fileIds=decryptedResponse.getJSONArray("file_id");

                            subjectView.setText(subject);
                            contentView.setText(content);
                            
                            //add recyclerview texts
                            //files.setAdapter(new FileAdapter(getApplicationContext(), fileNames, fileIds, retrivedToken, url));
                            files.setHasFixedSize(true);

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
}