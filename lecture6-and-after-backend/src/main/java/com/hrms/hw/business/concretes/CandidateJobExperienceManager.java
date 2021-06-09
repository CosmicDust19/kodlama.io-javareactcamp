package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateJobExperienceService;
import com.hrms.hw.core.utilities.Utils;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CandidateJobExperienceDao;
import com.hrms.hw.dataAccess.abstracts.PositionDao;
import com.hrms.hw.entities.concretes.CandidateJobExperience;
import com.hrms.hw.entities.concretes.Position;
import com.hrms.hw.entities.concretes.dtos.CandidateJobExperienceAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateJobExperienceManager implements CandidateJobExperienceService {

    private final CandidateJobExperienceDao candidateJobExperienceDao;
    private final PositionDao positionDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateJobExperience>> getAll() {
        return new SuccessDataResult<>("Success", candidateJobExperienceDao.findAll());
    }

    @Override
    public DataResult<List<CandidateJobExperience>> getAllSortedDesc() {
        Sort sort = Sort.by(Sort.Direction.DESC,"quitYear");
        return new SuccessDataResult<>("Success", candidateJobExperienceDao.findAll(sort));
    }


    @Override
    public Result add(CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        CandidateJobExperience candidateJobExperience = modelMapper.map(candidateJobExperienceAddDto, CandidateJobExperience.class);

        Position position = candidateJobExperience.getPosition();
        position.setTitle(Utils.formName(position.getTitle()));
        if (!Utils.tryToSaveIfNotExists(position, positionDao)){
            position.setId(positionDao.getByTitle(position.getTitle()).getId());
        }

        candidateJobExperienceDao.save(candidateJobExperience);
        return new SuccessResult("Success");
    }
}
