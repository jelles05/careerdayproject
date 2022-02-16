package com.example.mobile.entities;

public class Employer extends User {
    int id_enterprise;

    Employer() {
        super();
    }

    public String getIdEntreprise() {
        return String.valueOf(id_enterprise);
    }
}
