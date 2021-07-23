package com.finalproject.hrmsbackend.core.utilities;

import lombok.experimental.UtilityClass;

public enum MSGs {

    SUCCESS("Successful"),
    SUCCESS_UPDATE_REQUEST("Update request received, updateId:"),
    FAILED("Failed"),
    SAVED("Saved"),
    UPDATED("Updated"),
    DELETED("Deleted"),
    DELETE_ERROR("An error has occurred during deletion"),
    UPLOADED("Uploaded"),
    UPLOAD_ERROR("An error has occurred during upload"),
    RESULT_SUM("Result summary"),
    INVALID("invalid"),
    INVALID_DATE("invalid date format (should be yyyy-mm-dd)"),
    USED("used before"),
    IN_USE("in use"),
    NOT_HAVE("does not have this"),
    NOT_EXIST("does not exist"),
    NOT_FOUND("not found"),
    WRONG("wrong"),
    THE_SAME("the same as before"),
    ALREADY_CONTAINS("already contains this"),
    DIFF_DOMAIN("have different domain"),
    EXTERNAL_INTERVENTION("can have been intervened externally"),
    EMPTY("Empty"),
    NO_ID_FOUND("No ids found, nothing executed"),
    NO_UPDATE("No updates available"),
    START_END_CONFLICT("The end year cannot be a date before the start year"),
    MIN_MAX_CONFLICT("Min value cannot be greater than max value"),
    INVALID_LANG_LVL("Not a language level according to the common european framework (A1, A2 etc.)"),
    MERNIS_FAIL("Mernis verification failed"),
    SORT_DIRECTION("Negative & Null -> Desc, Positive & Zero -> Asc"),
    NOT_AN_IMAGE("Not an image"),
    IMG_VALIDATION_ERR("An error has occurred while validating image"),
    MALFORMED_JSON_REQUEST("Malformed JSON request");

    private final String MSG;

    MSGs(String msg) {
        MSG = msg;
    }

    public String get() {
        return MSG;
    }

    public String get(String firstExp) {
        return String.format("%s %s", firstExp, MSG);
    }

    public String getCustom(String format) {
        return String.format(format, MSG);
    }

    //messages for annotations
    @UtilityClass
    public class ForAnnotation {

        public static final String INVALID_FORMAT = "Invalid Format";
        public static final String EMPTY = "Empty";
        public static final String REQUIRED = "Required";
        public static final String NOT_POSITIVE = "Not positive";
        public static final String PAST_OR_PRESENT = "Past or Present";
        public static final String INVALID_LANG_LVL = "Should be A1, A2 etc.";
        public static final String INVALID_NAT_ID = "must consist of 11 digits";

    }

}