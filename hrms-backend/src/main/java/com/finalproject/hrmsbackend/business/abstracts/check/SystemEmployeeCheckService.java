package com.finalproject.hrmsbackend.business.abstracts.check;

import lombok.SneakyThrows;

import java.util.Map;

public interface SystemEmployeeCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    @SneakyThrows
    void existsSystemEmployeeById(Integer sysEmplId);
}
