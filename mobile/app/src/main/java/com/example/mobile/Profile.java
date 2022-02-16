package com.example.mobile;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.mobile.entities.Response;
import com.example.mobile.entities.Student;
import com.example.mobile.entities.User;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class Profile extends AppCompatActivity {
    String idrolevalue, idvalue, idcriteria, emailvalue, pwvalue, prenomvalue, nomvalue, idCareerDay;
    Context ctx = this;

    private TextView tv_nom;
    private TextView tv_prenom;
    private TextView tv_email;
    private TextView tv_formation;
    private TextView tv_competence;
    private TextView tv_language;
    private TextView tv_province;
    private TextView tv_teletravail;
    private TextView tv_date_fin;
    private TextView tv_biographie;
    private ImageView profilPic;
    private ImageButton ib_update;
    private ImageButton ib_plage;
    private ImageButton ib_infos;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        tv_nom = findViewById(R.id.last_name);
        tv_prenom = findViewById(R.id.first_name);
        tv_email = findViewById(R.id.email);
        tv_formation = findViewById(R.id.ProfilFormation);
        tv_competence = findViewById(R.id.ProfilSkills);
        tv_language = findViewById(R.id.ProfilLanguage);
        tv_province = findViewById(R.id.ProfilProvince);
        tv_teletravail = findViewById(R.id.ProfilTeletravail);
        tv_date_fin = findViewById(R.id.ProfilDisponible);
        tv_biographie = findViewById(R.id.ProfilBiographie);
        profilPic = findViewById(R.id.profil_image);


        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idvalue = extras.getString("idkey");
            emailvalue = extras.getString("emailkey");
            pwvalue = extras.getString("pwkey");
            nomvalue = extras.getString("nomkey");
            prenomvalue = extras.getString("prenomkey");
            idCareerDay = extras.getString("idCareerDaykey");
            ib_update = findViewById(R.id.btn_update);
            ib_update.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ctx, ModifierProfil.class);
                    intent.putExtra("idkey", idvalue);
                    intent.putExtra("idrolekey", idrolevalue);
                    intent.putExtra("emailkey", emailvalue);
                    intent.putExtra("pwkey", pwvalue);
                    intent.putExtra("nomkey", nomvalue);
                    intent.putExtra("prenomkey", prenomvalue);
                    intent.putExtra("idCareerDaykey", idCareerDay);
                    startActivity(intent);
                }
            });

            ib_plage = findViewById(R.id.btn_plage_horaire);
            ib_infos = findViewById(R.id.btn_infos_profil);
            if (Integer.valueOf(idrolevalue) == 2) {
                ib_plage.setVisibility(View.VISIBLE);
                ib_infos.setVisibility(View.VISIBLE);
            }
            if (Integer.valueOf(idrolevalue) == 3) {
                ib_plage.setVisibility(View.VISIBLE);
            }


            ib_infos.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    Intent intent = new Intent(ctx, DialogInfosProfil.class);
                    intent.putExtra("prenomkey", prenomvalue);
                    intent.putExtra("nomkey", nomvalue);
                    intent.putExtra("emailkey", emailvalue);
                    intent.putExtra("pwkey", pwvalue);
                    intent.putExtra("idrolekey", idrolevalue);
                    intent.putExtra("idkey", idvalue);
                    startActivity(intent);

                }
            });


            ib_plage.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ctx, DialogPlagesHoraire.class);
                    intent.putExtra("prenomkey", prenomvalue);
                    intent.putExtra("nomkey", nomvalue);
                    intent.putExtra("emailkey", emailvalue);
                    intent.putExtra("pwkey", pwvalue);
                    intent.putExtra("idrolekey", idrolevalue);
                    intent.putExtra("idkey", idvalue);
                    intent.putExtra("idCareerDaykey", idCareerDay);
                    startActivity(intent);

                }
            });
        }
        if (Integer.valueOf(idrolevalue) == 2) {
            new Profile.AsyncTaskRequest(this).execute("http://192.99.108.205:5000/students/" + idvalue);
        } else {
            new Profile.AsyncTaskRequest(this).execute("http://192.99.108.205:5000/users/" + idvalue);
        }

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
        startActivity(intent);
    }

    private class AsyncTaskRequest extends AsyncTask<String, Nullable, String> {
        Context ctx;

        public AsyncTaskRequest(Context ctx) {
            this.ctx = ctx;
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
            //Log.d("debugApp","response "+s);
            Response response = new Gson().fromJson(s, Response.class);
            //Log.d("debugApp","response "+response.getDatalist());
//            ArrayList<User> users = new ArrayList<>();
            Gson json = new Gson();
            Log.d("debug", "onPostExecute: response code : " + response.getStatusCode());
            if (response.getStatusCode() == 200) {
                Log.d("debug", "onPostExecute: COUCOU");
                for (Object o : response.getDatalist()) {
                    String test = json.toJson(o);

                    if (Integer.valueOf(idrolevalue) == 2) {
                        Student etu = json.fromJson(test, Student.class);
                        tv_nom.setText(etu.getLast_name());
                        tv_prenom.setText(etu.getName());
                        tv_email.setText(etu.getEmail());
                        //Log.d("debugApp","response "+etu.getProfileImageUrl());


                        if (etu.getProfileImageUrl() != null) {
                            if (etu.getProfileImageUrl().equals("null")) {
                                try {
                                    // get input stream
                                    String path = "logo_user.png";
                                    InputStream ims = getAssets().open(path);
                                    // load image as Drawable
                                    Drawable d = Drawable.createFromStream(ims, null);
                                    // set image to ImageView
                                    profilPic.setImageDrawable(d);
                                } catch (IOException ex) {
                                    return;
                                }
                            } else {
                                new DownloadImageTask((ImageView) findViewById(R.id.profil_image))
                                    .execute("https://projetfinalheroku.s3.us-east-2.amazonaws.com/" + etu.getProfileImageUrl());
                            }


                        } else {
                            // load image
                            try {
                                // get input stream
                                String path = "logo_user.png";
                                InputStream ims = getAssets().open(path);
                                // load image as Drawable
                                Drawable d = Drawable.createFromStream(ims, null);
                                // set image to ImageView
                                profilPic.setImageDrawable(d);
                            } catch (IOException ex) {
                                return;
                            }
                        }

                        //tv_biographie.setText(etu.getBiography());
                    } else {
                        User u = json.fromJson(test, User.class);
                        tv_nom.setText(u.getLast_name());
                        tv_prenom.setText(u.getName());
                        tv_email.setText(u.getEmail());

                    }

                }
            }

        }
    }
}