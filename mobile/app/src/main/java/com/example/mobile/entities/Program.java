package com.example.mobile.entities;

public class Program {
    int id;
    String program;

    public Program(int id, String program) {
        this.id = id;
        this.program = program;
    }

    public int getId() {
        return id;
    }

    public String getProgram() {
        return program;
    }
}
