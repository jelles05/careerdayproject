package com.example.mobile;
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.RequiresApi;
import com.example.mobile.entities.Criteria;
import com.example.mobile.entities.Language;
import com.example.mobile.entities.Program;
import com.example.mobile.entities.Province;
import com.example.mobile.entities.Skill;
import com.example.mobile.entities.Student;
import com.example.mobile.managers.FetchManager;
import com.example.mobile.views.FieldView;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class DetailEtudiant extends Activity {
    private static final String TAG = "debug";

    ImageView imgEtudiant;
    FieldView fieldName;
    TextView fieldNameValue;

    FieldView fieldFirstName;
    TextView fieldFirstNameValue;

    FieldView fieldFormation;
    TextView fieldFormationValue;

    FieldView fieldLanguage;
    TextView fieldLanguageValue;

    FieldView fieldInterest;
    TextView fieldInterestValue;

    FieldView fieldTeletravail;
    TextView fieldTeletravailValue;

    FieldView fieldDisponible;
    TextView fieldDisponibleValue;

    FieldView fieldProvince;
    TextView fieldProvinceValue;

    TextView tvSkills;

    ArrayList<Student> students;
    ArrayList<Criteria> criterias;
    ArrayList<Program> programs;
    ArrayList<Province> provinces;
    ArrayList<Skill> skills;
    ArrayList<Language> languages;

    String idStudent;
    Context ctx;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail_etudiant);
        ctx = this;
        initView();
        getExtra(savedInstanceState);

        try {
            students = FetchManager.fetchStudents(idStudent);
            criterias = FetchManager.fetchCriteria(students.get(0));
            programs = FetchManager.fetchProgram(criterias.get(0));
            provinces = FetchManager.fetchProvince(criterias.get(0));
            skills = FetchManager.fetchSkills(criterias.get(0));
            languages = FetchManager.fetchLanguage(criterias.get(0));
            implementDataToUI(students.get(0), criterias.get(0), programs.get(0), provinces.get(0), skills, languages.get(0));
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
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

    @RequiresApi(api = Build.VERSION_CODES.N)
    private void setImage(Student student) throws ExecutionException, InterruptedException {
        if (student.getProfileImageUrl() == null || student.getProfileImageUrl() == "null") {
            Log.d("debugApp", "Il n'y a pas d'image enregistrée: " + students.get(0).getProfileImageUrl());
        } else {
            Bitmap downloadedImg = new DownloadImageTask(imgEtudiant)
                .execute("https://projetfinalheroku.s3.us-east-2.amazonaws.com/" + student.getProfileImageUrl()).get();
            Log.d(TAG, "setImage: bitmap receive :" + downloadedImg.toString());
//          Canvas canvas = new Canvas(downloadedImg);
            imgEtudiant.setImageBitmap(downloadedImg);
//          imgLogoEnterprise.draw(canvas);
        }
    }

    private void initView() {
        imgEtudiant = findViewById(R.id.img_student);
        fieldName = findViewById(R.id.name_field_view);
        fieldFirstName = findViewById(R.id.firstname_field_view);
        fieldFormation = findViewById(R.id.formation_field_view);
        fieldLanguage = findViewById(R.id.language_field_view);
        fieldInterest = findViewById(R.id.interest_field_view);
        fieldTeletravail = findViewById(R.id.teletravail_field_view);
        fieldDisponible = findViewById(R.id.disponible_field_view);
        fieldProvince = findViewById(R.id.province_field_view);

        fieldNameValue = fieldName.getValueTv();
        fieldFirstNameValue = fieldFirstName.getValueTv();
        fieldFormationValue = fieldFormation.getValueTv();
        fieldLanguageValue = fieldLanguage.getValueTv();
        fieldInterestValue = fieldInterest.getValueTv();
        fieldTeletravailValue = fieldTeletravail.getValueTv();
        fieldDisponibleValue = fieldDisponible.getValueTv();
        fieldProvinceValue = fieldProvince.getValueTv();
        tvSkills = findViewById(R.id.skill_container);
    }

    private void getExtra(Bundle intentExtra) {
        intentExtra = getIntent().getExtras();
        if (intentExtra != null) {
            idStudent = intentExtra.getString("idkey");
        }
    }

    private StringBuilder composeSkillsString() {
        //skill affichage
        StringBuilder compressSkill = new StringBuilder();
        int index = 0;
        for (Skill skill : skills) {
            Log.d(TAG, "implementDataToUI: array size :" + skills.size() + " index at : " + index);
            index++;
            if (skills.size() == index) {
                Log.d(TAG, "implementDataToUI: last index de larray " + index);
                compressSkill.append(skill.getSkill_name());
            } else {
                compressSkill.append(skill.getSkill_name()).append(", ");
            }
        }
        return compressSkill;
    }

    public void implementDataToUI(Student student, Criteria criteria, Program program, Province province, ArrayList<Skill> skills, Language language) throws ExecutionException, InterruptedException {
        fieldNameValue.setText(student.getLast_name());
        fieldFirstNameValue.setText(student.getName());
        fieldFormationValue.setText(program.getProgram());
        fieldInterestValue.setText(student.getBiography());
        fieldLanguageValue.setText(language.getLanguage_name());
        fieldDisponibleValue.setText(criteria.getWork_start_date());
        fieldProvinceValue.setText(province.getName());
        tvSkills.setText(composeSkillsString());

        if (criteria.getWork_from_home()) {
            fieldTeletravailValue.setText("Oui");
        } else {
            fieldTeletravailValue.setText("Non");
        }

        setImage(student);
    }
}
