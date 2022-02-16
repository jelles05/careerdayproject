package com.example.mobile;
import static android.view.Gravity.CENTER;
import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.widget.GridLayout.HORIZONTAL;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.mobile.entities.Notification;
import com.example.mobile.entities.ResponseNotification;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
public class Notifications extends AppCompatActivity {
    String idrolevalue, idvalue, idCareerDay;
    Context ctx = this;
    private LinearLayout container;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification);
        container = findViewById(R.id.container_notifications);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idvalue = extras.getString("idkey");
            idCareerDay=extras.getString("idCareerDaykey");
        }
        new Notifications.AsyncTaskRequest(this,container).execute("http://192.99.108.205:5000/notifications");
    }
    private class AsyncTaskRequest extends AsyncTask<String, Nullable, String> {
        Context ctx;
        LinearLayout container;

        public AsyncTaskRequest(Context ctx,LinearLayout container) {
            this.ctx = ctx;
            this.container=container;
        }

        @Override
        protected String doInBackground(String... strings) {
            String response=null;
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
            //Log.d("debugApp","response "+s);
            ResponseNotification response = new Gson().fromJson(s, ResponseNotification.class);
            Log.d("debugAppnot","response "+response.getNotifications());
            ArrayList<Notification> notifications =new ArrayList<>();
            Gson json = new Gson();

            for (Object o : response.getNotifications())
            {

                String test = json.toJson(o);
                //Log.d("debug", "onPostExecute: "+ test);
                Notification notification = json.fromJson(test, Notification.class);
                //Log.d("debug", "onPostExecute: " + u.getName());
                if (notification.getId_user()==Integer.valueOf(idvalue)){
                    notifications.add(notification);
                }



            }
            if (!(notifications.isEmpty())){
                container.removeAllViews();
                for (Notification not  : notifications){




                    LinearLayout linearLayout_580 = new LinearLayout(ctx);
                    linearLayout_580.setBackgroundColor(Color.parseColor("#E6D4D4"));
                    //linearLayout_580.setBackgroundResource(Color.parseColor("#E6D4D4"));
                    linearLayout_580.setOrientation(LinearLayout.HORIZONTAL);
                    int height = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,120, getResources().getDisplayMetrics());
                    LinearLayout.LayoutParams layout_283 = new LinearLayout.LayoutParams(MATCH_PARENT, height);

                    layout_283.width = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_283.height = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_283.bottomMargin = 10;
                    layout_283.weight = 1;
                    linearLayout_580.setLayoutParams(layout_283);

                    ImageView imageView2 = new ImageView(ctx);
                    imageView2.setId(R.id.imageView2);
                    imageView2.setImageResource(R.drawable.ic_baseline_notifications_24);
                    LinearLayout.LayoutParams layout_433 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_433.width = 0;
                    layout_433.height = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_433.weight = 1;
                    imageView2.setLayoutParams(layout_433);
                    linearLayout_580.addView(imageView2);

                    LinearLayout linearLayout_504 = new LinearLayout(ctx);
                    linearLayout_504.setOrientation(LinearLayout.VERTICAL);
                    LinearLayout.LayoutParams layout_805 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_805.width = 0;
                    layout_805.height = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_805.weight = 3;
                    linearLayout_504.setLayoutParams(layout_805);

                    TextView tvNotificationType = new TextView(ctx);
                    tvNotificationType.setId(R.id.tvNotificationType);
                    tvNotificationType.setGravity(CENTER);
                    tvNotificationType.setPaddingRelative((int) (5/getApplicationContext().getResources().getDisplayMetrics().density),10,10,10);
                    tvNotificationType.setText(not.getTitle());
                    tvNotificationType.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_911 =new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_911.width = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_911.height = 0;
                    layout_911.weight = 1;
                    tvNotificationType.setLayoutParams(layout_911);
                    linearLayout_504.addView(tvNotificationType);

                    LinearLayout linearLayout_833 = new LinearLayout(ctx);
                    linearLayout_833.setOrientation(HORIZONTAL);
                    linearLayout_833.setPaddingRelative((int) (2/getApplicationContext().getResources().getDisplayMetrics().density),10,10,10);
                    LinearLayout.LayoutParams layout_160 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_160.width = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_160.height = 0;
                    layout_160.weight = 1;
                    linearLayout_833.setLayoutParams(layout_160);

                    TextView textView_978 = new TextView(ctx);
                    textView_978.setGravity(CENTER);
                    textView_978.setText("Entreprise:");
                    textView_978.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_564 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_564.width = 0;
                    layout_564.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_564.weight = 1;
                    textView_978.setLayoutParams(layout_564);
                    linearLayout_833.addView(textView_978);

                    TextView tvEnterprise = new TextView(ctx);
                    tvEnterprise.setId(R.id.tvEnterprise);
                    tvEnterprise.setGravity(CENTER);
                    tvEnterprise.setText(not.getEnterprise_name());
                    tvEnterprise.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_323 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_323.width = 0;
                    layout_323.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_323.weight = 2;
                    tvEnterprise.setLayoutParams(layout_323);
                    linearLayout_833.addView(tvEnterprise);
                    linearLayout_504.addView(linearLayout_833);

                    LinearLayout linearLayout_564 = new LinearLayout(ctx);
                    linearLayout_564.setOrientation(HORIZONTAL);
                    linearLayout_564.setPaddingRelative((int) (2/getApplicationContext().getResources().getDisplayMetrics().density),10,10,10);
                    LinearLayout.LayoutParams layout_670 =  new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_670.width = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_670.height = 0;
                    layout_670.weight = 1;
                    linearLayout_564.setLayoutParams(layout_670);

                    TextView textView_638 = new TextView(ctx);
                    textView_638.setGravity(CENTER);
                    textView_638.setText("Employé:");
                    textView_638.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_390 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_390.width = 0;
                    layout_390.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_390.weight = 1;
                    textView_638.setLayoutParams(layout_390);
                    linearLayout_564.addView(textView_638);

                    TextView tvEmployee = new TextView(ctx);
                    tvEmployee.setId(R.id.tvEmployee);
                    tvEmployee.setGravity(CENTER);
                    tvEmployee.setText(not.getEmployee_name());
                    tvEmployee.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_906 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_906.width = 0;
                    layout_906.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_906.weight = 2;
                    tvEmployee.setLayoutParams(layout_906);
                    linearLayout_564.addView(tvEmployee);
                    linearLayout_504.addView(linearLayout_564);

                    LinearLayout linearLayout_883 = new LinearLayout(ctx);
                    linearLayout_883.setOrientation(HORIZONTAL);
                    linearLayout_883.setPaddingRelative((int) (2/getApplicationContext().getResources().getDisplayMetrics().density),10,10,10);
                    LinearLayout.LayoutParams layout_118 =  new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_118.width = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_118.height = 0;
                    layout_118.weight = 1;
                    linearLayout_883.setLayoutParams(layout_118);

                    TextView textView_460 = new TextView(ctx);
                    textView_460.setGravity(CENTER);
                    textView_460.setText("Étudiant:");
                    textView_460.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_88 =  new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_88.width = 0;
                    layout_88.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_88.weight = 1;
                    textView_460.setLayoutParams(layout_88);
                    linearLayout_883.addView(textView_460);

                    TextView tvStudent = new TextView(ctx);
                    tvStudent.setId(R.id.tvStudent);
                    tvStudent.setGravity(CENTER);
                    tvStudent.setText(not.getStudent_name());
                    tvStudent.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_896 =new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_896.width = 0;
                    layout_896.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_896.weight = 2;
                    tvStudent.setLayoutParams(layout_896);
                    linearLayout_883.addView(tvStudent);
                    linearLayout_504.addView(linearLayout_883);

                    LinearLayout linearLayout_855 = new LinearLayout(ctx);
                    linearLayout_855.setOrientation(HORIZONTAL);
                    linearLayout_855.setPaddingRelative((int) (2/getApplicationContext().getResources().getDisplayMetrics().density),10,10,10);
                    LinearLayout.LayoutParams layout_759 =new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_759.width = LinearLayout.LayoutParams.MATCH_PARENT;
                    layout_759.height = 0;
                    layout_759.weight = 1;
                    linearLayout_855.setLayoutParams(layout_759);

                    TextView textView_688 = new TextView(ctx);
                    textView_688.setGravity(CENTER);
                    textView_688.setText("date");
                    textView_688.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_437 =new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_437.width = 0;
                    layout_437.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_437.weight = 1;
                    textView_688.setLayoutParams(layout_437);
                    linearLayout_855.addView(textView_688);

                    TextView tvDate = new TextView(ctx);
                    tvDate.setId(R.id.tvDate);
                    tvDate.setGravity(CENTER);
                    String date=not.getDate().substring(0,10)+" à "+not.getDate().substring(11,16);
                    tvDate.setText(date);
                    tvDate.setTextColor(Color.parseColor("#000000"));
                    LinearLayout.LayoutParams layout_374 = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                    layout_374.width = 0;
                    layout_374.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    layout_374.weight = 2;
                    tvDate.setLayoutParams(layout_374);
                    linearLayout_855.addView(tvDate);
                    linearLayout_504.addView(linearLayout_855);
                    linearLayout_580.addView(linearLayout_504);

                    container.addView(linearLayout_580);


                }
            }


        }
    }
}