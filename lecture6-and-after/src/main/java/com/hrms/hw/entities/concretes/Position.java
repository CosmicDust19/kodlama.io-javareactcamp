package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "positions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "jobAdvertisements"})
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "detail")
    private String detail;

    @JsonIgnore
    @OneToMany(mappedBy = "position")
    private List<JobAdvertisement> jobAdvertisements;

    @JsonIgnore
    @Column(name = "created_at")
    private LocalDate createdAt;

    public Position(int id) {
        this.id = id;
    }
}
