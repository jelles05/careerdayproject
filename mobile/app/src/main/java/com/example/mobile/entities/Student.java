package com.example.mobile.entities;

import java.util.ArrayList;

public class Student extends User {
    String cv_url;
    String biography;
    String profile_image_url;
    String id_criteria;
//    ArrayList<TimeSlot> timeSlots;


    Student() {
        super();
    }

    public String getId_criteria() {
        return id_criteria;
    }

    public String getCvUrl() {
        return cv_url;
    }

    public void setCvUrl(String cv_url) {
        this.cv_url = cv_url;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getProfileImageUrl() {
        return profile_image_url;
    }

    public void setProfileImageUrl(String profile_image_url) {
        this.profile_image_url = profile_image_url;
    }
}
