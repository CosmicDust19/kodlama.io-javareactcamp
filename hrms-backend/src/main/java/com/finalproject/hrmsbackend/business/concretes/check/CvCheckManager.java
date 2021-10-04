package com.finalproject.hrmsbackend.business.concretes.check;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.business.abstracts.check.CvCheckService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CvDao;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CvCheckManager extends BaseCheckManager implements CvCheckService {

    private final CvDao cvDao;

    @SneakyThrows
    @Override
    public void existsCvById(Integer cvId) {
        if (CheckUtils.notExistsById(cvDao, cvId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("CV"));
    }

    @Override
    public void notExistsCvByTitleAndCandidateId(String title, Integer candId) {
        if (cvDao.existsByTitleAndCandidate_Id(title, candId))
            errors.put("title", Msg.USED.get("Title"));
    }

}
