package com.finalproject.hrmsbackend.business.concretes.check;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.business.abstracts.check.SystemEmployeeCheckService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemEmployeeCheckManager extends BaseCheckManager implements SystemEmployeeCheckService {

    private final SystemEmployeeDao systemEmployeeDao;

    @SneakyThrows
    @Override
    public void existsSystemEmployeeById(Integer sysEmplId) {
        if (CheckUtils.notExistsById(systemEmployeeDao, sysEmplId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("System Employee"));
    }

}
