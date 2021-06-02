package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "positions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "jobAdvertisements"})
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "positions_id_generator")
    // i am starting the sequence from 26 because i inserted some positions to the table for the testing purposes
    @SequenceGenerator(name = "positions_id_generator", sequenceName = "positions_id_seq", allocationSize = 1, initialValue = 26)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @NotBlank(message = "This field can't be empty.")
    @Column(name = "title", unique = true)
    private String title;

    @JsonIgnore
    @OneToMany(mappedBy = "position")
    private List<JobAdvertisement> jobAdvertisements;

    public Position(short id) {
        this.id = id;
    }
}
