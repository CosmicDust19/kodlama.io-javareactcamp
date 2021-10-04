package com.finalproject.hrmsbackend.core.business.abstracts;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckService;

import java.util.Map;

public interface CheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void notTheSame(Number oldItem, Number newItem, String itemName);

    void notTheSame(String oldItem, String newItem, String itemName);

    void existsPositionById(Short positionId);

    void existsSchoolById(Integer schoolId);

    void existsDepartmentById(Short departmentId);

    void existsLanguageById(Short languageId);

    void existsSkillById(Short skillId);

    void existsCityById(Short cityId);

    void noStartEndYearConflict(Short startYear, Short graduationYear);

    void noMinMaxConflict(Double min, Double max);
}
