package com.finalproject.hrmsbackend.core.utilities.exception.handlers;

import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.SameValueException;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.UKViolationException;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorResult;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class ValidationExceptionHandlers extends ResponseEntityExceptionHandler {

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

    @ExceptionHandler({EntityNotExistsException.class})
    public ResponseEntity<Object> handleEntityNotFoundException(EntityNotExistsException ex, WebRequest request) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage()));
    }

    @ExceptionHandler({UKViolationException.class})
    public ResponseEntity<Object> handleEntityNotFoundException(UKViolationException ex, WebRequest request) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage()));
    }

    @ExceptionHandler({SameValueException.class})
    public ResponseEntity<Object> handleSameValueException(SameValueException ex, WebRequest request) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage()));
    }

}
