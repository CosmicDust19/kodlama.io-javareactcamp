package com.finalproject.hrmsbackend.core.config;

import com.finalproject.hrmsbackend.entities.concretes.*;
import com.finalproject.hrmsbackend.entities.concretes.dtos.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper getModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.addMappings(candAddDtoToCandPropertyMap);
        modelMapper.addMappings(jobAdvDtoToJobAdvPropertyMap);
        modelMapper.addMappings(jobAdvDtoToJobAdvUpdPropertyMap);
        modelMapper.addMappings(cvAddDtoCvPropertyMap);
        modelMapper.addMappings(candJobExpAddDtoToCandJobExpPropertyMap);
        modelMapper.addMappings(candLangAddDtoToCandLangPropertyMap);
        modelMapper.addMappings(candSchoolAddDtoToCandSchoolPropertyMap);
        modelMapper.addMappings(candSkillAddDtoToCandSkillPropertyMap);
        modelMapper.addMappings(emplAddDtoTOEmplPropertyMap);
        modelMapper.addMappings(sysEmplAddDtoToSysEmplPropertyMap);
        return modelMapper;
    }

    private final PropertyMap<CandidateAddDto, Candidate> candAddDtoToCandPropertyMap = new PropertyMap<CandidateAddDto, Candidate>() {
        @Override
        protected void configure() {
            map(true, destination.isEmailVerified());
            map(new ArrayList<>(), destination.getCvs());
            map(new ArrayList<>(), destination.getCandidateJobExperiences());
            map(new ArrayList<>(), destination.getCandidateLanguages());
            map(new ArrayList<>(), destination.getCandidateSchools());
            map(new ArrayList<>(), destination.getCandidateSkills());
            map(new ArrayList<>(), destination.getFavoriteJobAdvertisements());
            map(new ArrayList<>(), destination.getImages());
        }
    };

    private final PropertyMap<EmployerAddDto, Employer> emplAddDtoTOEmplPropertyMap = new PropertyMap<EmployerAddDto, Employer>() {
        @Override
        protected void configure() {
            map(true, destination.isEmailVerified());
            map(new ArrayList<>(), destination.getJobAdvertisements());
            map(new ArrayList<>(), destination.getImages());
        }
    };

    private final PropertyMap<SystemEmployeeAddDto, SystemEmployee> sysEmplAddDtoToSysEmplPropertyMap = new PropertyMap<SystemEmployeeAddDto, SystemEmployee>() {
        @Override
        protected void configure() {
            map(true, destination.isEmailVerified());
            map(new ArrayList<>(), destination.getImages());
        }
    };

    private final PropertyMap<JobAdvertisementDto, JobAdvertisement> jobAdvDtoToJobAdvPropertyMap = new PropertyMap<JobAdvertisementDto, JobAdvertisement>() {
        @Override
        protected void configure() {
            map(source.getEmployerId(), destination.getEmployer().getId());
            map(source.getPositionId(), destination.getPosition().getId());
            map(source.getCityId(), destination.getCity().getId());
            map(true, destination.isActive());
        }
    };

    private final PropertyMap<JobAdvertisementDto, JobAdvertisementUpdate> jobAdvDtoToJobAdvUpdPropertyMap = new PropertyMap<JobAdvertisementDto, JobAdvertisementUpdate>() {
        @Override
        protected void configure() {
            map(source.getPositionId(), destination.getPosition().getId());
            map(source.getCityId(), destination.getCity().getId());
        }
    };

    private final PropertyMap<CvAddDto, Cv> cvAddDtoCvPropertyMap = new PropertyMap<CvAddDto, Cv>() {
        @Override
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
        }
    };

    private final PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience> candJobExpAddDtoToCandJobExpPropertyMap = new PropertyMap<CandidateJobExperienceAddDto, CandidateJobExperience>() {
        @Override
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getPositionId(), destination.getPosition().getId());
        }
    };

    private final PropertyMap<CandidateLanguageAddDto, CandidateLanguage> candLangAddDtoToCandLangPropertyMap = new PropertyMap<CandidateLanguageAddDto, CandidateLanguage>() {
        @Override
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getLanguageId(), destination.getLanguage().getId());
        }
    };

    private final PropertyMap<CandidateSchoolAddDto, CandidateSchool> candSchoolAddDtoToCandSchoolPropertyMap = new PropertyMap<CandidateSchoolAddDto, CandidateSchool>() {
        @Override
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getSchoolId(), destination.getSchool().getId());
            map(source.getDepartmentId(), destination.getDepartment().getId());
        }
    };

    private final PropertyMap<CandidateSkillAddDto, CandidateSkill> candSkillAddDtoToCandSkillPropertyMap = new PropertyMap<CandidateSkillAddDto, CandidateSkill>() {
        @Override
        protected void configure() {
            map(source.getCandidateId(), destination.getCandidate().getId());
            map(source.getSkillId(), destination.getSkill().getId());
        }
    };

}
