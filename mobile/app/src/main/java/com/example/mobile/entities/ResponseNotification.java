package com.example.mobile.entities;
public class ResponseNotification {
    private int status_code;
    private String message;
    private Object[] notifications;


    public ResponseNotification(int status_code, String message, Object[] notifications) {
        this.status_code = status_code;
        this.message = message;
        this.notifications = notifications;
    }
    public int getStatus_code() {
        return status_code;
    }
    public String getMessage() {
        return message;
    }
    public Object[] getNotifications() {
        return notifications;
    }
}
