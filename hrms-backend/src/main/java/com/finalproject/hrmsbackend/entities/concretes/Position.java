package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "positions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Position implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "positions_id_generator")
    @SequenceGenerator(name = "positions_id_generator", sequenceName = "positions_id_seq", allocationSize = 1, initialValue = 25)
    @Column(name = "id")
    private Short id;

    @Column(name = "title", nullable = false, unique = true, length = Utils.Const.MAX_POSITION_TITLE)
    private String title;

    @JsonIgnore
    @OneToMany(mappedBy = "position")
    @JsonIgnoreProperties(value = {"position"})
    @ToString.Exclude
    private List<JobAdvertisement> jobAdvertisements;

    public Position(short id) {
        this.id = id;
    }

    public Position(String title) {
        this.title = title;
    }

}
