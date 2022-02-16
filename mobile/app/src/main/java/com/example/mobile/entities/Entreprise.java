package com.example.mobile.entities;

public class Entreprise {
    private int id;
    private String description;
    private String mission;
    private int room;
    private String employe_target;
    private String name;
    private String logo_url;
    private String video_url;
    private String videoId;

    public Entreprise() {
    }

    public Entreprise(int id, String description, String mission, int room, String employe_target, String name, String logo_url, String video_url) {
        this.id = id;
        this.description = description;
        this.mission = mission;
        this.room = room;
        this.employe_target = employe_target;
        this.name = name;
        this.logo_url = logo_url;
        this.video_url = video_url;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getEmploye_target() {
        return employe_target;
    }

    public String getVideo_url() {
        return video_url;
    }

    public String getLogo_url() {
        return logo_url;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMission() {
        return mission;
    }

    public void setMission(String mission) {
        this.mission = mission;
    }

    public int getRoom() {
        return room;
    }

    public void setRoom(int room) {
        this.room = room;
    }

    public String getEmployee_target() {
        return employe_target;
    }

    public void setEmployee_target(String employee_target) {
        this.employe_target = employee_target;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
