package com.finalproject.hrmsbackend.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.entities.concretes.Image;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements BaseEntity<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_generator")
    @SequenceGenerator(name = "users_id_generator", sequenceName = "users_id_seq", allocationSize = 1, initialValue = 10)
    @Column(name = "id")
    private Integer id;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @JsonIgnore
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @OneToOne
    @JoinColumn(name = "profile_img_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"user"})
    private Image profileImg;

    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties(value = {"user"})
    @ToString.Exclude
    private List<Image> images;

    @JsonIgnore
    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

    public User(int id) {
        this.id = id;
    }

}