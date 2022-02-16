package com.example.mobile.managers;

import android.util.Log;
import android.widget.EditText;
import android.widget.Spinner;

import androidx.annotation.Nullable;

import com.example.mobile.DetailEtudiant;
import com.example.mobile.DialogPlagesHoraire;
import com.example.mobile.Meetings;
import com.example.mobile.entities.CareerDay;
import com.example.mobile.entities.Criteria;
import com.example.mobile.entities.Employee;
import com.example.mobile.entities.Employer;
import com.example.mobile.entities.Entreprise;
import com.example.mobile.entities.Language;
import com.example.mobile.entities.Meeting;
import com.example.mobile.entities.Program;
import com.example.mobile.entities.Province;
import com.example.mobile.entities.Response;
import com.example.mobile.entities.Skill;
import com.example.mobile.entities.Student;
import com.example.mobile.entities.TimeSlot;
import com.example.mobile.entities.User;
import com.example.mobile.utilities.AsyncTaskRequest;
import com.example.mobile.utilities.AsyncTaskRequestPlus;
import com.example.mobile.utilities.AsyncTaskRequestUpdate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.ExecutionException;

public class FetchManager {
    private static final String ipTestMachine = "192.99.108.205:5000";
    public static String machineChoisi = "";

    public String whereToFetch;

    public FetchManager() {
    }

    //local utilise le localhost et distant utilise lip de la machine distante
    public FetchManager(@Nullable String environementDeTest) {
        this.whereToFetch = environementDeTest;
        machineChoisi = ipTestMachine;
    }

    public static String getMachineChoisi() {
        return ipTestMachine;
    }

    private String selectionTestIp(String desiredTestIp) {
        String toReturn = null;
        if (desiredTestIp.equals("test")) {
            toReturn = ipTestMachine;
            Log.d(TAG, "selectionTestIp: if test : " + toReturn);
        }
        return toReturn;
    }

    private static final String TAG = "debug";
    private static final String REPLACE_CHARACTER_INDICATOR = "w";

    private static final String HTTP_REQUEST_MEETINGS_BY_IDUSER_STRINGS = "http://" + ipTestMachine + "/users/w/meetings";
    private static final String HTTP_REQUEST_ALL_MEETINGS_STRING = "http://" + ipTestMachine + "/meetings";
    private static final String HTTP_REQUEST_ENTREPRISE_ID_STRING = "http://" + ipTestMachine + "/enterprises/";
    private static final String HTTP_REQUEST_EMPLOYEE_ID_STRING = "http://" + ipTestMachine + "/employees/";
    private static final String HTTP_REQUEST_GET_STUDENT_BY_ID_STRING = "http://" + ipTestMachine + "/students/";
    private static final String HTTP_REQUEST_CRITERIA_BY_ID_STRING = "http://" + ipTestMachine + "/criteria/";
    private static final String HTTP_REQUEST_PROVINCE_ID_STRING = "http://" + ipTestMachine + "/province/";
    private static final String HTTP_REQUEST_PROGRAMME_ID_STRING = "http://" + ipTestMachine + "/programs/";
    private static final String HTTP_REQUEST_LANGUAGES_STRING = "http://" + ipTestMachine + "/criteria/w/languages";
    private static final String HTTP_REQUEST_SKILL_STRING = "http://" + ipTestMachine + "/criteria/w/skills";
    private static final String HTTP_REQUEST_USER_BY_ID_STRING = "http://" + ipTestMachine + "/users/w";
    private static final String HTTP_REQUEST_TIME_SLOTS_USER = "http://" + ipTestMachine + "/users/w/time-slots";
    private static final String HTTP_REQUEST_ALL_MEETING_BY_USER_ID_AND_ACTIVE_CAREER_DAY_ID_STRINGS = "http://" + ipTestMachine + "/career_day/x/users/w/meetingsComplete";
    private static final String HTTP_REQUEST_ALL_MEETING_BY_ENTERPRISE_ID_STRINGS = "http://" + ipTestMachine + "/career_day/x/enterprises/w/meetingsComplete";
    private static final String HTTP_REQUEST_ALL_MEETING_STRINGS = "http://" + ipTestMachine + "/career_day/w/meetingsComplete";
    private static final String HTTP_REQUEST_CAREER_DAY_STRINGS = "http://" + ipTestMachine + "/career_day/is_active";
    private static final String HTTP_REQUEST_USER_ATTENDANCE_STRINGS = "http://" + ipTestMachine + "/user/w/attendance/x";
    private static final String HTTP_REQUEST_CANCEL_MEETING = "http://" + ipTestMachine + "/meetings/w";
    private static final String HTTP_REQUEST_MODIFY_MEETING = "http://" + ipTestMachine + "/meetings/w";
    private static final String HTTP_REQUEST_DELETE_TIMESLOT = "https://" + ipTestMachine + "/time-slots/9";


    //list etudiant participant pour informer les entreprises des etudiant participant
    private static final String HTTP_REQUEST_STUDENT_ATTENDANCE_STRINGS = "http://" + ipTestMachine + "/students/attendance/w";
    //list des entreprises participante
    private static final String HTTP_REQUEST_ENTREPRISE_ATTENDANCE_STRINGS = "http://" + ipTestMachine + "/enterprises/attendance/1";

    private static String data;

    public static void deleteTimeSlotById(String idTimeSlot) {
        String request = HTTP_REQUEST_DELETE_TIMESLOT.replace(REPLACE_CHARACTER_INDICATOR, idTimeSlot);
        AsyncTaskRequestPlus asyncTaskRequestDelete = new AsyncTaskRequestPlus(TimeSlot.class);
        asyncTaskRequestDelete.execute(request);
//        Log.d(TAG, "onClick: data containe : " + data);
    }

    public static void updateMeeting(Meeting meetingObject, Spinner plageHoraireDisponibleDropDown, EditText virtualMeeting, Spinner hoursMeeting) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_MODIFY_MEETING.replace(REPLACE_CHARACTER_INDICATOR, String.valueOf(meetingObject.getId()));
        AsyncTaskRequestUpdate asyncTaskRequestUpdate = new AsyncTaskRequestUpdate(meetingObject, plageHoraireDisponibleDropDown, virtualMeeting, hoursMeeting);
        data = asyncTaskRequestUpdate.execute(request).get();
//        Log.d(TAG, "onClick: data containe : " + data);
    }

    public static void fetchMeetingCancel(String idMeeting) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_CANCEL_MEETING.replace(REPLACE_CHARACTER_INDICATOR, idMeeting);
        AsyncTaskRequestPlus asyncTask = new AsyncTaskRequestPlus(DialogPlagesHoraire.class);
        asyncTask.execute(request);
    }

    public static Boolean fetchUserAttendance(String idUser, String idCareerDay) throws ExecutionException, InterruptedException {
        Boolean toReturn = false;
        String request = HTTP_REQUEST_USER_ATTENDANCE_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        String finalRequest = request.replace("x", idCareerDay);
//        Log.d(TAG, "onCreate: replace string id :" + finalRequest);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(finalRequest).get();
        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        ArrayList<Response> responses = AsyncTaskManager.dataConversion(data, Response.class);
        Log.d(TAG, "fetchUserAttendance: responce boolean : " + Arrays.toString(responses.get(0).getDatalist()));
        if (responses.get(0).getDatalist().equals("true")) {
//            Log.d(TAG, "fetchUserAttendance: je suis entrer");
            toReturn = true;
        }
        return toReturn;
    }

    public static ArrayList<CareerDay> fetchCareerDay() throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(HTTP_REQUEST_CAREER_DAY_STRINGS).get();
        Log.d("debug", "FETCH CareerDay: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, CareerDay.class);
    }

    public static ArrayList<Meeting> fetchAllMeetingByCareerDay(String idCareerDay) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_ALL_MEETING_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idCareerDay);
//        Log.d(TAG, "onCreate: replace string id :" + request);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Meeting.class);
    }

    public static ArrayList<Meeting> fetchAllMeetingsByUserIdAndActiveCareerDayId(String idUser, String idCareerDay) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_ALL_MEETING_BY_USER_ID_AND_ACTIVE_CAREER_DAY_ID_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        String finalRequest = request.replace("x", idCareerDay);
//        Log.d(TAG, "onCreate: replace string id :" + finalRequest);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(finalRequest).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Meeting.class);
    }

    public static ArrayList<Meeting> fetchAllMeetingsByEnterpriseId(String idEnterprise, String idCareerDay) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_ALL_MEETING_BY_ENTERPRISE_ID_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idEnterprise);
        String finalRequest = request.replace("x", idCareerDay);
//        Log.d(TAG, "onCreate: replace string id :" + finalRequest);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(finalRequest).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Meeting.class);
    }

    public static ArrayList<TimeSlot> fetchTimeSlot(String idUser) throws ExecutionException, InterruptedException {
        Log.d(TAG, "fetchTimeSlot: id useer recu = " + idUser);
        String request = HTTP_REQUEST_TIME_SLOTS_USER.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DialogPlagesHoraire.class);
        data = asyncTask.execute(request).get();
//        Log.d("debugApp", "onCreate: fetch data from asyncTask timeSlot = " + data);
        return AsyncTaskManager.dataConversion(data, TimeSlot.class);
    }


    public static ArrayList<User> fetchUserById(String idUser) throws ExecutionException, InterruptedException {
        Log.d(TAG, "fetchUserById: id useer recu = " + idUser);
        String request = HTTP_REQUEST_USER_BY_ID_STRING.replace(REPLACE_CHARACTER_INDICATOR, idUser);
        Log.d(TAG, "fetchUserById: request MODIFIER : " + request);
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(FetchManager.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, User.class);
    }

    public static ArrayList<Entreprise> fetchEnterpriseAttendance(String idEntreprise) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_STUDENT_ATTENDANCE_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idEntreprise);
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Entreprise.class);
    }

    public static ArrayList<Student> fetchStudentAttendances(String idStudent) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_STUDENT_ATTENDANCE_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idStudent);
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Student.class);
    }

    public static ArrayList<Meeting> fetchMeetingsByUserId(String idUserConnected) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_MEETINGS_BY_IDUSER_STRINGS.replace(REPLACE_CHARACTER_INDICATOR, idUserConnected);
//        Log.d(TAG, "onCreate: replace string id :" + request);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Meeting.class);
    }

    public static ArrayList<Meeting> fetchMeetings() throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(HTTP_REQUEST_ALL_MEETINGS_STRING).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Meeting.class);
    }

    public static ArrayList<Meeting> fetchMeetingsById(String idUserConnected) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(Meetings.class);
        data = asyncTask.execute(HTTP_REQUEST_MEETINGS_BY_IDUSER_STRINGS).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Meeting.class);
    }

    public static ArrayList<Entreprise> fetchEntreprises(String idEntreprise) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_ENTREPRISE_ID_STRING + idEntreprise).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Entreprise.class);
    }

    public static ArrayList<Entreprise> fetchEntreprisesById(Employer employer) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_ENTREPRISE_ID_STRING + employer.getIdEntreprise()).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Entreprise.class);
    }

    public static ArrayList<Employer> fetchEmployer(String idUser) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_EMPLOYEE_ID_STRING + idUser).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Employer.class);
    }

    public static ArrayList<Employee> fetchEmployee(String idUser) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_EMPLOYEE_ID_STRING + idUser).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Employee.class);
    }

    public static ArrayList<Student> fetchStudents(String idStudent) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_GET_STUDENT_BY_ID_STRING + idStudent).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.dataConversion(data, Student.class);
    }

    public static ArrayList<Language> fetchLanguage(Criteria criteria) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_LANGUAGES_STRING.replace(REPLACE_CHARACTER_INDICATOR, String.valueOf(criteria.getId()));
//        Log.d(TAG, "onCreate: replace string id :" + request);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.languagesConversion(data, Language.class);
    }

    public static ArrayList<Skill> fetchSkills(Criteria criteria) throws ExecutionException, InterruptedException {
        String request = HTTP_REQUEST_SKILL_STRING.replace(REPLACE_CHARACTER_INDICATOR, String.valueOf(criteria.getId()));
//        Log.d(TAG, "onCreate: replace string id :" + request);

        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(request).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.skillsConversion(data, Skill.class);
    }

    public static ArrayList<Province> fetchProvince(Criteria criteria) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_PROVINCE_ID_STRING + criteria.getId_program()).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.provinceConversion(data, Province.class);
    }

    public static ArrayList<Program> fetchProgram(Criteria criteria) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_PROGRAMME_ID_STRING + criteria.getId_program()).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);
        return AsyncTaskManager.languageConversion(data, Program.class);
    }

    public static ArrayList<Criteria> fetchCriteria(Student student) throws ExecutionException, InterruptedException {
        AsyncTaskRequest asyncTask = new AsyncTaskRequest(DetailEtudiant.class);
        data = asyncTask.execute(HTTP_REQUEST_CRITERIA_BY_ID_STRING + student.getId_criteria()).get();
//        Log.d("debug", "onCreate: fetch data from asyncTask = " + data);

        return AsyncTaskManager.dataConversion(data, Criteria.class);
    }
}
