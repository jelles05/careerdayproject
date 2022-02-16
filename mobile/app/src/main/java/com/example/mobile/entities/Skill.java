package com.example.mobile.entities;

public class Skill {
    int id;
    String skill_name;
    String id_skill;
    String id_criteria;

    public Skill(int id, String skill_name, String id_skill, String id_criteria) {
        this.id = id;
        this.skill_name = skill_name;
        this.id_skill = id_skill;
        this.id_criteria = id_criteria;
    }

    public int getId() {
        return id;
    }

    public String getSkill_name() {
        return skill_name;
    }

    public String getId_skill() {
        return id_skill;
    }

    public String getId_criteria() {
        return id_criteria;
    }
}
