package com.example.mobile.entities;
public class ResponseAttendance {
    private int status_code;
    private String message;
    private Boolean data;
    public ResponseAttendance(int status_code, String message, Boolean data) {
        this.status_code = status_code;
        this.message = message;
        this.data = data;
    }
    public int getStatus_code() {
        return status_code;
    }
    public String getMessage() {
        return message;
    }
    public Boolean getDataAttendance() {
        return data;
    }
}
