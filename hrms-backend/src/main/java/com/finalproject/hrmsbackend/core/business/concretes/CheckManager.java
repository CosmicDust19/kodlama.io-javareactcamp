package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.time.LocalDate;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CheckManager implements CheckService {

    @Override
    public boolean notExistsById(CrudRepository<?, Integer> dao, Integer id) {
        return id == null || id <= 0 || !dao.existsById(id);
    }

    @Override
    public boolean notExistsById(CrudRepository<?, Short> dao, Short id) {
        return id == null || id <= 0 || !dao.existsById(id);
    }

    @Override
    public boolean invalidLength(String value, int min, int max) {
        return value == null || value.length() < min || value.length() > max;
    }

    @Override
    public boolean invalidRange(Double value, double min, double max) {
        return value == null || value < min || value > max;
    }

    @Override
    public boolean invalidRange(Short value, int min, int max) {
        return value == null || value < min || value > max;
    }

    @Override
    public boolean invalidDateFormat(String date) {
        return date == null || !Pattern.matches(Utils.Const.DATE_REGEXP, date);
    }

    @Override
    public boolean startEndConflict(short start, Short end) {
        return end != null && start > end;
    }

    @Override
    public boolean equals(Double x, Double y) {
        return (x == null && y == null) || (x != null && x.equals(y));
    }

    @Override
    public boolean equals(Short x, Short y) {
        return (x == null && y == null) || (x != null && x.equals(y));
    }

    @Override
    public boolean equals(LocalDate x, LocalDate y) {
        return (x == null && y == null) || (x != null && x.isEqual(y));
    }

    @Override
    public boolean greater(Double greater, Double less) {
        return greater != null && less != null && greater > less;
    }

    @Override
    public Result validateImage(MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) return new ErrorResult(MSGs.NOT_FOUND.get("file"));
        try {
            if (ImageIO.read(multipartFile.getInputStream()) == null) return new ErrorResult(MSGs.NOT_AN_IMAGE.get());
            //only BMP, GIF, JPG and PNG are recognized
        } catch (IOException exception) {
            return new ErrorResult(MSGs.IMG_VALIDATION_ERR.get());
        }
        return null;
    }

}
