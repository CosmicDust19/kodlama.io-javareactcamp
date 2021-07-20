package com.finalproject.hrmsbackend.core.business;

import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Path;
import java.util.*;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exceptions, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : exceptions.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        ApiError apiError = new ApiError(MSGs.INVALID.getCustom("%s input(s)"), errors, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(MSGs.FAILED.get(), apiError));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Set<String> details = new HashSet<>();
        details.add(ex.getMessage());

        ApiError apiError = new ApiError(MSGs.MALFORMED_JSON_REQUEST.get(), null, details);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(MSGs.FAILED.get(), apiError));
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException exceptions, WebRequest request) {
        Map<Path, String> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : exceptions.getConstraintViolations()) {
            errors.put(violation.getPropertyPath(), violation.getMessage());
        }

        ApiError apiError = new ApiError(MSGs.INVALID.getCustom("%s input(s)"), errors, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(MSGs.FAILED.get(), apiError));
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    public ResponseEntity<Object> handleHttpRequestMethodNotSupported(DataIntegrityViolationException ex, WebRequest request) {
        Set<String> details = new HashSet<>();
        details.add(Objects.requireNonNull(ex.getRootCause()).getMessage());

        ApiError apiError = new ApiError(ex.getCause().getMessage(), null, details);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(MSGs.FAILED.get(), apiError));
    }

}
