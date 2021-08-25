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
        modelMapper.addMappings(jobAdvDtoToJobAdvPropertyMap);
        modelMapper.addMappings(jobAdvDtoToJobAdvUpdPropertyMap);
        modelMapper.addMappings(cvAddDtoCvPropertyMap);
        modelMapper.addMappings(candJobExpAddDtoToCandJobExpPropertyMap);
        modelMapper.addMappings(candLangAddDtoToCandLangPropertyMap);
        modelMapper.addMappings(candSchoolAddDtoToCandSchoolPropertyMap);
        modelMapper.addMappings(candSkillAddDtoToCandSkillPropertyMap);
        return modelMapper;
    }

    private final PropertyMap<JobAdvertisementDto, JobAdvertisement> jobAdvDtoToJobAdvPropertyMap = new PropertyMap<JobAdvertisementDto, JobAdvertisement>() {
        protected void configure() {
            map(source.getEmployerId(), destination.getEmployer().getId());
            map(source.getPositionId(), destination.getPosition().getId());
            map(source.getCityId(), destination.getCity().getId());
        }
    };

    private final PropertyMap<JobAdvertisementDto, JobAdvertisementUpdate> jobAdvDtoToJobAdvUpdPropertyMap = new PropertyMap<JobAdvertisementDto, JobAdvertisementUpdate>() {
        protected void configure() {
            map(source.getPositionId(), destination.getPosition().getId());
            map(source.getCityId(), destination.getCity().getId());
        }
    };

    private final PropertyMap<CvAddDto, Cv> cvAddDtoCvPropertyMap = new PropertyMap<CvAddDto, Cv>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    private final PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience> candJobExpAddDtoToCandJobExpPropertyMap = new PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getPositionId(), destination.getPosition().getId());
        }
    };

    private final PropertyMap<CandidateLanguageAddDto, CandidateLanguage> candLangAddDtoToCandLangPropertyMap = new PropertyMap<CandidateLanguageAddDto, CandidateLanguage>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getLanguageId(), destination.getLanguage().getId());
        }
    };

    private final PropertyMap<CandidateSchoolAddDto, CandidateSchool> candSchoolAddDtoToCandSchoolPropertyMap = new PropertyMap<CandidateSchoolAddDto, CandidateSchool>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getSchoolId(), destination.getSchool().getId());
            map(source.getDepartmentId(), destination.getDepartment().getId());
        }
    };

    private final PropertyMap<CandidateSkillAddDto, CandidateSkill> candSkillAddDtoToCandSkillPropertyMap = new PropertyMap<CandidateSkillAddDto, CandidateSkill>() {
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getSkillId(), destination.getSkill().getId());
        }
    };

}
