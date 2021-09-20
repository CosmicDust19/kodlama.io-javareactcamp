package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "job_advertisements", uniqueConstraints = {@UniqueConstraint(columnNames = {"employer_id", "position_id", "job_description", "city_id"})})
@JsonIgnoreProperties("hibernateLazyInitializer")
public class JobAdvertisement implements BaseEntity<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_advertisements_id_generator")
    @SequenceGenerator(name = "job_advertisements_id_generator", sequenceName = "job_advertisements_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

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

    @Column(name = "open_positions", nullable = false)
    private short openPositions;

    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    @Column(name = "work_model", nullable = false, length = Utils.Const.MAX_JOB_ADV_WORK_MODEL)
    private String workModel;

    @Column(name = "work_time", nullable = false, length = Utils.Const.MAX_JOB_ADV_WORK_TIME)
    private String workTime;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "job_adv_update_id")
    private JobAdvertisementUpdate jobAdvertisementUpdate;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Column(name = "rejected")
    private Boolean rejected;

    @Column(name = "update_verified")
    private Boolean updateVerified;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

}
