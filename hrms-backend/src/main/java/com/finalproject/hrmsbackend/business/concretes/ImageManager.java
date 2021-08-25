package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.ImageService;
import com.finalproject.hrmsbackend.core.adapters.abstracts.CloudinaryService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.ImageDao;
import com.finalproject.hrmsbackend.entities.concretes.Image;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageManager implements ImageService {

    private final ImageDao imageDao;
    private final CloudinaryService cloudinaryService;
    private final CheckService check;

    @Override
    public DataResult<Image> getById(int imgId) {
        return new SuccessDataResult<>(imageDao.getById(imgId));
    }

    @Override
    public DataResult<Image> getByPublicId(String publicId) {
        return new SuccessDataResult<>(imageDao.getByPublicId(publicId));
    }

    @Override
    public Result upload(MultipartFile multipartFile, int userId) {
        Result uploadErr = check.validateImage(multipartFile);
        if (uploadErr != null) return uploadErr;

        Map<?, ?> uploadRes = cloudinaryService.upload(multipartFile);
        if (uploadRes == null) return new ErrorResult(Msg.UPLOAD_ERROR.get());

        Image image = new Image(0, (String) uploadRes.get("public_id"), (String) uploadRes.get("original_filename"), new User(userId), (String) uploadRes.get("url"));
        Image savedImg = imageDao.save(image);
        return new SuccessDataResult<>(Msg.UPLOADED.get(), savedImg);
    }

    @Override
    public Result deleteById(int imgId) {
        if (check.notExistsById(imageDao, imgId)) return new ErrorResult(Msg.NOT_EXIST.get("imgId"));
        Image image = imageDao.getById(imgId);

        Map<?, ?> uploadRes = cloudinaryService.delete(image.getPublicId());
        if (uploadRes == null)
            return new ErrorDataResult<>(Msg.DELETE_ERROR.get(), Msg.EXTERNAL_INTERVENTION.get("Image"));

        imageDao.deleteById(imgId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result deleteByPublicId(String publicId) {
        Map<?, ?> uploadRes = cloudinaryService.delete(publicId);
        if (uploadRes == null) return new ErrorDataResult<>(Msg.NOT_EXIST.get("publicId"));

        imageDao.deleteByPublicId(publicId);
        return new SuccessResult(Msg.DELETED.get());
    }
}