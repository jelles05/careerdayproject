package com.example.mobile.utilities;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.example.mobile.entities.Meeting;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class AsyncTaskRequestUpdate extends AsyncTask<String, Nullable, String> {
    private static final String TAG = "debug";
    String response = null;
    Spinner selectedMeetingType;
    EditText virtualMeeting;
    Spinner heureMeeting;
    Meeting meeting;

    public AsyncTaskRequestUpdate(Meeting meeting, Spinner plageHoraireDisponibleDropDown, EditText virtualMeeting, Spinner hoursMeeting) {
        this.selectedMeetingType = plageHoraireDisponibleDropDown;
        this.virtualMeeting = virtualMeeting;
        this.heureMeeting = hoursMeeting;
        this.meeting = meeting;
    }

    @Override
    protected String doInBackground(String... strings) {
        Log.d(TAG, "Doinbackgorund ASYNCUPDATE: Spinner seledted value send = " + heureMeeting.getSelectedItemPosition());
        TextView tv = (TextView) heureMeeting.getSelectedView();

        HttpURLConnection connection = null;
        try {
            URL url = new URL(strings[0]);
            Log.d(TAG, "doInBackground: " + strings[0]);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("PUT");
            connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            connection.setRequestProperty("Accept", "application/json");
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setChunkedStreamingMode(0);
            String jsonString = "{" +
                "\"id_employee\": \"" + meeting.getId_employee() + "\"," +
                "\"id_student\": \"" + meeting.getId_student() + "\"," +
                "\"virtual_meeting_url\": \"" + virtualMeeting.getText().toString() + "\"," +
                "\"id_meeting_type\": \"" + selectedMeetingType.getSelectedItemPosition() + "\"," +
                "\"id_career_day\": \"" + meeting.getId_career_day() + "\"," +
                "\"date_time\": \"" + tv.getText() + "\"" +
                "}";

            Log.d(TAG, "doInBackground: JSON FORMAT : " + jsonString);
            DataOutputStream output = new DataOutputStream(connection.getOutputStream());
            output.writeBytes(jsonString);
            output.flush();
            output.close();
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                InputStream inputStream = connection.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                response = reader.readLine();
            } else {
                Log.d(TAG, "doInBackground: HTTP CONNECION ERROR" + responseCode);
                response = null;
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            connection.disconnect();
        }
        return response;
    }
}