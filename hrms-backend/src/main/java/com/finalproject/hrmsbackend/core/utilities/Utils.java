package com.finalproject.hrmsbackend.core.utilities;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@UtilityClass
public class Utils {

    @UtilityClass
    public class CheckType {
        public final String ALL = "ALL";
        public final String PARTLY = "PARTLY";
    }

    @UtilityClass
    public class UpdateType {
        public final String DEL = "DEL";
        public final String ADD = "ADD";
    }

    @UtilityClass
    public class Const {

        public static final int MIN_FN = 2;
        public static final int MAX_FN = 50;
        public static final int MIN_LN = 2;
        public static final int MAX_LN = 50;
        public static final int MIN_PW = 6;
        public static final int MAX_PW = 20;
        public static final int MIN_ACCOUNT_LINK = 4;
        public static final int MAX_ACCOUNT_LINK = 100;
        public static final int MAX_WORKPLACE = 100;
        public static final int MAX_CV_TITLE = 50;
        public static final int MAX_CV_COVER_LETTER = 1000;
        public static final int MAX_COMPANY_NAME = 100;
        public static final int MIN_YEAR = 1900;
        public static final int THIS_YEAR = 2021;
        public static final int MAX_JOB_ADV_WORK_MODEL = 20;
        public static final int MAX_JOB_ADV_WORK_TIME = 20;
        public static final int MAX_CITY_NAME = 50;
        public static final int MAX_POSITION_TITLE = 100;
        public static final int MAX_LANGUAGE_NAME = 50;
        public static final int MAX_SCHOOL_NAME = 100;
        public static final int MAX_DEPARTMENT_NAME = 100;
        public static final int MAX_SKILL_NAME = 100;


        public static final String NAT_ID_REGEXP = "\\d{11}";
        public static final String LANG_LVL_REGEXP = "[ABC][12]";
        public static final String EMAIL_REGEXP = "^\\w+(\\.\\w+)*@\\p{javaLowerCase}{2,12}+(\\.\\p{javaLowerCase}{2,6})+$";
        public static final String WEBSITE_REGEXP = "^(w{3}\\.)?[^.]+(\\.\\p{javaLowerCase}{2,12})+$";
        public static final String PHONE_NUM_REGEXP = "^((\\+?\\d{1,3})?0?[\\s-]?)?\\(?0?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}$";
        public static final String DATE_REGEXP = "^\\d{4}-\\d{2}-\\d{2}$";

        public static final String LOCALHOST_3000 = "http://localhost:3000";
        public static final String HEROKU_APP = "https://javareactcamp-hrms-frontend.herokuapp.com";

    }

    public ResponseEntity<?> getResponseEntity(Result result) {
        if (result.isSuccess()) return ResponseEntity.ok(result);
        else return ResponseEntity.badRequest().body(result);
    }

    public String getViolationMsg(String camelCaseProp, String rawMsg) {
        String[] sliced = StringUtils.splitByCharacterTypeCamelCase(camelCaseProp);
        String propName = StringUtils.join(sliced, " ").toLowerCase(Locale.ENGLISH);
        return String.format("%s%s %s", Character.toUpperCase(propName.charAt(0)), propName.substring(1), rawMsg);
    }

    public Sort getSortByDirection(Short sortDirection, String propName) {
        if (sortDirection == null || sortDirection < 0) return Sort.by(Sort.Direction.DESC, propName);
        else return Sort.by(Sort.Direction.ASC, propName);
    }

    public String getEditedPhoneNumber(String phone) {
        if (phone == null) return null;
        String rawPhone = phone.replaceAll("[\\s-()]", "");
        StringBuilder body = new StringBuilder(rawPhone.substring(rawPhone.length() - 10));
        body.insert(8, " ");
        body.insert(6, " ");
        body.insert(3, " ");
        body.insert(0, " ");
        StringBuilder countryCode = new StringBuilder(rawPhone.substring(0, rawPhone.length() - 10));
        if (countryCode.length() > 0 && countryCode.charAt(0) != '+') countryCode.insert(0, "+");
        if (countryCode.length() == 2 && countryCode.charAt(0) == '+' && countryCode.charAt(1) == '0')
            countryCode.deleteCharAt(0);
        if (countryCode.length() == 0) countryCode.insert(0, "0");
        countryCode.append(body);
        return countryCode.toString();
    }

    public ErrorDataResult<ApiError> getErrorsIfExist(BaseCheckService... baseCheckServices) {
        Map<String, String> errors = new HashMap<>();
        for (BaseCheckService baseCheckService : baseCheckServices) {
            errors.putAll(baseCheckService.getErrors());
        }
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));
        else return null;
    }

}
