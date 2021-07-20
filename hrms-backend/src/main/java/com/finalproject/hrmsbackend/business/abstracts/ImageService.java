package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.Result;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    Result upload(MultipartFile multipartFile, int userId);

    Result deleteById(int id);

    Result deleteByPublicId(String publicId);

}
