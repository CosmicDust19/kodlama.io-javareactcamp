package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "job_advertisements",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"employer_id", "position_id", "job_description", "city_id"})})
@JsonIgnoreProperties("hibernateLazyInitializer")
public class JobAdvertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_advertisements_id_generator")
    @SequenceGenerator(name = "job_advertisements_id_generator", sequenceName = "job_advertisements_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    @JsonIgnoreProperties(value = {"jobAdvertisements", "password"})
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    @JsonIgnoreProperties(value = {"jobAdvertisements"})
    private Position position;

    @Column(name = "job_description", nullable = false)
    private String jobDescription;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    @JsonIgnoreProperties(value = {"jobAdvertisements"})
    private City city;

    @Column(name = "min_salary")
    private Double minSalary;

    @Column(name = "max_salary")
    private Double maxSalary;

    @Column(name = "number_of_people_to_be_hired", nullable = false)
    private short numberOfPeopleToBeHired;

    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @Column(name = "work_model", nullable = false)
    private String workModel;

    @Column(name = "work_time", nullable = false)
    private String workTime;

    @Column(name = "is_active", nullable = false)
    private boolean activationStatus = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at")
    private LocalDate lastModifiedAt;

}
