package com.hrms.hw.core.config;

import com.hrms.hw.entities.concretes.*;
import com.hrms.hw.entities.concretes.dtos.*;
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
        modelMapper.addMappings(jobAdvertisementAddDtoJobAdvertisementPropertyMap);
        modelMapper.addMappings(candidateCvAddDtoCandidateCvPropertyMap);
        modelMapper.addMappings(candidateJobExperienceAddDtoCandidateJobExperiencePropertyMap);
        modelMapper.addMappings(candidateLanguageAddDtoCandidateLanguagePropertyMap);
        modelMapper.addMappings(candidateSchoolAddDtoCandidateSchoolPropertyMap);
        modelMapper.addMappings(candidateSkillAddDtoCandidateSkillPropertyMap);
        return modelMapper;
    }

    PropertyMap<JobAdvertisementAddDto, JobAdvertisement> jobAdvertisementAddDtoJobAdvertisementPropertyMap = new PropertyMap<JobAdvertisementAddDto, JobAdvertisement>() {
        protected void configure() {
            map(source.getEmployerId(), destination.getEmployer().getId());
            map(source.getCityId(), destination.getCity().getId());
            map(source.getPositionId(), destination.getPosition().getId());
        }
    };

    PropertyMap<CandidateCvAddDto, CandidateCv> candidateCvAddDtoCandidateCvPropertyMap = new PropertyMap<CandidateCvAddDto, CandidateCv>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience> candidateJobExperienceAddDtoCandidateJobExperiencePropertyMap = new PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getPositionId(), destination.getPosition().getId());
        }
    };


    PropertyMap<CandidateLanguageAddDto, CandidateLanguage> candidateLanguageAddDtoCandidateLanguagePropertyMap = new PropertyMap<CandidateLanguageAddDto, CandidateLanguage>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getLanguageId(), destination.getLanguage().getId());
        }
    };


    PropertyMap<CandidateSchoolAddDto, CandidateSchool> candidateSchoolAddDtoCandidateSchoolPropertyMap = new PropertyMap<CandidateSchoolAddDto, CandidateSchool>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getDepartmentId(), destination.getDepartment().getId());
            map(source.getSchoolId(), destination.getSchool().getId());
        }
    };

    PropertyMap<CandidateSkillAddDto, CandidateSkill> candidateSkillAddDtoCandidateSkillPropertyMap = new PropertyMap<CandidateSkillAddDto, CandidateSkill>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getSkillId(), destination.getSkill().getId());
        }
    };

}
