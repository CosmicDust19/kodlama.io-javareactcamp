package com.hrms.hw.entities.concretes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "system_employees")
@PrimaryKeyJoinColumn(name = "system_employee_id", referencedColumnName = "id")
public class SystemEmployee extends User {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    public SystemEmployee(int id, String email, String password, String firstName, String lastName){
        super(id,email,password);
        this.firstName = firstName;
        this.lastName = lastName;
    }

}
