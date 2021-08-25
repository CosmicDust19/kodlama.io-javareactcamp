package com.finalproject.hrmsbackend.core.adapters.concretes;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.finalproject.hrmsbackend.core.adapters.abstracts.CloudinaryService;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Component
public class CloudinaryServiceAdapter implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryServiceAdapter() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "cloudinary73",
                "api_key", "679978937925928",
                "api_secret", "UqnesSlyURtTNFsomM0H_x4INNU",
                "secure", true));
    }

    @Override
    public Map<?, ?> upload(MultipartFile multipartFile) {
        try {
            return cloudinary.uploader().upload(convert(multipartFile), ObjectUtils.emptyMap());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Map<?, ?> delete(String id) {
        try {
            return cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public File convert(MultipartFile multipartFile) {
        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
        try {
            FileOutputStream stream = new FileOutputStream(file);
            stream.write(multipartFile.getBytes());
            stream.close();
            return file;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

}
