package com.finalproject.hrmsbackend.core.utilities.exception.handlers;

import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.SameValueException;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.UKViolationException;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorResult;
import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.*;

@ControllerAdvice
public class ExceptionHandlers extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ex.printStackTrace();
        Set<String> details = new LinkedHashSet<>();
        details.add(ex.getMessage());
        ApiError apiError = new ApiError(Msg.MALFORMED_JSON_REQUEST.get(), null, details);
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

    @ExceptionHandler({FileSizeLimitExceededException.class})
    public ResponseEntity<Object> handleFileSizeLimitExceededException(FileSizeLimitExceededException ex, WebRequest request) {
        ex.printStackTrace();
        String mb = String.valueOf(Math.round(ex.getPermittedSize() / 1000000.0));
        String msg = String.format("%s. You can upload files up to %s MB", Msg.FILE_TOO_LARGE.get(), mb);
        return ResponseEntity.badRequest().body(new ErrorResult(msg));
    }

    @Override
    public ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ex.printStackTrace();
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMostSpecificCause().getMessage(), null, null);
        return ResponseEntity.badRequest().body(new ErrorDataResult<>(Msg.FAILED.get(), apiError));
    }

}
