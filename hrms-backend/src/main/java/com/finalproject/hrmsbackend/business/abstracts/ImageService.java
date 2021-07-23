package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Image;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    DataResult<Image> getById(int imgId);

    DataResult<Image> getByPublicId(String publicId);

    Result upload(MultipartFile multipartFile, int userId);

    Result deleteById(int imgId);

    Result deleteByPublicId(String publicId);

}
