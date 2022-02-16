package com.example.mobile;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.mobile.entities.Employee;
import com.example.mobile.entities.Entreprise;
import com.example.mobile.entities.Response;
import com.example.mobile.entities.ResponseAttendance;
import com.example.mobile.entities.ResponseV2;
import com.example.mobile.entities.User;
import com.example.mobile.managers.FetchManager;
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
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class MainActivity extends AppCompatActivity {
    String HTTP_REQUEST_ATTENDANCE;
    String HTTP_REQUEST_ACTIVE_CAREER_DAY;
    String HTTP_REQUEST_ATTENDANCE_ENTERPRISE;
    String HTTP_REQUEST_EMPLOYEES_ENTERPRISE;
    private static String REPLACE_ID_INDICATOR = "w";
    private static String REPLACE_CHARACTER_INDICATOR = "w";
    private static String REPLACE_ID_CAREERDAY_INDICATOR = "x";
    private static String attendanceEnterprise;
    private static String attendanceEmployees;

    Context ctx = this;
    //String isActive;
    String isActive;
    String idUser;
    String idCareerDay;
    String activeCareerDayResponse;
    private static String dataAttendance = null;
    EditText editEmail, editPassword;
    private Button btnSignIn;
    String testType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        editEmail = (EditText) findViewById(R.id.username);
        editPassword = (EditText) findViewById(R.id.password);

        //FetchManager constructeur prend un string
        //selon test ou local les requetes seront ajuster
        //pas besoinde le garder en memoire vue que toute cest methode sont static
        //le constructeur va configurer les requet a la db selon
        //le string entrer
        //local : a ton pc
        //test : sur la vm de test
        testType = "test";
        new FetchManager(testType);
        HTTP_REQUEST_ATTENDANCE = "http://" + FetchManager.getMachineChoisi() + "/user/w/attendance/x";
        HTTP_REQUEST_ACTIVE_CAREER_DAY = "http://" + FetchManager.getMachineChoisi() + "/career_day/is_active";
        HTTP_REQUEST_ATTENDANCE_ENTERPRISE = "http://" + FetchManager.getMachineChoisi() + "/enterprises/attendance/w";
        HTTP_REQUEST_EMPLOYEES_ENTERPRISE = "http://" + FetchManager.getMachineChoisi() + "/employees/enterprises/w";
//        editEmail.setText("ralph@mail.com");//employeur
        //editEmail.setText("james@gmail.com");//employeur


editEmail.setText("projetfinalheroku@gmail.com");//admin
        //editEmail.setText("cb@gmail.com");//employeur 123456789
//        editEmail.setText("nat@gmail.com");//employe qwerty
        //editEmail.setText("gabriel@mail.com");//etudiant non inscrit
        //editEmail.setText("cdion@mail.com");//etudiant
        //editEmail.setText("joao@gmail.com");//etudiant inscrit a la journee carriere
        //editPassword.setText("123456789");
        editPassword.setText("1234");
//        editPassword.setText("qwerty");


        btnSignIn = findViewById(R.id.sign_in);
        btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new AsyncTaskRequest(ctx, btnSignIn).execute("http://" + FetchManager.getMachineChoisi() + "/login");
            }
        });
    }

    public String fetchAttendance(String idUser, String idCareerDay) throws ExecutionException, InterruptedException {
        String temp = HTTP_REQUEST_ATTENDANCE.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        String request = temp.replace(REPLACE_ID_CAREERDAY_INDICATOR, idCareerDay);
        Log.d("debugApp", "request " + request);
        com.example.mobile.utilities.AsyncTaskRequest asyncTask = new com.example.mobile.utilities.AsyncTaskRequest(MainActivity.class);
        dataAttendance = asyncTask.execute(request).get();
//        Log.d("debugApp", String.valueOf(dataAttendance));
        return dataAttendance;
    }

    public Boolean fetchAttendanceEmployes(String idUser, String idCareerDay) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_ATTENDANCE_ENTERPRISE.replace(REPLACE_ID_INDICATOR, idCareerDay);
        String idEnterprise;
        Boolean present = false;
        Log.d("debugApp", "request " + request);
        com.example.mobile.utilities.AsyncTaskRequest asyncTask = new com.example.mobile.utilities.AsyncTaskRequest(ListeUtilisateurs.class);
        attendanceEnterprise = asyncTask.execute(request).get();
        ResponseV2 responseAttendanceEnterprise = new Gson().fromJson(attendanceEnterprise, ResponseV2.class);

        ArrayList<Entreprise> entreprises = new ArrayList<>();
        Gson json = new Gson();
        for (Object o : responseAttendanceEnterprise.getDataAttendance()) {
            String test = json.toJson(o);
            Entreprise e = json.fromJson(test, Entreprise.class);
            entreprises.add(e);
        }
        ArrayList<Employee> employees = new ArrayList<>();
        Gson json2 = new Gson();
        for (Entreprise ent : entreprises) {
            //Log.d("debugApp", "list entreprises: " + ent.getId());
            String request2 = HTTP_REQUEST_EMPLOYEES_ENTERPRISE.replace(REPLACE_ID_INDICATOR, String.valueOf(ent.getId()));
            com.example.mobile.utilities.AsyncTaskRequest asyncTask2 = new com.example.mobile.utilities.AsyncTaskRequest(ListeUtilisateurs.class);
            attendanceEmployees = asyncTask2.execute(request2).get();
            ResponseV2 responseAttendanceEmployees = new Gson().fromJson(attendanceEmployees, ResponseV2.class);
            //Log.d("debugApp", "data: " + responseAttendanceEmployees.getDataAttendance());
            for (Object o : responseAttendanceEmployees.getDataAttendance()) {
                String test2 = json2.toJson(o);
                Employee e = json2.fromJson(test2, Employee.class);

                Log.d("debugApp", "list employees: " + e.getName());
                if (Integer.valueOf(e.getId_role()) == 3 && !(employees.contains(e))) {
                    employees.add(e);
                }
            }

        }

        for (Employee emp : employees) {
            if (String.valueOf(emp.getId()) == idUser) {
                present = true;
            }
        }
        return present;
    }

    private class AsyncTaskRequest extends AsyncTask<String, Nullable, String> {
        Context ctx;
        Button btnSignIn;

        public AsyncTaskRequest(Context ctx, Button btnSignIn) {
            this.ctx = ctx;
            this.btnSignIn = btnSignIn;
        }

        @Override
        protected String doInBackground(String... strings) {
            Log.d("debug", "doInBackground: url receive" + strings[0]);
            String response = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(strings[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
                connection.setRequestProperty("Accept", "application/json");
                connection.setDoOutput(true);
                connection.setDoInput(true);
                String jsonString = "{\"email\": \"" + editEmail.getText().toString() + "\", \"password\": \"" + editPassword.getText().toString() + "\"}";
                DataOutputStream output = new DataOutputStream(connection.getOutputStream());
                output.writeBytes(jsonString);
                output.flush();
                output.close();
                int responseCode = connection.getResponseCode();
                //Log.d("debugApp", "response code: " + responseCode);
                if (responseCode == 200) {
                    InputStream inputStream = connection.getInputStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                    response = reader.readLine();
                } else {
                    response = null;

                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                connection.disconnect();
            }
            return response;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            if (s != null) {
                //Log.d("debugApp","response "+s);
                Response response = new Gson().fromJson(s, Response.class);
                //Log.d("debugApp", "response " + response.getDatalist());
                ArrayList<User> users = new ArrayList<>();
                Gson json = new Gson();
                Object o = response.getDatalist()[0];
                //Log.d("debugApp", "response " + o);
                String test = json.toJson(o);
                User u = json.fromJson(test, User.class);
                //Log.d("debugApp", "onPostExecute: " + u.getId_role());
                setSharePrefenceIdUser(u);

                String idrolevalue = String.valueOf(u.getId_role());
                String idvalue = String.valueOf(u.getId());
                idUser = idvalue;
                try {
                    com.example.mobile.utilities.AsyncTaskRequest asyncTask = new com.example.mobile.utilities.AsyncTaskRequest(MainActivity.class);
                    activeCareerDayResponse = asyncTask.execute(HTTP_REQUEST_ACTIVE_CAREER_DAY).get();
                } catch (ExecutionException | InterruptedException e) {
                    e.printStackTrace();
                }
                JsonObject activeCareerDay = new Gson().fromJson(activeCareerDayResponse, JsonObject.class);
                JsonElement data = activeCareerDay.get("data");
                if (data != null) {
                    idCareerDay = String.valueOf(data.getAsJsonArray().get(0).getAsJsonObject().get("id"));
                } else {
                    idCareerDay = null;
                }


                try {
                    if (idCareerDay != null) {

                        Log.d("debugApp career day id:", String.valueOf(idCareerDay));
                        isActive = fetchAttendance(idUser, idCareerDay);
                    }


                } catch (ExecutionException | InterruptedException e) {
                    e.printStackTrace();
                }
                Log.d("debugApp", "dataAttenddance:" + String.valueOf(dataAttendance));
                ResponseAttendance responseActive = new Gson().fromJson(dataAttendance, ResponseAttendance.class);
                Log.d("debugApp", "inscrit a la journee carriere: " + responseActive.getMessage());

                String emailvalue = String.valueOf(u.getEmail());
                String pwvalue = String.valueOf(u.getPassword());
                String prenomvalue = String.valueOf(u.getName());
                String nomvalue = String.valueOf(u.getLast_name());
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

                //pour gerer les attendances
                //startActivity(intent);
                boolean attendanceEmployees = false;
                try {
                    attendanceEmployees = fetchAttendanceEmployes(idUser, idCareerDay);
                } catch (ExecutionException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (responseActive.getMessage().equals("User present") || Integer.valueOf(idrolevalue) == 1 || attendanceEmployees) {
                    startActivity(intent);
                } else {
                    Toast.makeText(MainActivity.this, "Vous n’êtes pas inscrit a la journée carrière en cours !", Toast.LENGTH_LONG).show();
                    Intent intentAttend = new Intent(ctx, MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                    startActivity(intentAttend);
                }

            } else {
                Toast.makeText(MainActivity.this, "Email ou mot de passe incorrect! réessayez, s'il vous plaît", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(ctx, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        }

        private void setSharePrefenceIdUser(User u) {
            SharedPreferences sharedPref = getSharedPreferences("User", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            Log.d("debug", "setSharePrefenceIdUser: id user:" + u.getId());
            editor.putInt("idUser", u.getId());
            editor.putString("typeTest", testType);
            editor.apply();
        }
    }
}