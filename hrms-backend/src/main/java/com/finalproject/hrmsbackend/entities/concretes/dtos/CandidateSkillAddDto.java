package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.Msg;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSkillAddDto {

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    private Integer candidateId;

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    private Short skillId;

}
