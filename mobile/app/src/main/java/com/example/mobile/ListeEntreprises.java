package com.example.mobile;

import static android.view.Gravity.CENTER;
import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.mobile.entities.Entreprise;
import com.example.mobile.entities.Response;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

public class ListeEntreprises extends AppCompatActivity {
    Context ctx = this;
    String idCareerDay, idrolevalue;
    private LinearLayout container;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_liste_entreprises);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idCareerDay = extras.getString("idCareerDaykey");
        }
        container = findViewById(R.id.container_entreprises);
        new ListeEntreprises.AsyncTaskRequest(this, container).execute("http://192.99.108.205:5000/enterprises/attendance/" + idCareerDay);
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("Error", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }

    private class AsyncTaskRequest extends AsyncTask<String, Nullable, String> {
        Context ctx;
        LinearLayout container;

        public AsyncTaskRequest(Context ctx, LinearLayout container) {
            this.ctx = ctx;
            this.container = container;
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
            Log.d("debugApp", "response " + s);
            Response response = new Gson().fromJson(s, Response.class);
            //Log.d("debugApp","response "+response.getDatalist());
            ArrayList<Entreprise> entreprises = new ArrayList<>();
            Gson json = new Gson();
            for (Object o : response.getDatalist()) {
                //Log.d("debugApp","response "+o);
                //users.add(o);
                String test = json.toJson(o);
                //Log.d("debug", "onPostExecute: "+ test);
                Entreprise e = json.fromJson(test, Entreprise.class);
                //Log.d("debug", "onPostExecute: " + u.getName());
                entreprises.add(e);
            }
            boolean colorNumb = true;
            for (Entreprise ent : entreprises) {
                //ent.getName()
                TextView tv = new TextView(ctx);
                LinearLayout.LayoutParams tv_params = new LinearLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT);
                tv.setGravity(Gravity.CENTER | CENTER);
                tv_params.rightMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 100, getResources().getDisplayMetrics());
                tv.setLayoutParams(tv_params);
                tv.setTextAlignment(CENTER);
                tv.setText(ent.getName());
                tv.setTextColor(Color.parseColor("#F3EEEE"));
                tv.setTextSize((50 / getApplicationContext().getResources().getDisplayMetrics().scaledDensity));
                ImageView img = new ImageView(ctx);
                if (ent.getLogo_url() != null) {
                    if (ent.getLogo_url().equals("null")) {
                        try {
                            // get input stream
                            String path = "logo_entreprise.png";
                            InputStream ims = getAssets().open(path);
                            // load image as Drawable
                            Drawable d = Drawable.createFromStream(ims, null);
                            // set image to ImageView
                            img.setImageDrawable(d);
                        } catch (IOException ex) {
                            return;
                        }
                    } else {
                        new DownloadImageTask(img)
                            .execute("https://projetfinalheroku.s3.us-east-2.amazonaws.com/" + ent.getLogo_url());
                    }
                } else {
                    // load image
                    try {
                        // get input stream
                        String path = "logo_entreprise.png";
                        InputStream ims = getAssets().open(path);
                        // load image as Drawable
                        Drawable d = Drawable.createFromStream(ims, null);
                        // set image to ImageView
                        img.setImageDrawable(d);
                    } catch (IOException ex) {
                        return;
                    }
                }
                LinearLayout ll_entreprise = new LinearLayout(ctx);
                ll_entreprise.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout ll_partition = new LinearLayout(ctx);
                ll_partition.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout ll_ib_partition = new LinearLayout(ctx);
                ll_partition.setOrientation(LinearLayout.HORIZONTAL);
                //int width = 400;
                int height = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 120, getResources().getDisplayMetrics());
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(MATCH_PARENT, height);
                LinearLayout.LayoutParams part_params = new LinearLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT, 8);
                part_params.leftMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 15, getResources().getDisplayMetrics());
                LinearLayout.LayoutParams img_params = new LinearLayout.LayoutParams(260, 260, 1);
                LinearLayout.LayoutParams ib_params = new LinearLayout.LayoutParams(195, 195, 1);
                //params.topMargin=(int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,5, getResources().getDisplayMetrics());
                //params.
                img_params.topMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, getResources().getDisplayMetrics());
                img_params.leftMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 3, getResources().getDisplayMetrics());
                ImageButton btn_detail = new ImageButton(ctx);
                btn_detail.setImageResource(R.drawable.btn_info);
                //ib_params.leftMargin=(int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,140, getResources().getDisplayMetrics());
                btn_detail.setLayoutParams(img_params);
                btn_detail.setBackgroundColor(Color.TRANSPARENT);
                btn_detail.setTag("i");
                //btn_detail.setId("i");
                btn_detail.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String identreprisevalue = String.valueOf(ent.getId());
                        String urlvalue = String.valueOf(ent.getLogo_url());
                        Intent intent = new Intent(ctx, DetailEntreprise.class);
                        intent.putExtra("identreprisekey", identreprisevalue);
                        intent.putExtra("urlkey", urlvalue);
                        startActivity(intent);
                    }
                });
                ll_entreprise.setLayoutParams(params);
                img.setLayoutParams(img_params);
                ll_partition.setLayoutParams(part_params);
                ll_ib_partition.setLayoutParams(ib_params);
                ll_entreprise.setPadding(5, 5, 5, 5);
                if (colorNumb) {
                    ll_entreprise.setBackgroundColor(Color.parseColor("#000000"));
                } else {
                    ll_entreprise.setBackgroundColor(Color.parseColor("#333333"));
                }
                colorNumb = !colorNumb;
                ll_entreprise.addView(img);
                ll_partition.addView(tv);
                ll_ib_partition.addView(btn_detail);
                ll_entreprise.addView(ll_partition);
                ll_entreprise.addView(ll_ib_partition);
                container.addView(ll_entreprise);
            }
        }
    }
}