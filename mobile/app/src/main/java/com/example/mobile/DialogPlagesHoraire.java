package com.example.mobile;
import static android.view.Gravity.CENTER;
import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.AlarmManagerCompat;
import androidx.core.app.NotificationChannelCompat;
import androidx.core.app.NotificationManagerCompat;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.textclassifier.ConversationActions;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.mobile.entities.Career;
import com.example.mobile.entities.Meeting;
import com.example.mobile.entities.Program;
import com.example.mobile.entities.Response;
import com.example.mobile.entities.ResponseAttendance;
import com.example.mobile.entities.Student;
import com.example.mobile.entities.TimeSlot;
import com.example.mobile.entities.User;
import com.example.mobile.managers.AsyncTaskManager;
import com.example.mobile.managers.FetchManager;
import com.example.mobile.utilities.AsyncTaskRequest;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.concurrent.ExecutionException;
public class DialogPlagesHoraire extends AppCompatActivity {
    private static String HTTP_REQUEST_TIME_SLOTS_USER = "http://192.99.108.205:5000/users/w/time-slots";
    private static String HTTP_REQUEST_TIME_SLOTS_MEETING = "http://192.99.108.205:5000/career_day/x/users/w/meetingsComplete";
    private static String HTTP_REQUEST_CANCEL_MEETING = "http://192.99.108.205:5000/meetings/w";
    private static String REPLACE_CHARACTER_INDICATOR = "w";
    private static String REPLACE_ID_CAREER_DAY_INDICATOR = "x";
    ArrayList<TimeSlot> timeSlots;
    ArrayList<Meeting> meetings;
    private static String data = null;
    private static String dataMeeting = null;

    String idUser;
    String idMeeting;
    String idrolevalue, idvalue, emailvalue, pwvalue, prenomvalue, nomvalue,idCareerDay;
    private LinearLayout container_plages_horaire;
    Context ctx = this;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dialog_plages_horaire);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idvalue = extras.getString("idkey");
            idUser = idvalue;
            emailvalue = extras.getString("emailkey");
            pwvalue = extras.getString("pwkey");
            nomvalue = extras.getString("nomkey");
            prenomvalue = extras.getString("prenomkey");
            idCareerDay=extras.getString("idCareerDaykey");
        }
        try {
            timeSlots = fetchTimeSlot(idUser);
            meetings = fetchTimeSlotMeeting(idUser,idCareerDay);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
        Response response = new Gson().fromJson(data, Response.class);
        Response responseMeeting = new Gson().fromJson(dataMeeting, Response.class);
        Gson json = new Gson();
        Gson jsonMeet = new Gson();

        for (Object o : response.getDatalist()) {
            String test = json.toJson(o);
            TimeSlot t = json.fromJson(test, TimeSlot.class);
            timeSlots.add(t);
        }
        Log.d("debug", "onCreate: response meeting is valide ? status code: " + responseMeeting.getStatusCode());
        if(responseMeeting.getDatalist() != null){
            for (Object o : responseMeeting.getDatalist()) {
                String test = jsonMeet.toJson(o);
                Meeting m = jsonMeet.fromJson(test, Meeting.class);
                meetings.add(m);
            }
        }

        new DialogPlagesHoraire.AsyncTaskRequest(this, timeSlots ,meetings).execute("http://192.99.108.205:5000/career_day/is_active");
    }

    //pour forcer le retour au dashboard quand on click sur le go back button de android
    @Override
    public void onBackPressed() {
        Intent intent = new Intent(ctx, Dashboard.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("prenomkey", prenomvalue);
        intent.putExtra("nomkey", nomvalue);
        intent.putExtra("emailkey", emailvalue);
        intent.putExtra("pwkey", pwvalue);
        intent.putExtra("idrolekey", idrolevalue);
        intent.putExtra("idkey", idvalue);
        intent.putExtra("idCareerDaykey", idCareerDay);
        startActivity(intent);
    }
    private void createNotificationChannel(){
        if (Build.VERSION.SDK_INT >=Build.VERSION_CODES.O){
            CharSequence name="CareerDayReminderChannel";
            String description="channel for career day";
            int importance= NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel=new NotificationChannel("notify",name,importance);
            channel.setDescription(description);

            NotificationManager notificationManager=getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public static ArrayList<Meeting> fetchTimeSlotMeeting(String idUser,String idCareerDay ) throws ExecutionException, InterruptedException {

        String temp = HTTP_REQUEST_TIME_SLOTS_MEETING.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        String request = temp.replace(REPLACE_ID_CAREER_DAY_INDICATOR, idCareerDay);
        Log.d("debugApp","request "+request);
        com.example.mobile.utilities.AsyncTaskRequest asyncTask = new com.example.mobile.utilities.AsyncTaskRequest(DialogPlagesHoraire.class);
        dataMeeting = asyncTask.execute(request).get();
        return AsyncTaskManager.dataConversion(dataMeeting, Meeting.class);
    }
    public static ArrayList<TimeSlot> fetchTimeSlot(String idUser) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_TIME_SLOTS_USER.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        Log.d("debug", "fetchTimeSlot: " + request);
        com.example.mobile.utilities.AsyncTaskRequest asyncTask = new com.example.mobile.utilities.AsyncTaskRequest(DialogPlagesHoraire.class);
        data = asyncTask.execute(request).get();
        return AsyncTaskManager.dataConversion(data, TimeSlot.class);
    }
    public static void fetchMeetingCancel(String idMeeting) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_CANCEL_MEETING.replace(REPLACE_CHARACTER_INDICATOR, idMeeting);
        com.example.mobile.utilities.AsyncTaskRequestPlus asyncTask = new com.example.mobile.utilities.AsyncTaskRequestPlus(DialogPlagesHoraire.class);
        asyncTask.execute(request);

    }
    private class AsyncTaskRequest extends AsyncTask<String, Nullable, String> {
        Context ctx;
        ArrayList<TimeSlot> timeSlots;
        ArrayList<Meeting> meetings;
        public AsyncTaskRequest(Context ctx, ArrayList<TimeSlot> timeSlots, ArrayList<Meeting> meetings) {
            this.ctx = ctx;
            this.timeSlots = timeSlots;
            this.meetings=meetings;
        }
        @Override
        protected String doInBackground(String... strings) {
            String response = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(strings[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.connect();
                InputStream inputStream = connection.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                response = reader.readLine();
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                connection.disconnect();
            }
            return response;
        }
        @SuppressLint("ResourceType")
        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            int maxTime;
            int duration;
            int maxMin = 60;
            int startHr;
            Response response = new Gson().fromJson(s, Response.class);
            //Log.d("debugApp","response "+response.getDatalist());
            //ArrayList<Career> careers =new ArrayList<>();
            Gson json = new Gson();
            for (Object o : response.getDatalist()) {
                //Log.d("debugApp","response career "+o);
                String test = json.toJson(o);
                Career career = json.fromJson(test, Career.class);
                maxTime = (career.getTime_end() - career.getTime_start()) * 60;
                duration = career.getMeeting_duration();
                startHr = career.getTime_start();
                container_plages_horaire = findViewById(R.id.container_plages_horaire);
                container_plages_horaire.removeAllViews();



                int j = 0;
                int k = 0;
                String time;
                LinearLayout ll_range = new LinearLayout(ctx);
                ll_range.setOrientation(LinearLayout.HORIZONTAL);
                for (int i = 0; i <= (maxTime / duration); i++) {
                    //faire avec des linearlayout et 4 btn par ll
                    Button btn = new Button(ctx);
                    LinearLayout.LayoutParams btn_params = new LinearLayout.LayoutParams((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 87, getResources().getDisplayMetrics()), WRAP_CONTENT,1.0f);
                    btn_params.setMargins((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics()), (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics()), (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics()), (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics()));

                    //btn.setBackgroundColor(Color.parseColor("#4CAF50"));
                    if (j == 0) {
                        btn.setText(startHr + "h");
                        time = startHr + "h";
                    } else if (j == maxMin) {
                        j = 0;
                        startHr++;
                        btn.setText(startHr + "h");
                        time = startHr + "h";
                    } else {
                        btn.setText(startHr + "h" + j);
                        time = startHr + "h" + j;
                    }
                    j = j + duration;
                    btn.setBackgroundTintList(ctx.getResources().getColorStateList(R.color.button_color_green));
                    String timeTaken;
                    String timeMeeting;
                    for (TimeSlot t : timeSlots) {
//                        if (t.getTime_slot().length() == 2) {
//                            timeTaken = t.getTime_slot() + "00";
//                        } else {
//                            timeTaken = t.getTime_slot();
//                        }
                        timeTaken = t.getTime_slot();
                        if (timeTaken.equals(time)) {

                            btn.setBackgroundTintList(ctx.getResources().getColorStateList(R.color.button_color_red));
                        }

                    }
                    for (Meeting m : meetings) {
                        timeMeeting=m.getDate_time();

                        Calendar calendar=Calendar.getInstance();
                        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("HH");
                        SimpleDateFormat simpleDateFormat2=new SimpleDateFormat("mm");
                        String dateTimeH=simpleDateFormat.format(calendar.getTime());
                        String dateTimeM=simpleDateFormat2.format(calendar.getTime());

                        int hourMeeting=0;
                        int minMeeting=0;

                        if (Integer.valueOf(m.getDate_time().length())==5){
                            hourMeeting=Integer.valueOf(m.getDate_time().substring(0,2));
                            minMeeting=Integer.valueOf(m.getDate_time().substring(3,5));
                        }else if (Integer.valueOf(m.getDate_time().length())==4){
                            hourMeeting=Integer.valueOf(m.getDate_time().substring(0,1));
                            minMeeting=Integer.valueOf(m.getDate_time().substring(2,4));
                        }else if (Integer.valueOf(m.getDate_time().length())==3){
                            hourMeeting=Integer.valueOf(m.getDate_time().substring(0,2));
                            minMeeting=0;
                        }else if (Integer.valueOf(m.getDate_time().length())==2){
                            hourMeeting=Integer.valueOf(m.getDate_time().substring(0,1));
                            minMeeting=0;
                        }



                        int hourCurrent=Integer.valueOf(dateTimeH);
                        int minCurrent=Integer.valueOf(dateTimeM);

                        if (hourCurrent==hourMeeting){
//                            Toast.makeText(DialogPlagesHoraire.this, "rappel meeting setted!  !", Toast.LENGTH_LONG).show();
                            Intent intent=new Intent(DialogPlagesHoraire.this,ReminderBroadcast.class);
                            PendingIntent pendingIntent=PendingIntent.getBroadcast(DialogPlagesHoraire.this,0,intent,0);
                            AlarmManager alarmManager=(AlarmManager)getSystemService(ALARM_SERVICE);
                            long timeAtEvent=System.currentTimeMillis();
                            long tenSecondsInMillis=1000*10;
                            alarmManager.set(AlarmManager.RTC_WAKEUP,
                                timeAtEvent+tenSecondsInMillis,
                                pendingIntent);

                        }

                        if (time.equals(timeMeeting)){
                            btn.setBackgroundTintList(ctx.getResources().getColorStateList(R.color.button_color_blue));
                            btn.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    if (Integer.valueOf(idrolevalue) == 3) {
                                        idMeeting=String.valueOf(m.getId());
                                        new AlertDialog.Builder(ctx)
                                            .setTitle("Meeting")
                                            .setMessage(m.getStudent_name()+" avec "+m.getEmployee_name()+" de l'entreprise "+m.getEnterprise_name()+" a la salle "+m.getRoom())
                                            .setIcon(android.R.drawable.ic_dialog_info)
                                            .setNegativeButton("annuler meeting",(dialogInterface, i1) -> {




                                                Calendar calendar=Calendar.getInstance();
                                                SimpleDateFormat simpleDateFormat=new SimpleDateFormat("HH");
                                                SimpleDateFormat simpleDateFormat2=new SimpleDateFormat("mm");
                                                String dateTimeH=simpleDateFormat.format(calendar.getTime());
                                                String dateTimeM=simpleDateFormat2.format(calendar.getTime());

                                                int hourMeeting=0;
                                                int minMeeting=0;

                                                if (Integer.valueOf(m.getDate_time().length())==5){
                                                     hourMeeting=Integer.valueOf(m.getDate_time().substring(0,2));
                                                     minMeeting=Integer.valueOf(m.getDate_time().substring(3,5));
                                                }else if (Integer.valueOf(m.getDate_time().length())==4){
                                                    hourMeeting=Integer.valueOf(m.getDate_time().substring(0,1));
                                                    minMeeting=Integer.valueOf(m.getDate_time().substring(2,4));
                                                }else if (Integer.valueOf(m.getDate_time().length())==3){
                                                    hourMeeting=Integer.valueOf(m.getDate_time().substring(0,2));
                                                    minMeeting=0;
                                                }else if (Integer.valueOf(m.getDate_time().length())==2){
                                                    hourMeeting=Integer.valueOf(m.getDate_time().substring(0,1));
                                                    minMeeting=0;
                                                }



                                                int hourCurrent=Integer.valueOf(dateTimeH);
                                                int minCurrent=Integer.valueOf(dateTimeM);


                                                if (hourCurrent>hourMeeting){
                                                    Log.d("debugApp", dateTimeH);
                                                    Toast.makeText(DialogPlagesHoraire.this, "impossible d'annuler un meeting passé  !", Toast.LENGTH_LONG).show();
                                                }else if (hourCurrent==hourMeeting && minCurrent>minMeeting){
                                                    Toast.makeText(DialogPlagesHoraire.this, "impossible d'annuler un meeting passé  !", Toast.LENGTH_LONG).show();
                                                }else{
                                                try {
                                                    fetchMeetingCancel(idMeeting);
                                                    Log.d("debugApp", idMeeting);
                                                } catch (ExecutionException e) {
                                                    e.printStackTrace();
                                                } catch (InterruptedException e) {
                                                    e.printStackTrace();
                                                }

                                                    Toast.makeText(DialogPlagesHoraire.this, "meeting annulé !", Toast.LENGTH_LONG).show();

                                                    Intent intent = new Intent(ctx, Profile.class);
                                                    intent.putExtra("idkey", idvalue);
                                                    intent.putExtra("idrolekey", idrolevalue);
                                                    intent.putExtra("emailkey", emailvalue);
                                                    intent.putExtra("pwkey", pwvalue);
                                                    intent.putExtra("nomkey", nomvalue);
                                                    intent.putExtra("prenomkey", prenomvalue);
                                                    intent.putExtra("idCareerDaykey", idCareerDay);
                                                    startActivity(intent);
                                                }
                                            })
                                            .show();
                                    }else{
                                        new AlertDialog.Builder(ctx)
                                            .setTitle("Meeting")
                                            .setMessage(m.getStudent_name()+" avec "+m.getEmployee_name()+" de l'entreprise "+m.getEnterprise_name()+" a la salle "+m.getRoom())
                                            .setIcon(android.R.drawable.ic_dialog_info)

                                            .show(); }

                                }
                            });

                        }

                    }
                    btn.setLayoutParams(btn_params);

                    ll_range.addView(btn);
                    k++;

                    if (k == 4) {

                        container_plages_horaire.addView(ll_range);
                        ll_range = new LinearLayout(ctx);
                        ll_range.setOrientation(LinearLayout.HORIZONTAL);
                        k = 0;
                    }
                    if ( i == (maxTime / duration)) {
                        //btn.setVisibility(View.INVISIBLE);
                        btn.setClickable(false);
                        btn.setBackgroundTintList(ctx.getResources().getColorStateList(R.color.button_color_inactive));
                        container_plages_horaire.addView(ll_range);
                        ll_range = new LinearLayout(ctx);
                        ll_range.setOrientation(LinearLayout.HORIZONTAL);
                        k = 0;
                    }
                }
            }
        }
    }
}