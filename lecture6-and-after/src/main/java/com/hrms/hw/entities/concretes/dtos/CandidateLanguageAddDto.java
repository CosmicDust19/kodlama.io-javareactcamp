package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateLanguageAddDto {

    private int candidateId;

    private short languageId;

    @Pattern(regexp = "[ABC][12]", message = "not a english level according to the common european framework (A1, A2 etc.)")
    private String languageLevel;
}
