package com.example.mobile.entities;
public class User {
    private int id;
    private int id_role;
    private String email;
    private String password;
    private String last_name;
    private String name;

    public User() {
    }

    public User(int id, int id_role, String email, String password, String last_name, String name) {
        this.id = id;
        this.id_role = id_role;
        this.email = email;
        this.password = password;
        this.last_name = last_name;
        this.name = name;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getId_role() {
        return id_role;
    }
    public void setId_role(int id_role) {
        this.id_role = id_role;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getLast_name() {
        return last_name;
    }
    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
