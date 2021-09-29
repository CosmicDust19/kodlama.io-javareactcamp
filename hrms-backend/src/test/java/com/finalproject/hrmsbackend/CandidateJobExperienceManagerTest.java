package com.finalproject.hrmsbackend;

import com.finalproject.hrmsbackend.business.concretes.CandidateJobExperienceManager;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateJobExperienceDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.Image;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {CandidateJobExperienceManager.class, ModelMapper.class})
@ExtendWith(SpringExtension.class)
class CandidateJobExperienceManagerTest {
    @MockBean
    private CandidateDao candidateDao;

    @MockBean
    private CandidateJobExperienceDao candidateJobExperienceDao;

    @Autowired
    private CandidateJobExperienceManager candidateJobExperienceManager;

    @MockBean
    private CheckService checkService;

    @MockBean
    private ModelMapper modelMapper;

    @MockBean
    private PositionDao positionDao;

    @Test
    void testGetAll() {
        when(this.candidateJobExperienceDao.findAll()).thenReturn(new ArrayList<>());
        DataResult<List<CandidateJobExperience>> actualAll = this.candidateJobExperienceManager.getAll();
        assertTrue(actualAll.getData().isEmpty());
        assertTrue(actualAll.isSuccess());
        verify(this.candidateJobExperienceDao).findAll();
    }

    @Test
    void testGetByQuitYear() {
        when(this.candidateJobExperienceDao.findAll((org.springframework.data.domain.Sort) any()))
                .thenReturn(new ArrayList<>());
        DataResult<List<CandidateJobExperience>> actualByQuitYear = this.candidateJobExperienceManager
                .getByQuitYear((short) 1);
        assertTrue(actualByQuitYear.getData().isEmpty());
        assertTrue(actualByQuitYear.isSuccess());
        assertEquals("Negative & Null -> Desc, Positive & Zero -> Asc (quitYear)", actualByQuitYear.getMessage());
        verify(this.candidateJobExperienceDao).findAll((org.springframework.data.domain.Sort) any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }


    @Test
    void testDeleteById() {
        doNothing().when(this.candidateJobExperienceDao).deleteById(any());
        Result actualDeleteByIdResult = this.candidateJobExperienceManager.deleteById(123);
        assertEquals("Deleted", actualDeleteByIdResult.getMessage());
        assertTrue(actualDeleteByIdResult.isSuccess());
        verify(this.candidateJobExperienceDao).deleteById(any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }

    @Test
    void testUpdateWorkPlace() {
        when(this.checkService.notExistsById(any(),
                (Integer) any())).thenReturn(true);
        Result actualUpdateWorkPlaceResult = this.candidateJobExperienceManager.updateWorkPlace("Work Place", 123);
        assertEquals("candJobExpId does not exist", actualUpdateWorkPlaceResult.getMessage());
        assertFalse(actualUpdateWorkPlaceResult.isSuccess());
        verify(this.checkService).notExistsById(any(),
                (Integer) any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }

    @Test
    void testUpdateWorkPlace2() {
        when(this.checkService.notExistsById(any(),
                (Integer) any())).thenReturn(false);

        Position position = new Position();
        position.setJobAdvertisements(new ArrayList<>());
        position.setTitle("Dr");
        position.setId((short) 1);

        Image image = new Image();
        image.setId(1);
        image.setHeight((short) 1);
        image.setImageUrl("https://example.org/example");
        image.setWidth((short) 1);
        image.setPublicId("42");
        image.setName("Name");
        image.setUser(new User());

        User user = new User();
        user.setEmail("jane.doe@example.org");
        user.setPassword("iloveyou");
        user.setImages(new ArrayList<>());
        user.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user.setId(1);
        user.setProfileImg(image);

        Image image1 = new Image();
        image1.setId(1);
        image1.setHeight((short) 1);
        image1.setImageUrl("https://example.org/example");
        image1.setWidth((short) 1);
        image1.setPublicId("42");
        image1.setName("Name");
        image1.setUser(user);

        Candidate candidate = new Candidate();
        candidate.setLastName("Doe");
        candidate.setEmail("jane.doe@example.org");
        candidate.setPassword("iloveyou");
        candidate.setImages(new ArrayList<>());
        candidate.setCandidateSchools(new ArrayList<>());
        candidate.setEmailVerified(true);
        candidate.setGithubAccount("3");
        candidate.setId(1);
        candidate.setCandidateSkills(new ArrayList<>());
        candidate.setCvs(new ArrayList<>());
        candidate.setFirstName("Jane");
        candidate.setCandidateLanguages(new ArrayList<>());
        candidate.setFavoriteJobAdvertisements(new ArrayList<>());
        candidate.setNationalityId("42");
        candidate.setCandidateJobExperiences(new ArrayList<>());
        candidate.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate.setProfileImg(image1);
        candidate.setBirthYear((short) 1);
        candidate.setLinkedinAccount("3");

        CandidateJobExperience candidateJobExperience = new CandidateJobExperience();
        candidateJobExperience.setWorkPlace("Work Place");
        candidateJobExperience.setPosition(position);
        candidateJobExperience.setId(1);
        candidateJobExperience.setCandidate(candidate);
        candidateJobExperience.setStartYear((short) 1);
        candidateJobExperience.setQuitYear((short) 1);
        when(this.candidateJobExperienceDao.getById(any())).thenReturn(candidateJobExperience);
        Result actualUpdateWorkPlaceResult = this.candidateJobExperienceManager.updateWorkPlace("Work Place", 123);
        assertEquals("Work place is the same as before", actualUpdateWorkPlaceResult.getMessage());
        assertFalse(actualUpdateWorkPlaceResult.isSuccess());
        verify(this.checkService).notExistsById(any(), (Integer) any());
        verify(this.candidateJobExperienceDao).getById(any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }

    @Test
    void testUpdateWorkPlace3() {
        when(this.checkService.notExistsById(any(),
                (Integer) any())).thenReturn(false);

        Position position = new Position();
        position.setJobAdvertisements(new ArrayList<>());
        position.setTitle("Dr");
        position.setId((short) 1);

        Image image = new Image();
        image.setId(1);
        image.setHeight((short) 1);
        image.setImageUrl("https://example.org/example");
        image.setWidth((short) 1);
        image.setPublicId("42");
        image.setName("Name");
        image.setUser(new User());

        User user = new User();
        user.setEmail("jane.doe@example.org");
        user.setPassword("iloveyou");
        user.setImages(new ArrayList<>());
        user.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user.setId(1);
        user.setProfileImg(image);

        Image image1 = new Image();
        image1.setId(1);
        image1.setHeight((short) 1);
        image1.setImageUrl("https://example.org/example");
        image1.setWidth((short) 1);
        image1.setPublicId("42");
        image1.setName("Name");
        image1.setUser(user);

        Candidate candidate = new Candidate();
        candidate.setLastName("Doe");
        candidate.setEmail("jane.doe@example.org");
        candidate.setPassword("iloveyou");
        candidate.setImages(new ArrayList<>());
        candidate.setCandidateSchools(new ArrayList<>());
        candidate.setEmailVerified(true);
        candidate.setGithubAccount("3");
        candidate.setId(1);
        candidate.setCandidateSkills(new ArrayList<>());
        candidate.setCvs(new ArrayList<>());
        candidate.setFirstName("Jane");
        candidate.setCandidateLanguages(new ArrayList<>());
        candidate.setFavoriteJobAdvertisements(new ArrayList<>());
        candidate.setNationalityId("42");
        candidate.setCandidateJobExperiences(new ArrayList<>());
        candidate.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate.setProfileImg(image1);
        candidate.setBirthYear((short) 1);
        candidate.setLinkedinAccount("3");

        CandidateJobExperience candidateJobExperience = new CandidateJobExperience();
        candidateJobExperience.setWorkPlace("Work place");
        candidateJobExperience.setPosition(position);
        candidateJobExperience.setId(1);
        candidateJobExperience.setCandidate(candidate);
        candidateJobExperience.setStartYear((short) 1);
        candidateJobExperience.setQuitYear((short) 1);

        Position position1 = new Position();
        position1.setJobAdvertisements(new ArrayList<>());
        position1.setTitle("Dr");
        position1.setId((short) 1);

        Image image2 = new Image();
        image2.setId(1);
        image2.setHeight((short) 1);
        image2.setImageUrl("https://example.org/example");
        image2.setWidth((short) 1);
        image2.setPublicId("42");
        image2.setName("Name");
        image2.setUser(new User());

        User user1 = new User();
        user1.setEmail("jane.doe@example.org");
        user1.setPassword("iloveyou");
        user1.setImages(new ArrayList<>());
        user1.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user1.setEmailVerified(true);
        user1.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user1.setId(1);
        user1.setProfileImg(image2);

        Image image3 = new Image();
        image3.setId(1);
        image3.setHeight((short) 1);
        image3.setImageUrl("https://example.org/example");
        image3.setWidth((short) 1);
        image3.setPublicId("42");
        image3.setName("Name");
        image3.setUser(user1);

        Candidate candidate1 = new Candidate();
        candidate1.setLastName("Doe");
        candidate1.setEmail("jane.doe@example.org");
        candidate1.setPassword("iloveyou");
        candidate1.setImages(new ArrayList<>());
        candidate1.setCandidateSchools(new ArrayList<>());
        candidate1.setEmailVerified(true);
        candidate1.setGithubAccount("3");
        candidate1.setId(1);
        candidate1.setCandidateSkills(new ArrayList<>());
        candidate1.setCvs(new ArrayList<>());
        candidate1.setFirstName("Jane");
        candidate1.setCandidateLanguages(new ArrayList<>());
        candidate1.setFavoriteJobAdvertisements(new ArrayList<>());
        candidate1.setNationalityId("42");
        candidate1.setCandidateJobExperiences(new ArrayList<>());
        candidate1.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate1.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate1.setProfileImg(image3);
        candidate1.setBirthYear((short) 1);
        candidate1.setLinkedinAccount("3");

        CandidateJobExperience candidateJobExperience1 = new CandidateJobExperience();
        candidateJobExperience1.setWorkPlace("Work Place");
        candidateJobExperience1.setPosition(position1);
        candidateJobExperience1.setId(1);
        candidateJobExperience1.setCandidate(candidate1);
        candidateJobExperience1.setStartYear((short) 1);
        candidateJobExperience1.setQuitYear((short) 1);
        when(this.candidateJobExperienceDao.save(any())).thenReturn(candidateJobExperience1);
        when(this.candidateJobExperienceDao.getById(any())).thenReturn(candidateJobExperience);
        Result actualUpdateWorkPlaceResult = this.candidateJobExperienceManager.updateWorkPlace("Work Place", 123);
        assertSame(candidateJobExperience1, ((SuccessDataResult) actualUpdateWorkPlaceResult).getData());
        assertTrue(actualUpdateWorkPlaceResult.isSuccess());
        assertEquals("Updated", actualUpdateWorkPlaceResult.getMessage());
        verify(this.checkService).notExistsById(any(),
                (Integer) any());
        verify(this.candidateJobExperienceDao).getById(any());
        verify(this.candidateJobExperienceDao).save(any());
    }

    @Test
    void testUpdatePosition() {
        when(this.checkService.notExistsById(any(),
                (Integer) any())).thenReturn(true);
        Result actualUpdatePositionResult = this.candidateJobExperienceManager.updatePosition((short) 1, 123);
        assertEquals("candJobExpId does not exist", actualUpdatePositionResult.getMessage());
        assertFalse(actualUpdatePositionResult.isSuccess());
        verify(this.checkService).notExistsById(any(),
                (Integer) any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }

    @Test
    void testUpdateStartYear() {
        when(this.checkService.notExistsById(any(),
                (Integer) any())).thenReturn(true);
        Result actualUpdateStartYearResult = this.candidateJobExperienceManager.updateStartYear((short) 1, 123);
        assertEquals("candJobExpId does not exist", actualUpdateStartYearResult.getMessage());
        assertFalse(actualUpdateStartYearResult.isSuccess());
        verify(this.checkService).notExistsById(any(),
                (Integer) any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }

    @Test
    void testUpdateStartYear2() {
        when(this.checkService.notExistsById(any(),
                (Integer) any())).thenReturn(false);

        Position position = new Position();
        position.setJobAdvertisements(new ArrayList<>());
        position.setTitle("Dr");
        position.setId((short) 1);

        Image image = new Image();
        image.setId(1);
        image.setHeight((short) 1);
        image.setImageUrl("https://example.org/example");
        image.setWidth((short) 1);
        image.setPublicId("42");
        image.setName("Name");
        image.setUser(new User());

        User user = new User();
        user.setEmail("jane.doe@example.org");
        user.setPassword("iloveyou");
        user.setImages(new ArrayList<>());
        user.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        user.setId(1);
        user.setProfileImg(image);

        Image image1 = new Image();
        image1.setId(1);
        image1.setHeight((short) 1);
        image1.setImageUrl("https://example.org/example");
        image1.setWidth((short) 1);
        image1.setPublicId("42");
        image1.setName("Name");
        image1.setUser(user);

        Candidate candidate = new Candidate();
        candidate.setLastName("Doe");
        candidate.setEmail("jane.doe@example.org");
        candidate.setPassword("iloveyou");
        candidate.setImages(new ArrayList<>());
        candidate.setCandidateSchools(new ArrayList<>());
        candidate.setEmailVerified(true);
        candidate.setGithubAccount("3");
        candidate.setId(1);
        candidate.setCandidateSkills(new ArrayList<>());
        candidate.setCvs(new ArrayList<>());
        candidate.setFirstName("Jane");
        candidate.setCandidateLanguages(new ArrayList<>());
        candidate.setFavoriteJobAdvertisements(new ArrayList<>());
        candidate.setNationalityId("42");
        candidate.setCandidateJobExperiences(new ArrayList<>());
        candidate.setLastModifiedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate.setCreatedAt(LocalDateTime.of(1, 1, 1, 1, 1));
        candidate.setProfileImg(image1);
        candidate.setBirthYear((short) 1);
        candidate.setLinkedinAccount("3");

        CandidateJobExperience candidateJobExperience = new CandidateJobExperience();
        candidateJobExperience.setWorkPlace("Work Place");
        candidateJobExperience.setPosition(position);
        candidateJobExperience.setId(1);
        candidateJobExperience.setCandidate(candidate);
        candidateJobExperience.setStartYear((short) 1);
        candidateJobExperience.setQuitYear((short) 1);
        when(this.candidateJobExperienceDao.getById(any())).thenReturn(candidateJobExperience);
        Result actualUpdateStartYearResult = this.candidateJobExperienceManager.updateStartYear((short) 1, 123);
        assertEquals("Start year is the same as before", actualUpdateStartYearResult.getMessage());
        assertFalse(actualUpdateStartYearResult.isSuccess());
        verify(this.checkService).notExistsById(any(),
                (Integer) any());
        verify(this.candidateJobExperienceDao).getById(any());
        assertTrue(this.candidateJobExperienceManager
                .getAll() instanceof com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult);
    }


}
