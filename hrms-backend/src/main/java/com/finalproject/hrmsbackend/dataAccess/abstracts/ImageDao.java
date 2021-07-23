package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageDao extends JpaRepository<Image, Integer> {

    Image getByPublicId(String publicId);

    void deleteByPublicId(String publicId);

}
