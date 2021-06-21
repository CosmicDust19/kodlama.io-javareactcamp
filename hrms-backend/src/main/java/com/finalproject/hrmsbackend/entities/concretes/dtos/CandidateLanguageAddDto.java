package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.entities.concretes.Language;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateLanguageAddDto {

    private int id;

    private int candidateId;

    private Language language;

    @Pattern(regexp = "[ABC][12]", message = "not a english level according to the common european framework (A1, A2 etc.)")
    private String languageLevel;

}
