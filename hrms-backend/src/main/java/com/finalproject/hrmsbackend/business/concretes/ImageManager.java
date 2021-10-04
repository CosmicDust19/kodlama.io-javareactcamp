package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.ImageService;
import com.finalproject.hrmsbackend.core.adapters.abstracts.CloudinaryService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.dataAccess.abstracts.UserDao;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.ImageDao;
import com.finalproject.hrmsbackend.entities.concretes.Image;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageManager implements ImageService {

    private final ImageDao imageDao;
    private final UserCheckService userCheck;
    private final CloudinaryService cloudinaryService;

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
        userCheck.existsUserById(userId);
        if (multipartFile == null || multipartFile.isEmpty()) return new ErrorResult(Msg.NOT_FOUND.get("File"));

        int width, height;
        try {
            BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
            if (bufferedImage == null) return new ErrorResult(Msg.NOT_AN_IMAGE.get());
            width = bufferedImage.getWidth();
            height = bufferedImage.getHeight();
        } catch (IOException exception) {
            return new ErrorResult(Msg.IMG_VALIDATION_ERR.get());
        }

        Map<?, ?> uploadRes = cloudinaryService.upload(multipartFile);
        if (uploadRes == null) return new ErrorResult(Msg.UPLOAD_ERROR.get());

        Image image = new Image(0, (String) uploadRes.get("public_id"), (String) uploadRes.get("original_filename"),
                new User(userId), (String) uploadRes.get("url"), (short) width, (short) height);
        Image savedImg = imageDao.save(image);
        return new SuccessDataResult<>(Msg.UPLOADED.get(), savedImg);
    }

    @Override
    public Result deleteById(int imgId) {
        if (CheckUtils.notExistsById(imageDao, imgId)) return new ErrorResult(Msg.NOT_EXIST.get("imgId"));
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
