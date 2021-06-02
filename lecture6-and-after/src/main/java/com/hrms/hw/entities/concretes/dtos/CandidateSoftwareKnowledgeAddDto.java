package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSoftwareKnowledgeAddDto {

    @Positive
    private int candidateId;

    @Positive
    private short softwareKnowledgeId;
}
