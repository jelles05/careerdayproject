package com.example.mobile.entities;

public class Meeting {
    int id;
    String program;
    String enterprise_name;
    String logo_url;
    int room;
    String employee_name;
    String student_name;
    int id_employee;
    int id_student;
    String virtual_meeting_url;
    String date_time;
    int id_meeting_type;
    int id_career_day;


    public String getDate_time() {
        return date_time;
    }

    public Meeting() {
    }

    public int getId() {
        return id;
    }

    public String getVirtualMeetingUrl() {
        return virtual_meeting_url;
    }

    public String getProgram() {
        return program;
    }


    public String getEnterprise_name() {
        return enterprise_name;
    }

    public String getLogo_url() {
        return logo_url;
    }

    public int getRoom() {
        return room;
    }

    public String getEmployee_name() {
        return employee_name;
    }

    public String getStudent_name() {
        return student_name;
    }

    public int getId_employee() {
        return id_employee;
    }

    public int getId_student() {
        return id_student;
    }

    public String getVirtual_meeting_url() {
        return virtual_meeting_url;
    }

    public int getId_meeting_type() {
        return id_meeting_type;
    }

    public int getId_career_day() {
        return id_career_day;
    }
}
