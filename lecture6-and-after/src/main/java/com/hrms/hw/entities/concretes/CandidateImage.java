package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "candidates_images")
public class CandidateImage {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_images_id_generator")
    @SequenceGenerator(name = "candidates_images_id_generator", sequenceName = "candidates_images_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @JsonIgnore
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
