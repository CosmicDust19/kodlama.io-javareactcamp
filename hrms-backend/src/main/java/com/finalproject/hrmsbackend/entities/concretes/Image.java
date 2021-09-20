package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.entities.User;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "Images")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Image implements BaseEntity<Integer> {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "images_id_generator")
    @SequenceGenerator(name = "images_id_generator", sequenceName = "images_id_seq", allocationSize = 1)
    private Integer id;

    @Column(name = "public_id", nullable = false, length = 30)
    private String publicId;

    @Column(name = "name", length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = {"image"})
    private User user;

    @Column(name = "image_url", nullable = false, length = 150)
    private String imageUrl;

    @Column(name = "width")
    private Short width;

    @Column(name = "height")
    private Short height;

    public Image(Integer id) {
        this.id = id;
    }
}
