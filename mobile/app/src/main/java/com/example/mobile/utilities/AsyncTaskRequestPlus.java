package com.example.mobile.utilities;

import android.os.AsyncTask;
import android.util.Log;

import androidx.annotation.Nullable;

import com.example.mobile.entities.Meeting;
import com.example.mobile.entities.Response;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;

public class AsyncTaskRequestPlus extends AsyncTask<String, Nullable, String>{
    Type classType;
    String response = null;

    public AsyncTaskRequestPlus(Type classType) {
        this.classType = classType;
    }

    @Override
    protected String doInBackground(String... strings) {
        HttpURLConnection connection = null;
        try {
            URL url = new URL(strings[0]);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("X-HTTP-Method-Override", "DELETE");
            connection.setRequestMethod("DELETE");
            connection.connect();
            InputStream inputStream = connection.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            response = reader.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            connection.disconnect();
        }
        return response;
    }
}
