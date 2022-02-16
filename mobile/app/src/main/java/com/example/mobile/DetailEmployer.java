package com.example.mobile;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.widget.TextView;

import com.example.mobile.entities.Employer;
import com.example.mobile.entities.Entreprise;
import com.example.mobile.managers.AsyncTaskManager;
import com.example.mobile.managers.FetchManager;
import com.example.mobile.views.FieldView;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class DetailEmployer extends Activity {
    private static final String TAG = "debug";

    ArrayList<Employer> employers;
    ArrayList<Entreprise> entreprises;
    ArrayList<TextView> UiElement;
    ArrayList<Method> methodArray;

    FieldView fieldViewName;
    TextView tvName;
    FieldView fieldViewFirstName;
    TextView tvFirstName;
    FieldView fieldViewEmail;
    TextView tvEmail;
    FieldView fieldViewPassword;
    TextView tvPassword;
    FieldView fieldViewHoraire;
    TextView tvCompanieOwne;
    FieldView fieldViewCompanieOwner;

    String idUser;
    Context ctx;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail_employer);
        ctx = this;
        getExtra(savedInstanceState);

        initViewField();
        initArrays();

        try {
            employers = FetchManager.fetchEmployer(idUser);
            entreprises = FetchManager.fetchEntreprisesById(employers.get(0));
            implementeUI(employers.get(0), entreprises.get(0));
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void initArrays() {
        UiElement = new ArrayList<>();
        methodArray = new ArrayList<>();
        UiElement.add(tvName);
        UiElement.add(tvFirstName);
        UiElement.add(tvEmail);
//        UiElement.add(tvPassword);
        UiElement.add(tvCompanieOwne);

        try {
            methodArray.add(Employer.class.getMethod("getLast_name"));
            methodArray.add(Employer.class.getMethod("getName"));
            methodArray.add(Employer.class.getMethod("getEmail"));
//            methodArray.add(Employer.class.getMethod("getPassword"));
            methodArray.add(Employer.class.getMethod("getIdEntreprise"));
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    private void initViewField() {
        //get xml component
        fieldViewName = findViewById(R.id.field_view_name);
        fieldViewFirstName = findViewById(R.id.field_view_firstname);
        fieldViewEmail = findViewById(R.id.field_view_email);
//        fieldViewPassword = findViewById(R.id.field_view_password);
        fieldViewHoraire = findViewById(R.id.field_view_horaire);
        fieldViewCompanieOwner = findViewById(R.id.field_view_compagnie_owner);

        tvName = fieldViewName.findViewById(R.id.value_tv);
        tvFirstName = fieldViewFirstName.findViewById(R.id.value_tv);
        tvEmail = fieldViewEmail.findViewById(R.id.value_tv);
//        tvPassword = fieldViewPassword.findViewById(R.id.value_tv);
        tvCompanieOwne = fieldViewCompanieOwner.findViewById(R.id.value_tv);
    }

    private void getExtra(Bundle intentExtra) {
        intentExtra = getIntent().getExtras();
        if (intentExtra != null) {
            idUser = intentExtra.getString("idkey");
        }
    }

    private void implementeUI(Employer employer, Entreprise entreprise) throws ExecutionException, InterruptedException {
        AsyncTaskManager.afficherUI(UiElement, methodArray, employer);
        tvCompanieOwne.setText(entreprise.getName());
    }
}