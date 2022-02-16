package com.example.mobile;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.GridLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.mobile.entities.Employee;
import com.example.mobile.managers.AsyncTaskManager;
import com.example.mobile.managers.FetchManager;
import com.example.mobile.views.FieldView;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class DetailEmployee extends Activity {
    private static final String TAG = "debug";
    LinearLayout llPlageHoraireContainer;
    ArrayList<TextView> textViewsPlageHoraires;
    Context ctx;

    FieldView fieldViewName;
    TextView tvName;
    FieldView fieldViewFirstName;
    TextView tvFirstName;
    FieldView fieldViewEmail;
    TextView tvEmail;
    FieldView fieldViewPassword;
    TextView tvPassword;
    FieldView fieldViewHoraire;

    private String idEmployee;

    ArrayList<Employee> employees;
    ArrayList<TextView> UiElement;
    ArrayList<Method> methodArray;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail_employee);
        ctx = this;

        getExtra(savedInstanceState);
        initViewField();
        initArrays();

        try {
            employees = FetchManager.fetchEmployee(idEmployee);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
        implementeUI(employees.get(0));

        llPlageHoraireContainer = findViewById(R.id.plage_horaire);
        llPlageHoraireContainer.setBackgroundColor(getResources().getColor(R.color.light_gray_plage_horaire));
        gridLayoutHoraire();

    }

    private void initViewField() {
        fieldViewName = findViewById(R.id.field_view_name);
        fieldViewFirstName = findViewById(R.id.field_view_firstname);
        fieldViewEmail = findViewById(R.id.field_view_email);
        fieldViewPassword = findViewById(R.id.field_view_password);
        fieldViewHoraire = findViewById(R.id.field_view_horaire);

        tvName = fieldViewName.findViewById(R.id.value_tv);
        tvFirstName = fieldViewFirstName.findViewById(R.id.value_tv);
        tvEmail = fieldViewEmail.findViewById(R.id.value_tv);
        tvPassword = fieldViewPassword.findViewById(R.id.value_tv);
    }

    private void initArrays() {
        UiElement = new ArrayList<>();
        methodArray = new ArrayList<>();

        UiElement.add(tvName);
        UiElement.add(tvFirstName);
        UiElement.add(tvEmail);
        UiElement.add(tvPassword);

        try {
            methodArray.add(Employee.class.getMethod("getLast_name"));
            methodArray.add(Employee.class.getMethod("getName"));
            methodArray.add(Employee.class.getMethod("getEmail"));
            methodArray.add(Employee.class.getMethod("getPassword"));
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    private void getExtra(Bundle intentExtra) {
        intentExtra = getIntent().getExtras();
        if (intentExtra != null) {
            idEmployee = intentExtra.getString("idkey");
        }
    }

    private void implementeUI(Employee employee) {
        AsyncTaskManager.afficherUI(UiElement, methodArray, employee);
    }

    //methode qui genere les plages horaire dans un grid layout
    private void gridLayoutHoraire() {
        textViewsPlageHoraires = new ArrayList<>();
        GridLayout gridLayout = new GridLayout(ctx);
        int total = 16;
        int column = 4;
        int row = total / column;
        gridLayout.setAlignmentMode(GridLayout.ALIGN_BOUNDS);
        gridLayout.setColumnCount(column);
        gridLayout.setRowCount(row + 1);
        TextView titleText;

        //horaire variable
        int hours = 9;
        int minute = 0; //tranche de 20 minutes
        String plageH = hours + "H" + minute;

        for (int i = 0, c = 0, r = 0; i < total; i++, c++) {
            minute += 20;
            if (minute == 60) {
                hours += 1;
                minute = 0;
            }
            plageH = hours + "H" + minute;
            if (minute == 0) {
                plageH = hours + "H0" + minute;
            }

            if (c == column) {
                c = 0;
                r++;
            }
            titleText = new TextView(ctx);
            titleText.setText(plageH);
            gridLayout.addView(titleText, i);
            titleText.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
            GridLayout.LayoutParams param = new GridLayout.LayoutParams();
            param.height = GridLayout.LayoutParams.WRAP_CONTENT;
            param.width = GridLayout.LayoutParams.WRAP_CONTENT;
            param.leftMargin = 50;
            param.rightMargin = 5;
            param.topMargin = 5;
            param.setGravity(Gravity.CENTER);
            param.columnSpec = GridLayout.spec(c);
            param.rowSpec = GridLayout.spec(r);
            titleText.setLayoutParams(param);
            textViewsPlageHoraires.add(titleText);
        }

        llPlageHoraireContainer.addView(gridLayout);
    }
}