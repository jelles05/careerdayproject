package com.example.mobile.entities;

import java.util.ArrayList;

public class Employee extends User {

    ArrayList<String> time_slot;
    int idEntreprise;

    Employee() {
        super();
    }

    public ArrayList<String> getTime_slot() {
        return time_slot;
    }

    public int getIdEntreprise() {
        return idEntreprise;
    }
}
