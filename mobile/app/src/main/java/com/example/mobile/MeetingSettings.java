package com.example.mobile;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.mobile.entities.CareerDay;
import com.example.mobile.entities.Meeting;
import com.example.mobile.entities.TimeSlot;
import com.example.mobile.entities.User;
import com.example.mobile.managers.FetchManager;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.concurrent.ExecutionException;

public class MeetingSettings extends AppCompatActivity {
    private static final String TAG = "debug";
    //Const variable
    private final String TYPE_VIRTUEL = "Virtuel";
    private final String TYPE_PRESENTIEL = "Presentiel";

    //variable receive from intent
    String meetingReceive;
    Meeting meetingReceivedObject;
    String idUserConnected;

    //utility
    Gson json;
    Context ctx;
    ArrayList<TimeSlot> timeSlotsActifUser;
    ArrayList<TimeSlot> timeSlotsEmployer;
    ArrayList<TimeSlot> timeSlotsEtudiant;

    //UI element variable
    EditText virtualMeeting;
    Spinner heureMeeting;
    Spinner spinnerTypeMeeting;

    Button btnSauvegarder;
    Button btnAnnuler;

    LinearLayout llContainerPlagesHoraire;
//    private LinearLayout llContainerPlagesHoraire;

    User userConnected;
    CareerDay careerDay;
    ArrayList<String> timeSlotSTR;
    ArrayList<String> listAllTimeSlot;

    int selectedIndexTimeSlot;
    int currentTime24Format;
    int currentMinutes;
    ArrayList<String> timeSlotToReomve;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_meeting_settings);

        int id = getSharePrefenreceIdUser();
        idUserConnected = String.valueOf(id);
        json = new Gson();

        //FetchManager constructeur prend un string
        //selon test ou local les requetes seront ajuster
        //pas besoinde le garder en memoire vue que toute cest methode sont static
        //le constructeur va configurer les requet a la db selon
        //le string entrer
        //local : a ton pc
        //test : sur la vm de test
//        new FetchManager("local");
        String test = FetchManager.getMachineChoisi();
        Log.d(TAG, "onCreate: is FetchManager already config?" + test);

        //get meeting object clicked from intent
        getExtra(savedInstanceState);

        try {
            careerDay = FetchManager.fetchCareerDay().get(0);
            userConnected = FetchManager.fetchUserById(idUserConnected).get(0);
            timeSlotsActifUser = userRoleSmartLoadingTimeSlot(userConnected, meetingReceivedObject);
            //init le array listAllTimeSlot du start au end de la career day
            setPossibleTimeSlotRange();
            //set variable currentTime24Format et currentMinutes
            getCurrentDate();
            initVariable();
            settingSpinnerVariableValue(meetingReceivedObject);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }

        String[] items = new String[]{"Type", TYPE_VIRTUEL, TYPE_PRESENTIEL};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(ctx, R.layout.custom_spinner_item, items);
        spinnerTypeMeeting.setAdapter(adapter);
        spinnerTypeMeeting.setSelection(meetingReceivedObject.getId_meeting_type());

        ArrayAdapter<String> adapterHoraire = new ArrayAdapter<>(ctx, R.layout.custom_spinner_item, listAllTimeSlot);
        heureMeeting.setAdapter(adapterHoraire);
        heureMeeting.setSelection(selectedIndexTimeSlot);

        btnSauvegarder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                TextView tv = (TextView) heureMeeting.getSelectedView();

                Log.i(TAG, "onClick: SAUVEGARDER heure spinner choisi : " + tv.getText() + " heuremeeting selected info: " + heureMeeting.getSelectedItemPosition());

                //AsyncTask en update pour update a la base de donner
                try {
                    FetchManager.updateMeeting(meetingReceivedObject, spinnerTypeMeeting, virtualMeeting, heureMeeting);
                } catch (ExecutionException | InterruptedException e) {
                    e.printStackTrace();
                }
                finish();
            }
        });
    }

    private void initVariable() throws ExecutionException, InterruptedException {
        ctx = this;
        //UI element
        virtualMeeting = findViewById(R.id.edit_text_virtual_meeting_input);
        heureMeeting = findViewById(R.id.spinner_meeting_horaire_input);
        spinnerTypeMeeting = findViewById(R.id.spinner_meeting_type_input);
        btnAnnuler = findViewById(R.id.btn_annuler_meeting_setting);
        btnSauvegarder = findViewById(R.id.btn_modifier_meeting_setting);
//        llContainerPlagesHoraire = findViewById(R.id.container_plages_horaire);

        //affichage des donners
        for (String s : listAllTimeSlot) {
            //meeting info to compare
//                timeslotTriage(s, currentTime24Format, currentMinutes);
            Log.d(TAG, "settingVariableValue: string time before removing time slot by current time: " + s);
//                timeslotTriage(s, currentTime24Format, currentMinutes);
        }
        btnAnnuler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    private void setPossibleTimeSlotRange() {
        int timeStart = careerDay.getTime_start();
        int timeEnd = careerDay.getTime_end();
        int meetingDuration = careerDay.getMeeting_duration();

        int totalTimeDurationHours = timeEnd - timeStart;
        int totalTimeInMinutes = totalTimeDurationHours * 60;
        int estimateMeetingPossible = totalTimeInMinutes / meetingDuration;

        int hours = timeStart;
        int minutes = 0;
        String resultCombinedHoursAndMinutes = "null";

        //load list de tout les timeslot possbile du start to end de la journee career
        listAllTimeSlot = new ArrayList<>();
        //get number of meeting possible in range start end career day
        for (int i = 0; i <= estimateMeetingPossible; i++) {
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }
            resultCombinedHoursAndMinutes = (minutes == 0) ? hours + "h" : hours + "h" + minutes;
            listAllTimeSlot.add(resultCombinedHoursAndMinutes);
            minutes += meetingDuration;
        }
    }

    private void settingSpinnerVariableValue(Meeting meeting) throws ExecutionException, InterruptedException {
        virtualMeeting.setText((meeting.getVirtual_meeting_url().equals("null")) ? "Aucune url enregistrer" : meeting.getVirtualMeetingUrl());

        String spinnerPosition = meetingType(meeting);
        if ((spinnerPosition.equals(TYPE_VIRTUEL) || spinnerPosition.equals(TYPE_PRESENTIEL))) {
            spinnerTypeMeeting.setSelection(meeting.getId_meeting_type());
            spinnerTypeMeeting.setTag(meeting.getId_meeting_type());
        } else {
            spinnerTypeMeeting.setSelection(0);
        }

        timeSlotSTR = new ArrayList<>();
        int index = 0;

        //ajout des time slot dans le drop list for each timeslot dans la list
        //naffiche pas la valeur par defaut a modifier vue quil ne sera pas possbile de modifier a la meme heure ou un bas
        for (TimeSlot timeSlot : timeSlotsActifUser) {
            Log.d(TAG, "initVariable: time: " + timeSlot.getTime_slot());
            timeSlotSTR.add(timeSlot.getTime_slot());
        }


        //remove timeslot already use by the actif user (Admin)
        ArrayList<String> toReturn;
        ArrayList<String> timeSlotEtudiantString = null;
        if (timeSlotsEmployer != null && timeSlotsEtudiant != null) {
            toReturn = new ArrayList<>();
            for (TimeSlot timeSlot : timeSlotsEtudiant) {
                toReturn.add(timeSlot.getTime_slot());
            }
            for (TimeSlot timeSlot : timeSlotsEmployer) {
                toReturn.add(timeSlot.getTime_slot());
            }
            //enleve toute les selection indisponible dans larray toreturn
            listAllTimeSlot.removeAll(toReturn);

        } else if (userConnected.getId_role() == 3 || userConnected.getId_role() == 4) {
            timeSlotEtudiantString = new ArrayList<>();

            //actif user employee, employer ou student timeslot
            listAllTimeSlot.removeAll(timeSlotSTR);

            for (TimeSlot timeSlot : timeSlotsEtudiant) {
                timeSlotEtudiantString.add(timeSlot.getTime_slot());
            }
            listAllTimeSlot.removeAll(timeSlotEtudiantString);
        }
        for (String timeSlot : listAllTimeSlot) {
            if (timeSlot.equals(meeting.getDate_time())) {
                Log.d(TAG, "settingSpinnerVariableValue: is egal" + timeSlot + " meeting time : " + meeting.getDate_time());
                heureMeeting.setSelection(index);
                Log.i(TAG, "settingVariableValue: YOUPI set moi" + index);
                selectedIndexTimeSlot = index;
            }
            index++;
        }
//        heureMeeting.setSelection(selectedIndexTimeSlot);
    }

    private String meetingType(Meeting meeting) {
        String meetingType = null;
        switch (meeting.getId_meeting_type()) {
            case 1:
                meetingType = TYPE_VIRTUEL;
                break;
            case 2:
                meetingType = TYPE_PRESENTIEL;
                break;
            default:
                meetingType = "Type";
        }
        return meetingType;
    }

    private void getExtra(Bundle intentExtra) {
        intentExtra = getIntent().getExtras();
        if (intentExtra != null) {
            meetingReceive = intentExtra.getString("meetingClicked");
            Log.d(TAG, "getExtra: JSON RECEIVE : " + meetingReceive);
            meetingReceivedObject = json.fromJson(meetingReceive, Meeting.class);
        }
    }

    private ArrayList<TimeSlot> mergeArraysTimeSlot
        (ArrayList<TimeSlot> timeSlotsEmployer, ArrayList<TimeSlot> timeSlotsEtudiant) {
        ArrayList<TimeSlot> allMeetingTimeSlotList = new ArrayList<>();
        ArrayList<TimeSlot> tempAssingArray = new ArrayList<>();

        tempAssingArray.addAll(timeSlotsEmployer);

        tempAssingArray.removeAll(timeSlotsEtudiant);
        tempAssingArray.addAll(timeSlotsEtudiant);

        allMeetingTimeSlotList.addAll(tempAssingArray);
        Log.d(TAG, "mergeArraysTimeSlot: allmeeting TimeSLot list : " + allMeetingTimeSlotList.size());

        return allMeetingTimeSlotList;
    }

    private ArrayList<TimeSlot> userRoleSmartLoadingTimeSlot(User user, Meeting meeting) throws
        ExecutionException, InterruptedException {
        ArrayList<TimeSlot> userConnecterTimeSlot = null;
        Log.d(TAG, "userRoleSmartLoadingTimeSlot: id role user : " + user.getId_role());
        switch (user.getId_role()) {
            case 1://admin
                //load toute la list de meeting de la journee carriere active
                timeSlotsEtudiant = FetchManager.fetchTimeSlot(String.valueOf(meeting.getId_student()));
                timeSlotsEmployer = FetchManager.fetchTimeSlot(String.valueOf(meeting.getId_employee()));
                userConnecterTimeSlot = mergeArraysTimeSlot(timeSlotsEmployer, timeSlotsEtudiant);
                break;
            case 2://student
                //load student timeslot
                //ne devrais pas avoir acces a modifier le meeting en tout temps
                userConnecterTimeSlot = FetchManager.fetchTimeSlot(String.valueOf(meeting.getId_student()));
                break;
            case 3://Employe
                //time slot etudiant dans le meeting avec employe plage horaire list
                timeSlotsEtudiant = FetchManager.fetchTimeSlot(String.valueOf(meeting.getId_student()));
                userConnecterTimeSlot = FetchManager.fetchTimeSlot(String.valueOf(meeting.getId_employee()));
                break;
            case 4://Employer
                Log.d(TAG, "userRoleSmartLoadingTimeSlot: Employeur connecter :");
                timeSlotsEtudiant = FetchManager.fetchTimeSlot(String.valueOf(meeting.getId_student()));

                //load all meeting de lentreprise de la journee carriere active
                userConnecterTimeSlot = FetchManager.fetchTimeSlot(String.valueOf(user.getId()));
                break;
            default:
        }
        if (!userConnecterTimeSlot.isEmpty()) {
            //si array non null remove timeslot baser aussi sur le temp de la modification
            if (timeSlotToReomve != null) {
                listAllTimeSlot.removeAll(timeSlotToReomve);
            }
//            heureMeeting.setSelection(selectedIndexTimeSlot);
        }
        return userConnecterTimeSlot;
    }

    private void getCurrentDate() {
        //get curent hours and minutes
        Calendar nowTime = Calendar.getInstance();
        currentTime24Format = nowTime.get(Calendar.HOUR_OF_DAY);
        currentMinutes = nowTime.get(Calendar.MINUTE);
    }

    private void timeslotTriage(String s, int currentTime24Format, int currentMinutes) {
        timeSlotToReomve = new ArrayList<>();
        int hoursMeeting = 0;
        int minutesMeeting = 0;
        if (Integer.valueOf(s.length()) == 5) {
            hoursMeeting = Integer.valueOf(s.substring(0, 2));
            minutesMeeting = Integer.valueOf(s.substring(3, 5));
        } else if (Integer.valueOf(s.length()) == 4) {
            hoursMeeting = Integer.valueOf(s.substring(0, 1));
            minutesMeeting = Integer.valueOf(s.substring(2, 4));
        } else if (Integer.valueOf(s.length()) == 3) {
            hoursMeeting = Integer.valueOf(s.substring(0, 2));
            minutesMeeting = 0;
        } else if (Integer.valueOf(s.length()) == 2) {
            hoursMeeting = Integer.valueOf(s.substring(0, 1));
            minutesMeeting = 0;
        }
        if (hoursMeeting < currentTime24Format) {
            Log.d(TAG, "settingVariableValue si hour meeting plus petit que le current time REMOVE: " + hoursMeeting + " plus petit que " + currentTime24Format);
            timeSlotToReomve.add(hoursMeeting + "h" + minutesMeeting);
        } else if (currentTime24Format == hoursMeeting && minutesMeeting < currentMinutes) {
            Log.d(TAG, "settingVariableValue: si hour egal et minute plus petit que current time REMOVE :" + hoursMeeting + "h" + minutesMeeting + "plus petit que currente minute time :" + currentTime24Format + "h" + currentMinutes);
            timeSlotToReomve.add(hoursMeeting + "h" + minutesMeeting);
        } else if (hoursMeeting > currentTime24Format) {
            Log.d(TAG, "settingVariableValue: if meeting plus grand que current time peu etre modifier :" + hoursMeeting + "h" + minutesMeeting + " plus grand que : " + currentTime24Format + "h" + currentMinutes);
        } else if (currentTime24Format >= hoursMeeting && minutesMeeting > currentMinutes) {
            Log.d(TAG, "settingVariableValue: if meeting hours egal que current hours time mais plus grand que current minutes peut etre modifier:" + hoursMeeting + "h" + minutesMeeting);
        }
    }

    private int getSharePrefenreceIdUser() {
        SharedPreferences sharedPref = getSharedPreferences("User", Context.MODE_PRIVATE);
        int idUser = sharedPref.getInt("idUser", 0);
        Log.d(TAG, "getSharePrefenreceIdUser: id user : " + idUser);
        return idUser;
    }
}