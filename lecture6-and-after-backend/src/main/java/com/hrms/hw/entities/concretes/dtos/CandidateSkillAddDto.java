package com.hrms.hw.entities.concretes.dtos;

import com.hrms.hw.entities.concretes.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSkillAddDto {

    private int candidateId;

    @Valid
    private Skill skill;
}
