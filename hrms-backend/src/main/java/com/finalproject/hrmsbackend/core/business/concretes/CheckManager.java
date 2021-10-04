package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckManager extends BaseCheckManager implements CheckService {

    private final PositionDao positionDao;
    private final SchoolDao schoolDao;
    private final DepartmentDao departmentDao;
    private final LanguageDao languageDao;
    private final SkillDao skillDao;
    private final CityDao cityDao;

    @SneakyThrows
    @Override
    public void notTheSame(Number oldItem, Number newItem, String itemName) {
        if (CheckUtils.equals(oldItem, newItem))
            throw new EntityNotExistsException(Msg.IS_THE_SAME.get(itemName != null ? itemName : "It"));
    }

    @SneakyThrows
    @Override
    public void notTheSame(String oldItem, String newItem, String itemName) {
        if (CheckUtils.equals(oldItem, newItem))
            throw new EntityNotExistsException(Msg.IS_THE_SAME.get(itemName != null ? itemName : "It"));
    }

    @SneakyThrows
    @Override
    public void existsPositionById(Short positionId) {
        if (CheckUtils.notExistsById(positionDao, positionId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Position"));
    }

    @SneakyThrows
    @Override
    public void existsSchoolById(Integer schoolId) {
        if (CheckUtils.notExistsById(schoolDao, schoolId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("School"));
    }

    @SneakyThrows
    @Override
    public void existsDepartmentById(Short departmentId) {
        if (CheckUtils.notExistsById(departmentDao, departmentId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Department"));
    }

    @SneakyThrows
    @Override
    public void existsLanguageById(Short languageId) {
        if (CheckUtils.notExistsById(languageDao, languageId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Language"));
    }

    @SneakyThrows
    @Override
    public void existsSkillById(Short skillId) {
        if (CheckUtils.notExistsById(skillDao, skillId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Skill"));
    }

    @SneakyThrows
    @Override
    public void existsCityById(Short cityId) {
        if (CheckUtils.notExistsById(cityDao, cityId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("City"));
    }

    @Override
    public void noStartEndYearConflict(Short startYear, Short endYear) {
        if (CheckUtils.startEndConflict(startYear, endYear))
            errors.put("startGradYear", Msg.START_END_YEAR_CONFLICT.get());
    }

    @Override
    public void noMinMaxConflict(Double min, Double max) {
        if (CheckUtils.greater(min, max))
            errors.put("minMaxSalary", Msg.MIN_MAX_CONFLICT.get());
    }

}
