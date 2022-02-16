package com.example.mobile;
import androidx.appcompat.app.AppCompatActivity;
import androidx.gridlayout.widget.GridLayout;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Toast;
public class Dashboard extends AppCompatActivity {
    Context ctx = this;
    String idrolevalue, idvalue, emailvalue, pwvalue, prenomvalue, nomvalue,idCareerDay;
    private GridLayout grid;
    private LinearLayout container;
    private ImageButton logout;
    private ImageButton btnJourneeCarriere;
    private ImageButton btnEntreprises;
    private ImageButton btnUtilisateurs;
    private ImageButton btnMeetings;
    private ImageButton btnProfil;
    private ImageButton btnNotification;
    private ImageButton btnDetailEmployeeTestToREMOVE;
    private ImageButton btnDetailEntrepriseTestToREMOVE;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        grid = findViewById(R.id.grid);
        container=findViewById(R.id.container_btn_student);
        btnMeetings = findViewById(R.id.btn_meetings);
        btnUtilisateurs = findViewById(R.id.btn_utilisateurs);
        logout = findViewById(R.id.logout);
        btnEntreprises = findViewById(R.id.btn_entreprises);
        btnProfil = findViewById(R.id.btn_profil);
        btnNotification = findViewById(R.id.btn_notification);

        //data from login (idRole)
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idvalue = extras.getString("idkey");
            emailvalue = extras.getString("emailkey");
            pwvalue = extras.getString("pwkey");
            nomvalue = extras.getString("nomkey");
            prenomvalue = extras.getString("prenomkey");
            idCareerDay=extras.getString("idCareerDaykey");


            btnProfil.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {


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
            });

            logout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ctx, MainActivity.class);
                    startActivity(intent);
                }
            });

            btnEntreprises.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ctx, ListeEntreprises.class);
                    intent.putExtra("idrolekey", idrolevalue);
                    intent.putExtra("idCareerDaykey", idCareerDay);
                    startActivity(intent);
                }
            });
            btnUtilisateurs.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //Intent intent = new Intent(ctx, ListeEtudiants.class);
                    Intent intent = new Intent(ctx, ListeUtilisateurs.class);
                    intent.putExtra("idCareerDaykey", idCareerDay);
                    startActivity(intent);
                }
            });

            btnNotification.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    Intent intent = new Intent(ctx, Notifications.class);
                    intent.putExtra("idkey", idvalue);
                    intent.putExtra("idrolekey", idrolevalue);
                    intent.putExtra("idCareerDaykey", idCareerDay);
                    startActivity(intent);
                }
            });


            btnMeetings.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ctx, Meetings.class);
                    intent.putExtra("idkey", idvalue);
                    intent.putExtra("idrolekey", idrolevalue);
                    intent.putExtra("emailkey", emailvalue);
                    intent.putExtra("pwkey", pwvalue);
                    intent.putExtra("nomkey", nomvalue);
                    intent.putExtra("prenomkey", prenomvalue);
                    startActivity(intent);
                }
            });

            if (Integer.valueOf(idrolevalue) == 2) {
                //Log.d("debugApp", "response " + value);


                //grid.removeView(btnMeetings);
                grid.removeView(btnUtilisateurs);
                //btnMeetings.setClickable(false);
            }

            if (Integer.valueOf(idrolevalue) == 3 || Integer.valueOf(idrolevalue) == 4) {


//                grid.removeView(btnMeetings); // a enlever quand bug page meetings employe et employeur sera fixed
                btnUtilisateurs.setImageResource(R.drawable.btn_etudiants);
                btnUtilisateurs.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //Intent intent = new Intent(ctx, ListeEtudiants.class);
                        Intent intent = new Intent(ctx, ListeEtudiants.class);
                        intent.putExtra("idCareerDaykey", idCareerDay);
                        startActivity(intent);
                    }
                });
            }
        }




    }
    private boolean backPressedToExitOnce;
    private boolean doubleBackToExitPressedOnce;
    @Override
    public void onBackPressed() {
        if (doubleBackToExitPressedOnce) {
            super.onBackPressed();
            return;
        }
        this.doubleBackToExitPressedOnce = true;
        Toast.makeText(this, "Press again to exit", Toast.LENGTH_SHORT).show();
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                doubleBackToExitPressedOnce = false;
            }
        }, 2000);
    }
}