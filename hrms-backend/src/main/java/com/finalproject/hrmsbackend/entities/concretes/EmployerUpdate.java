package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "employers_updates")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EmployerUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employer_update_id_generator")
    @SequenceGenerator(name = "employer_update_id_generator", sequenceName = "employer_update_id_seq", allocationSize = 1)
    @Column(name = "employer_update_id")
    private Integer updateId;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "company_name", length = Utils.Const.MAX_COMPANY_NAME)
    private String companyName;

    @Column(name = "website", length = 200)
    private String website;

    @Column(name = "phone_number", length = 22)
    private String phoneNumber;

}
