package com.example.mobile.managers;

import android.util.Log;
import android.widget.TextView;

import com.example.mobile.entities.Response;
import com.google.gson.Gson;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;

public class AsyncTaskManager {

    public static <c> ArrayList<c> dataConversion(String data, Type classType) {
        Gson json = new Gson();
        Response response = json.fromJson(data, Response.class);
        Class c = classType.getClass();
        ArrayList<c> arrayList = new ArrayList<>();
        if (response.getDatalist() != null) {
            for (Object o : response.getDatalist()) {
                String responseDatas = json.toJson(o);
                c object = json.fromJson(responseDatas, classType);
                arrayList.add(object);
            }
            Log.d("debug", "dataConversion: From manager: arraySize Return: " + arrayList.size());
        }
        return arrayList;
    }

    public static <c> ArrayList<c> languageConversion(String data, Type classType) {
        Gson json = new Gson();
        Response response = json.fromJson(data, Response.class);
        Class c = classType.getClass();
        ArrayList<c> arrayList = new ArrayList<>();

        for (Object o : response.getLanguage()) {
            String responseDatas = json.toJson(o);
            c object = json.fromJson(responseDatas, classType);
            arrayList.add(object);
        }
        Log.d("debug", "languageCponvertion: From manager: arraySize Return: " + arrayList.size());
        return arrayList;
    }

    public static <c> ArrayList<c> languagesConversion(String data, Type classType) {
        Gson json = new Gson();
        Response response = json.fromJson(data, Response.class);
        Class c = classType.getClass();
        ArrayList<c> arrayList = new ArrayList<>();

        for (Object o : response.getLanguages()) {
            String responseDatas = json.toJson(o);
            c object = json.fromJson(responseDatas, classType);
            arrayList.add(object);
        }
        Log.d("debug", "languageCponvertion: From manager: arraySize Return: " + arrayList.size());
        return arrayList;
    }

    public static <c> ArrayList<c> provinceConversion(String data, Type classType) {
        Gson json = new Gson();
        Response response = json.fromJson(data, Response.class);
        Class c = classType.getClass();
        ArrayList<c> arrayList = new ArrayList<>();

        for (Object o : response.getProvince()) {
            String responseDatas = json.toJson(o);
            c object = json.fromJson(responseDatas, classType);
            arrayList.add(object);
        }
        Log.d("debug", "languageCponvertion: From manager: arraySize Return: " + arrayList.size());
        return arrayList;
    }

    public static <c> ArrayList<c> skillsConversion(String data, Type classType) {
        Gson json = new Gson();
        Response response = json.fromJson(data, Response.class);
        Class c = classType.getClass();
        ArrayList<c> arrayList = new ArrayList<>();

        for (Object o : response.getSkills()) {
            String responseDatas = json.toJson(o);
            c object = json.fromJson(responseDatas, classType);
            arrayList.add(object);
        }
        Log.d("debug", "languageCponvertion: From manager: arraySize Return: " + arrayList.size());
        return arrayList;
    }

    //faire un manager pour set laffichage avec les datas recu
    //les array son dependant de lordre des index de chacun
    public static void afficherUI(ArrayList<TextView> arrayUI, ArrayList<Method> arrayFunction, Object obj) {
        if (arrayUI.size() == arrayFunction.size()) {
            for (int i = 0; i < arrayUI.size(); i++) {
                String data = null;
//                entrepriseName.setText(e.getName());
//                tvDescription.setText(e.getDescription());
//                tvMission.setText(e.getMission());
//                tvTargetEmploye.setText(e.getEmployee_target());
                try {
                    data = (String) arrayFunction.get(i).invoke(obj);
                } catch (IllegalAccessException | InvocationTargetException e) {
                    e.printStackTrace();
                }
                arrayUI.get(i).setText(data);
                //Log.d("debug", "afficherUI: object " + arrayFunction.get(i) + " data insert in tv :" + data);
            }
        }
    }
}
