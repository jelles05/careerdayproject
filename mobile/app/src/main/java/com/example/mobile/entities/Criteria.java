package com.example.mobile.entities;

public class Criteria {
    int id;
    String id_province;
    Boolean work_from_home;
    String id_program;
    String work_start_date;

    public Criteria(int id, String id_province, Boolean work_from_home, String id_program, String work_start_date) {
        this.id = id;
        this.id_province = id_province;
        this.work_from_home = work_from_home;
        this.id_program = id_program;
        this.work_start_date = work_start_date;
    }

    public int getId() {
        return id;
    }

    public String getId_province() {
        return id_province;
    }

    public Boolean getWork_from_home() {
        return work_from_home;
    }

    public String getId_program() {
        return id_program;
    }

    public String getWork_start_date() {
        return work_start_date;
    }
}
