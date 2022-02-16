package com.example.mobile.entities;

public class Language {
    int id;
    String language_name;
    int id_language;
    int id_criteria;

    public Language(int id, String language_name, int id_language, int id_criteria) {
        this.id = id;
        this.language_name = language_name;
        this.id_language = id_language;
        this.id_criteria = id_criteria;
    }

    public int getId() {
        return id;
    }

    public String getLanguage_name() {
        return language_name;
    }

    public int getId_language() {
        return id_language;
    }

    public int getId_criteria() {
        return id_criteria;
    }
}
