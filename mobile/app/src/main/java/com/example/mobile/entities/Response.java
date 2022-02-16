package com.example.mobile.entities;

public class Response {
    private int status_code;
    private String message;
    private Object[] data;
    private Object[] language;
    private Object[] languages;
    private Object[] province;
    private Object[] skills;

    public Response() {
    }

    public Response(int status_code, String message, Object[] data, Object[] language, Object[] province, Object[] skills, Object[] languages) {
        this.status_code = status_code;
        this.message = message;
        this.data = data;
        this.language = language;
        this.languages = languages;
        this.province = province;
        this.skills = skills;
    }

    public int getStatusCode() {
        return status_code;
    }

    public void setStatusCode(int status_code) {
        this.status_code = status_code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object[] getDatalist() {
        return data;
    }

    public void setDatalist(Object[] dataList) {
        this.data = dataList;
    }

    public Object[] getLanguage() {
        return language;
    }

    public Object[] getProvince() {
        return province;
    }

    public Object[] getSkills() {
        return skills;
    }

    public Object[] getLanguages() {
        return languages;
    }
}

