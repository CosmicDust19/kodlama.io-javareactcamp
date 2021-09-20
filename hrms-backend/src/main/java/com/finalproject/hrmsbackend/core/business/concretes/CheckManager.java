package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

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
    public boolean invalidDateFormat(String date) {
        return date == null || !Pattern.matches(Utils.Const.DATE_REGEXP, date);
    }

    @Override
    public boolean startEndConflict(short start, Short end) {
        return end != null && start > end;
    }

    @Override
    public boolean equals(String x, String y) {
        return (x == null && y == null) || (x != null && x.equals(y));
    }

    @Override
    public boolean equals(Integer x, Integer y) {
        return (x == null && y == null) || (x != null && x.equals(y));
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

}
