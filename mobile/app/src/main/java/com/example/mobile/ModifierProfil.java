package com.example.mobile;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.gridlayout.widget.GridLayout;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import com.example.mobile.Dashboard;
import com.example.mobile.R;
import com.example.mobile.entities.Response;
import com.example.mobile.entities.User;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
public class ModifierProfil extends AppCompatActivity {
    Context ctx = this;
    String idrolevalue, idvalue, emailvalue, pwvalue, prenomvalue, nomvalue,idCareerDay;
    EditText editNom, editPrenom, editEmail, editPassword;
    private ImageButton btnSignIn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_modifier_profil);
//PUT - http://192.99.108.205:5000/users/1 (in body: email/password/id_role/last_name/name)
        editNom = (EditText) findViewById(R.id.profil_nom);
        editPrenom = (EditText) findViewById(R.id.profil_prenom);
        editEmail = (EditText) findViewById(R.id.profil_email);
        editPassword = (EditText) findViewById(R.id.profil_password);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idvalue = extras.getString("idkey");
            emailvalue = extras.getString("emailkey");
            pwvalue = extras.getString("pwkey");
            nomvalue = extras.getString("nomkey");
            prenomvalue = extras.getString("prenomkey");
            idCareerDay=extras.getString("idCareerDaykey");
        }
        editNom.setText(nomvalue);
        editPrenom.setText(prenomvalue);
        editEmail.setText(emailvalue);
//        editPassword.setText(pwvalue);
        btnSignIn = findViewById(R.id.btn_save);
        btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new AsyncTaskRequest(ctx, btnSignIn).execute("http://192.99.108.205:5000/users/" + idvalue);
            }
        });
    }
    //pour forcer le retour au dashboard quand on click sur le go back button de android
    @Override
    public void onBackPressed() {
        Intent intent = new Intent(ctx, Dashboard.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("prenomkey",prenomvalue);
        intent.putExtra("nomkey",nomvalue);
        intent.putExtra("emailkey",emailvalue);
        intent.putExtra("pwkey",pwvalue);
        intent.putExtra("idrolekey",idrolevalue);
        intent.putExtra("idkey",idvalue);
        intent.putExtra("idCareerDaykey", idCareerDay);
        startActivity(intent);
    }
    private class AsyncTaskRequest extends AsyncTask<String, Nullable, String> {
        Context ctx;
        ImageButton btnSignIn;
        public AsyncTaskRequest(Context ctx, ImageButton btnSignIn) {
            this.ctx = ctx;
            this.btnSignIn = btnSignIn;
        }
        @Override
        protected String doInBackground(String... strings) {
            String response = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(strings[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("PUT");
                connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
                connection.setRequestProperty("Accept", "application/json");
                connection.setDoOutput(true);
                connection.setDoInput(true);
                String jsonString = "{\"email\": \"" + editEmail.getText().toString() + "\", \"password\": \"" + editPassword.getText().toString() + "\",\"id_role\": \"" + idrolevalue + "\",\"last_name\": \"" + editNom.getText().toString() + "\",\"name\": \"" + editPrenom.getText().toString() + "\"}";
                DataOutputStream output = new DataOutputStream(connection.getOutputStream());
                output.writeBytes(jsonString);
                output.flush();
                output.close();
                int responseCode = connection.getResponseCode();
                //Log.d("debugApp", "response code: " + responseCode);
                if (responseCode == 200) {
                    InputStream inputStream = connection.getInputStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                    response = reader.readLine();
                } else {
                    response = null;
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                connection.disconnect();
            }
            return response;
        }
        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            if (s != null) {
                Intent intent = new Intent(ctx, Profile.class);
                intent.putExtra("idkey", idvalue);
                intent.putExtra("idrolekey", idrolevalue);
                intent.putExtra("emailkey", emailvalue);
                intent.putExtra("pwkey", pwvalue);
                intent.putExtra("nomkey", nomvalue);
                intent.putExtra("prenomkey", prenomvalue);
                intent.putExtra("idCareerDaykey", idCareerDay);
                startActivity(intent);
            } else {
                Toast.makeText(ctx, "réessayez, s'il vous plaît", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(ctx, ModifierProfil.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        }
    }
}