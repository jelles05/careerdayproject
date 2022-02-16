package com.example.mobile.entities;
public class ResponseV2 {

    private int status_code;
    private String message;
    private Object[] data;
    public ResponseV2(int status_code, String message, Object[] data) {
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
    public Object[] getDataAttendance() {
        return data;
    }
}
