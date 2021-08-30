package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.*;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ex.printStackTrace();
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), Utils.getViolationMsg(fieldError.getField(), fieldError.getDefaultMessage()));
        }
        ApiError apiError = new ApiError(Msg.INVALID.getCustom("%s input(s)"), errors, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ex.printStackTrace();
        Set<String> details = new LinkedHashSet<>();
        details.add(ex.getMessage());
        ApiError apiError = new ApiError(Msg.MALFORMED_JSON_REQUEST.get(), null, details);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
        ex.printStackTrace();
        Map<String, String> errors = new LinkedHashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propPath = violation.getPropertyPath().toString();
            String camelCaseProp = propPath.substring(propPath.lastIndexOf('.') + 1);
            errors.put(camelCaseProp, Utils.getViolationMsg(camelCaseProp, violation.getMessage()));
        }
        ApiError apiError = new ApiError(Msg.INVALID.getCustom("%s input(s)"), errors, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
        ex.printStackTrace();
        Set<String> details = new LinkedHashSet<>();
        details.add(Objects.requireNonNull(ex.getMostSpecificCause()).getMessage());
        ApiError apiError = new ApiError(ex.getCause().getMessage(), null, details);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

    @ExceptionHandler({EmptyResultDataAccessException.class})
    public ResponseEntity<Object> handleEmptyResultDataAccess(EmptyResultDataAccessException ex, WebRequest request) {
        ex.printStackTrace();
        ApiError apiError = new ApiError(ex.getMostSpecificCause().getMessage(), null, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

    @Override
    public ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ex.printStackTrace();
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMostSpecificCause().getMessage(), null, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

}
