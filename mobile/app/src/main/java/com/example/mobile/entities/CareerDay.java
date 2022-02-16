package com.example.mobile.entities;

public class CareerDay {
    int id;
    String title;
    String date;
    Boolean is_active;
    int time_start;
    int time_end;
    int meeting_duration;

    public CareerDay() {
    }

    public int getId() {
        return id;
    }

    public int getTime_start() {
        return time_start;
    }

    public int getTime_end() {
        return time_end;
    }

    public int getMeeting_duration() {
        return meeting_duration;
    }

    public String getTitle() {
        return title;
    }

    public String getDate() {
        return date;
    }

    public Boolean getIs_active() {
        return is_active;
    }



}
