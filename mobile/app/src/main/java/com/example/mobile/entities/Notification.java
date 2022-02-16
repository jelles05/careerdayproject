
package com.example.mobile.entities;
public class Notification {

    int id;
    String date;
    int id_user;
    Boolean is_read;
    String title;
    String student_name;
    String employee_name;
    String enterprise_name;
    public Notification(int id, String date, int id_user, Boolean is_read, String title, String student_name, String employee_name, String enterprise_name) {
        this.id = id;
        this.date = date;
        this.id_user = id_user;
        this.is_read = is_read;
        this.title = title;
        this.student_name = student_name;
        this.employee_name = employee_name;
        this.enterprise_name = enterprise_name;
    }
    public int getId() {
        return id;
    }
    public String getDate() {
        return date;
    }
    public int getId_user() {
        return id_user;
    }
    public Boolean getIs_read() {
        return is_read;
    }
    public String getTitle() {
        return title;
    }
    public String getStudent_name() {
        return student_name;
    }
    public String getEmployee_name() {
        return employee_name;
    }
    public String getEnterprise_name() {
        return enterprise_name;
    }
}



