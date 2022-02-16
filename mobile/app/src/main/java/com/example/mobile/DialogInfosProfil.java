package com.example.mobile;
import static android.view.Gravity.CENTER;
import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.gridlayout.widget.GridLayout;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.mobile.entities.Criteria;
import com.example.mobile.entities.Language;
import com.example.mobile.entities.Program;
import com.example.mobile.entities.Province;
import com.example.mobile.entities.Response;
import com.example.mobile.entities.Skill;
import com.example.mobile.entities.Student;
import com.example.mobile.entities.User;
import com.example.mobile.managers.AsyncTaskManager;
import com.example.mobile.managers.FetchManager;
import com.example.mobile.utilities.AsyncTaskRequest;
import com.example.mobile.views.FieldView;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;
public class DialogInfosProfil extends AppCompatActivity {
    ArrayList<Student> students;
    ArrayList<Criteria> criterias;
    ArrayList<Program> programs;
    ArrayList<Province> provinces;
    ArrayList<Skill> skills;
    ArrayList<Language> languages;
    private final String HTTP_REQUEST_GET_STUDENT_BY_ID_STRING = "http://192.99.108.205:5000/students/";
    private final String HTTP_REQUEST_CRITERIA_BY_ID_STRING = "http://192.99.108.205:5000/criteria/";
    private final String HTTP_REQUEST_PROVINCE_ID_STRING = "http://192.99.108.205:5000/province/";
    private final String HTTP_REQUEST_PROGRAMME_ID_STRING = "http://192.99.108.205:5000/programs/";
    private final String HTTP_REQUEST_LANGUAGES_STRING = "http://192.99.108.205:5000/criteria/w/languages";
    private final String HTTP_REQUEST_SKILL_STRING = "http://192.99.108.205:5000/criteria/w/skills";
    String data = null;
    String idStudent;
    String idCriteria;
    String idrolevalue, idvalue, emailvalue, pwvalue, prenomvalue, nomvalue;
    Context ctx = this;
    private TextView tv_formation;
    private TextView tv_competence;
    private TextView tv_language;
    private TextView tv_province;
    private TextView tv_teletravail;
    private TextView tv_date_fin;
    private TextView tvBiographie;
    //    private int maxTime = 480;
//    private int duration = 30;
//    private int maxMin = 60;
//    private int startHr = 9;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dialog_infos_profil);
        tv_formation = findViewById(R.id.ProfilFormation);
        tv_competence = findViewById(R.id.ProfilSkills);
        tv_language = findViewById(R.id.ProfilLanguage);
        tv_province = findViewById(R.id.ProfilProvince);
        tv_teletravail = findViewById(R.id.ProfilTeletravail);
        tv_date_fin = findViewById(R.id.ProfilDisponible);
        tvBiographie = findViewById(R.id.ProfilBiographie);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            idrolevalue = extras.getString("idrolekey");
            idvalue = extras.getString("idkey");
            idStudent = idvalue;
            emailvalue = extras.getString("emailkey");
            pwvalue = extras.getString("pwkey");
            nomvalue = extras.getString("nomkey");
            prenomvalue = extras.getString("prenomkey");
        }

        try {
            students = FetchManager.fetchStudents(idStudent);
            criterias = FetchManager.fetchCriteria(students.get(0));
            programs = FetchManager.fetchProgram(criterias.get(0));
            provinces = FetchManager.fetchProvince(criterias.get(0));
            skills = FetchManager.fetchSkills(criterias.get(0));
            languages = FetchManager.fetchLanguage(criterias.get(0));
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
        implementDataToUI(students.get(0), criterias.get(0), programs.get(0), provinces.get(0), skills, languages.get(0));
    }
    private StringBuilder composeSkillsString() {
        //skill affichage
        StringBuilder compressSkill = new StringBuilder();
        int index = 0;
        for (Skill skill : skills) {

            index++;
            if (skills.size() == index) {

                compressSkill.append(skill.getSkill_name());
            } else {
                compressSkill.append(skill.getSkill_name()).append(", ");
            }
        }
        return compressSkill;
    }

    public void implementDataToUI(Student student, Criteria criteria, Program program, Province province, ArrayList<Skill> skills, Language language) {
        tv_language.setText(language.getLanguage_name());
        tv_formation.setText(program.getProgram());
        tv_date_fin.setText(criteria.getWork_start_date());
        tv_province.setText(province.getName());
        tv_competence.setText(composeSkillsString());
        tvBiographie.setText(student.getBiography());
        if (criteria.getWork_from_home()) {
            tv_teletravail.setText("Oui");
        } else {
            tv_teletravail.setText("Non");
        }
    }
}