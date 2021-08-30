package com.finalproject.hrmsbackend.core.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.Result;
import org.springframework.data.repository.CrudRepository;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public interface CheckService {
    boolean notExistsById(CrudRepository<?, Integer> dao, Integer id);

    boolean notExistsById(CrudRepository<?, Short> dao, Short id);

    boolean invalidLength(String value, int min, int max);

    boolean invalidRange(Double value, double min, double max);

    boolean invalidRange(Short value, int min, int max);

    boolean invalidDateFormat(String date);

    boolean startEndConflict(short start, Short end);

    boolean equals(String x, String y);

    boolean equals(Integer x, Integer y);

    boolean equals(Double num1, Double num2);

    boolean equals(Short x, Short y);

    boolean equals(LocalDate x, LocalDate y);

    boolean greater(Double num1, Double num2);

    Result validateImage(MultipartFile multipartFile);
}
