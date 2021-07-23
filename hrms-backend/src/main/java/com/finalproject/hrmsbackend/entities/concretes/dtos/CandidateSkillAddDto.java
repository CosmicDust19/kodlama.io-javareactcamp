package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSkillAddDto {

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Integer candidateId;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Short skillId;

}
