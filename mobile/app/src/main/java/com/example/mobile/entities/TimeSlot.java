package com.example.mobile.entities;
public class TimeSlot {
    int id;
    int id_user;
    String time_slot;
    public TimeSlot(int id, int id_user, String time_slot) {
        this.id = id;
        this.id_user = id_user;
        this.time_slot = time_slot;
    }
    public int getId() {
        return id;
    }
    public int getId_user() {
        return id_user;
    }
    public String getTime_slot() {
        return time_slot;
    }
}
