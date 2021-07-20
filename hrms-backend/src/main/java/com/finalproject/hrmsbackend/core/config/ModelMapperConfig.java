package com.finalproject.hrmsbackend.core.config;

import com.finalproject.hrmsbackend.entities.concretes.*;
import com.finalproject.hrmsbackend.entities.concretes.dtos.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper getModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.addMappings(jobAdvAddDtoJobAdvPropertyMap);
        modelMapper.addMappings(cvAddDtoCvPropertyMap);
        modelMapper.addMappings(candidateJobExpAddDtoCandidateJobExpPropertyMap);
        modelMapper.addMappings(candidateLangAddDtoCandidateLangPropertyMap);
        modelMapper.addMappings(candidateSchoolAddDtoCandidateSchoolPropertyMap);
        modelMapper.addMappings(candidateSkillAddDtoCandidateSkillPropertyMap);
        return modelMapper;
    }

    PropertyMap<JobAdvertisementAddDto, JobAdvertisement> jobAdvAddDtoJobAdvPropertyMap = new PropertyMap<JobAdvertisementAddDto, JobAdvertisement>() {
        protected void configure() {
            map(source.getEmployerId(), destination.getEmployer().getId());
        }
    };

    PropertyMap<CvAddDto, Cv> cvAddDtoCvPropertyMap = new PropertyMap<CvAddDto, Cv>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience> candidateJobExpAddDtoCandidateJobExpPropertyMap = new PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    PropertyMap<CandidateLanguageAddDto, CandidateLanguage> candidateLangAddDtoCandidateLangPropertyMap = new PropertyMap<CandidateLanguageAddDto, CandidateLanguage>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    PropertyMap<CandidateSchoolAddDto, CandidateSchool> candidateSchoolAddDtoCandidateSchoolPropertyMap = new PropertyMap<CandidateSchoolAddDto, CandidateSchool>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    PropertyMap<CandidateSkillAddDto, CandidateSkill> candidateSkillAddDtoCandidateSkillPropertyMap = new PropertyMap<CandidateSkillAddDto, CandidateSkill>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

}
