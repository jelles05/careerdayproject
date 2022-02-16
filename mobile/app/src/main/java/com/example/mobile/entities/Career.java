package com.example.mobile.entities;
public class Career {
    int id;
    String title;
    String date;
    Boolean is_active;
    int time_start;
    int time_end;
    int meeting_duration;
    public Career(int id, String title, String date, Boolean is_active, int time_start, int time_end, int meeting_duration) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.is_active = is_active;
        this.time_start = time_start;
        this.time_end = time_end;
        this.meeting_duration = meeting_duration;
    }
    public int getId() {
        return id;
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
    public int getTime_start() {
        return time_start;
    }
    public int getTime_end() {
        return time_end;
    }
    public int getMeeting_duration() {
        return meeting_duration;
    }
}
