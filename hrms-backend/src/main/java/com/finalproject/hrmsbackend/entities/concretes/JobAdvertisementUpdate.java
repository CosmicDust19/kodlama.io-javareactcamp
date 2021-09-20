package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "job_advertisements_update", uniqueConstraints = {@UniqueConstraint(columnNames = {"employer_id", "position_id", "job_description", "city_id"})})
@JsonIgnoreProperties("hibernateLazyInitializer")
public class JobAdvertisementUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_adv_update_id_generator")
    @SequenceGenerator(name = "job_adv_update_id_generator", sequenceName = "job_adv_update_id_seq", allocationSize = 1)
    @Column(name = "job_adv_update_id")
    private Integer updateId;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    @JsonIgnoreProperties(value = {"jobAdvertisements", "password"})
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "position_id")
    @JsonIgnoreProperties(value = {"jobAdvertisements"})
    private Position position;

    @Column(name = "job_description")
    private String jobDescription;

    @ManyToOne
    @JoinColumn(name = "city_id")
    @JsonIgnoreProperties(value = {"jobAdvertisements"})
    private City city;

    @Column(name = "min_salary")
    private Double minSalary;

    @Column(name = "max_salary")
    private Double maxSalary;

    @Column(name = "open_positions")
    private Short openPositions;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "work_model", length = Utils.Const.MAX_JOB_ADV_WORK_MODEL)
    private String workModel;

    @Column(name = "work_time", length = Utils.Const.MAX_JOB_ADV_WORK_TIME)
    private String workTime;

}
