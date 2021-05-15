package com.hrms.lecture6hw2.entities.concretes;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "positions")
public class Position {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "detail")
    private String detail;

    public Position(int id, String title, String detail) {
        this.id = id;
        this.title = title;
        this.detail = detail;
    }

    public Position() {

    }
}
