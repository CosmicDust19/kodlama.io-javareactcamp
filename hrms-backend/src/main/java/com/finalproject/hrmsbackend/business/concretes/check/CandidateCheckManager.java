package com.finalproject.hrmsbackend.business.concretes.check;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.business.abstracts.check.CandidateCheckService;
import com.finalproject.hrmsbackend.core.adapters.abstracts.MernisService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateCheckManager extends BaseCheckManager implements CandidateCheckService {

    private final CandidateDao candidateDao;
    private final MernisService mernisService;

    @SneakyThrows
    @Override
    public void existsCandidateById(Integer candId) {
        if (CheckUtils.notExistsById(candidateDao, candId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Candidate"));
    }

    @Override
    public void notExistsCandidateByNatId(String nationalityId) {
        if (candidateDao.existsByNationalityId(nationalityId))
            errors.put("nationalityId", Msg.IS_IN_USE.get("Nationality ID"));
    }

    @Override
    public void realPerson(CandidateAddDto candidateAddDto) {
        if (!mernisService.realPerson(candidateAddDto))
            errors.put("mernis", Msg.MERNIS_FAIL.get());
    }

}
