import {Button, Dropdown, Grid, Header, Icon, Input, Table,} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {
    changeCvJobExp,
    changeCvLang,
    changeCvSchool,
    changeCvSkill,
    changeJobExps,
    changeLangs,
    changeSchools,
    changeSkills,
} from "../../store/actions/userActions";
import PositionService from "../../services/positionService";
import SchoolService from "../../services/schoolService";
import DepartmentService from "../../services/departmentService";
import LanguageService from "../../services/languageService";
import SkillService from "../../services/skillService";
import CandidateJobExperienceService from "../../services/candidateJobExperienceService";
import CandidateLanguageService from "../../services/candidateLanguageService";
import CandidateSchoolService from "../../services/candidateSchoolService";
import CandidateSkillService from "../../services/candidateSkillService";

export function CandidateManageProfile() {

    const ADDED = "Added"
    const ALREADY_HAVE = "You already have this"
    const REMOVED = "Removed from everywhere"
    const ERR = "A problem has occurred"

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const candidateJobExperienceService = new CandidateJobExperienceService();
    const candidateLanguageService = new CandidateLanguageService();
    const candidateSchoolService = new CandidateSchoolService();
    const candidateSkillService = new CandidateSkillService();

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)

    const [positions, setPositions] = useState([]);
    const [schools, setSchools] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [languageLevels, setLanguageLevels] = useState([]);
    const [skills, setSkills] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        let positionService = new PositionService();
        let schoolService = new SchoolService();
        let departmentService = new DepartmentService();
        let languageService = new LanguageService();
        let skillService = new SkillService();
        positionService.getPositions().then((result) => setPositions(result.data.data));
        schoolService.getSchools().then((result) => setSchools(result.data.data));
        departmentService.getDepartments().then((result) => setDepartments(result.data.data));
        languageService.getLanguages().then((result) => setLanguages(result.data.data));
        setLanguageLevels(["A1", "A2", "B1", "B2", "C1", "C2"])
        skillService.getSkills().then((result) => setSkills(result.data.data));
    }, [])

    const formik = useFormik({
        initialValues: {
            workPlace: "", position: {}, jobStartYear: "", jobQuitYear: "",
            school: {}, department: {}, schoolStartYear: "", schoolGraduationYear: "",
            language: {}, languageLevel: "",
            skill: {}
        }
    });

    const positionOption = positions.map((position, index) => ({
        key: index,
        text: position.title,
        value: position.id,
    }));

    const schoolOption = schools.map((school, index) => ({
        key: index,
        text: school.name,
        value: school.id,
    }));

    const departmentOption = departments.map((department, index) => ({
        key: index,
        text: department.name,
        value: department.id,
    }));

    const languageOption = languages.filter((language) => {
        let index = (user.candidateLanguages.findIndex((candidateLanguage) => candidateLanguage.language.id === language.id))
        return index === -1;
    }).map((language, index) => ({
        key: index,
        text: language.name,
        value: language.id,
    }));

    const languageLevelOption = languageLevels.map((languageLevel, index) => ({
        key: index,
        text: languageLevel,
        value: languageLevel,
    }));

    const skillOption = skills.filter((skill) => {
        let index = (user.candidateSkills.findIndex((candidateSkill) => candidateSkill.skill.id === skill.id))
        return index === -1;
    }).map((skill, index) => ({
        key: index,
        text: skill.name,
        value: skill.id,
    }));

    const refreshPage = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleCatch = (error) => {
        toast.warning(ERR)
        console.log(error.response)
        refreshPage()
    }

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const getPushedArray = (arr, object) => {
        arr.push(object)
        return arr
    }

    const deleteAndGetArray = (arr, index) => {
        arr.splice(index, 1)
        return arr
    }

    const handleJobExperienceAdd = () => {
        const index = user.candidateJobExperiences.findIndex(candidateJobExperience =>
            candidateJobExperience.workPlace === formik.values.workPlace &&
            candidateJobExperience.position.id === formik.values.position.id)
        if (index !== -1) {
            toast.warning(ALREADY_HAVE)
            return
        }
        const newCandidateJobExperience = {
            candidateId: user.id,
            positionId: formik.values.position.id,
            quitYear: formik.values.jobQuitYear,
            startYear: formik.values.jobStartYear,
            workPlace: formik.values.workPlace,
            position: {id: formik.values.position.id, title: formik.values.position.title}
        };
        candidateJobExperienceService.add(newCandidateJobExperience).then(r => {
            newCandidateJobExperience.id = r.data.data.id
            dispatch(changeJobExps(getPushedArray(user.candidateJobExperiences, newCandidateJobExperience)))
            toast(ADDED)
            refreshPage()
        }).catch(handleCatch)
    }

    const handleSchoolAdd = () => {
        const index = user.candidateSchools.findIndex((candidateSchool) =>
            candidateSchool.school.id === formik.values.school.id &&
            candidateSchool.department.id === formik.values.department.id
        )
        if (index !== -1) {
            toast.warning(ALREADY_HAVE)
            return
        }
        const newCandidateSchool = {
            candidateId: user.id,
            schoolId: formik.values.school.id,
            departmentId: formik.values.department.id,
            startYear: formik.values.schoolStartYear,
            graduationYear: formik.values.schoolGraduationYear,
            school: {id: formik.values.school.id, name: formik.values.school.name},
            department: {id: formik.values.department.id, name: formik.values.department.name},
        };
        candidateSchoolService.add(newCandidateSchool).then(r => {
            newCandidateSchool.id = r.data.data.id
            dispatch(changeSchools(getPushedArray(user.candidateSchools, newCandidateSchool)))
            toast(ADDED)
            refreshPage()
        }).catch(handleCatch)
    }

    const handleLanguageAdd = () => {
        const index = user.candidateLanguages.findIndex(candidateLanguage => candidateLanguage.language.id === formik.values.language.id)
        if (index !== -1) {
            toast.warning(ALREADY_HAVE)
            return
        }
        const newCandidateLanguage = {
            candidateId: user.id,
            languageId: formik.values.language.id,
            languageLevel: formik.values.languageLevel,
            language: {id: formik.values.language.id, name: formik.values.language.name},
        };
        candidateLanguageService.add(newCandidateLanguage).then(r => {
            newCandidateLanguage.id = r.data.data.id
            dispatch(changeLangs(getPushedArray(user.candidateLanguages, newCandidateLanguage)))
            toast(ADDED)
            refreshPage()
        }).catch(handleCatch)
    }

    const handleSkillAdd = () => {
        const index = user.candidateSkills.findIndex((candidateSkill) => {
            return (candidateSkill.skill.id === formik.values.skill.id)
        })
        if (index !== -1) {
            toast.warning(ALREADY_HAVE)
            return
        }
        const newCandidateSkill = {
            candidateId: user.id,
            skillId: formik.values.skill.id,
            skill: {id: formik.values.skill.id, name: formik.values.skill.name}
        };
        candidateSkillService.add(newCandidateSkill).then(r => {
            newCandidateSkill.id = r.data.data.id
            dispatch(changeSkills(getPushedArray(user.candidateSkills, newCandidateSkill)))
            toast(ADDED)
            refreshPage()
        }).catch(handleCatch)
    }

    const handleJobExperienceDelete = (jobExpId) => {
        candidateJobExperienceService.delete(jobExpId).then(() => {
            const index = user.candidateJobExperiences.findIndex((candJobExp) => jobExpId === candJobExp.id)
            dispatch(changeJobExps(deleteAndGetArray(user.candidateJobExperiences, index)))
            removeCandJobExpFromAllCvs(jobExpId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const handleSchoolDelete = (schoolId) => {
        candidateSchoolService.delete(schoolId).then(() => {
            console.log(user.candidateSchools)
            const index = user.candidateSchools.findIndex((candSchool) => schoolId === candSchool.id)
            console.log(user.candidateSchools)
            dispatch(changeSchools(deleteAndGetArray(user.candidateSchools, index)))
            console.log(user.candidateSchools)
            removeCandSchoolFromAllCvs(schoolId)
            console.log(user.candidateSchools)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const handleLanguageDelete = (langId) => {
        candidateLanguageService.delete(langId).then(() => {
            const index = user.candidateLanguages.findIndex((candLang) => langId === candLang.id)
            dispatch(changeLangs(deleteAndGetArray(user.candidateLanguages, index)))
            removeCandLangFromAllCvs(langId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const handleSkillDelete = (skillId) => {
        candidateSkillService.delete(skillId).then(() => {
            const index = user.candidateSkills.findIndex((candSkill) => skillId === candSkill.id)
            dispatch(changeSkills(deleteAndGetArray(user.candidateSkills, index)))
            removeCandSkillFromAllCvs(skillId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const removeCandJobExpFromAllCvs = (jobExpId) => {
        user.cvs.forEach((cv) => {
            const index = cv.candidateJobExperiences.findIndex(candJobExp => jobExpId === candJobExp.id)
            if (index !== -1) dispatch(changeCvJobExp(cv.id, deleteAndGetArray(cv.candidateJobExperiences, index)))
        })
    }

    const removeCandLangFromAllCvs = (langId) => {
        user.cvs.forEach((cv) => {
            const index = cv.candidateLanguages.findIndex(candLang => langId === candLang.id)
            if (index !== -1) dispatch(changeCvLang(cv.id, deleteAndGetArray(cv.candidateLanguages, index)))
        })
    }

    const removeCandSchoolFromAllCvs = (schoolId) => {
        user.cvs.forEach((cv) => {
            const index = cv.candidateSchools.findIndex(candSchool => schoolId === candSchool.id)
            if (index !== -1) dispatch(changeCvSchool(cv.id, deleteAndGetArray(cv.candidateSchools, index)))
        })
    }

    const removeCandSkillFromAllCvs = (skillId) => {
        user.cvs.forEach((cv) => {
            const index = cv.candidateSkills.findIndex(candSkill => skillId === candSkill.id)
            if (index !== -1) dispatch(changeCvSkill(cv.id, deleteAndGetArray(cv.candidateSkills, index)))
        })
    }

    const invalidCandJobExp =
        formik.values.workPlace.trim().length === 0 ||
        formik.values.position.id <= 0 || !formik.values.position.id ||
        formik.values.jobStartYear > new Date().getFullYear() || formik.values.jobStartYear < 1900 ||
        (!!formik.values.jobQuitYear && (formik.values.jobQuitYear > new Date().getFullYear() ||
            formik.values.jobQuitYear < 1900 || formik.values.jobStartYear > formik.values.jobQuitYear))

    const invalidCandSchool =
        formik.values.school.id <= 0 || !formik.values.school.id ||
        formik.values.department.id <= 0 || !formik.values.department.id ||
        formik.values.schoolStartYear > new Date().getFullYear() || formik.values.schoolStartYear < 1900 ||
        (!!formik.values.schoolGraduationYear && (formik.values.schoolGraduationYear > new Date().getFullYear() ||
            formik.values.schoolGraduationYear < 1900 || formik.values.schoolStartYear > formik.values.schoolGraduationYear))

    const invalidCandLang = formik.values.language.id <= 0 || !formik.values.language.id || !formik.values.languageLevel

    const invalidCandSkill = formik.values.skill.id <= 0 || !formik.values.skill.id

    if (String(userProps.userType) !== "candidate") {
        return (
            <Header>
                Sorry You Do Not Have Access Here
            </Header>
        )
    }

    return (
        <div>
            <Header dividing>
                Manage Your Infos
            </Header>
            <Grid>
                <Grid stackable style={{marginTop: 10}}>
                    <Grid.Column width={16}>
                        <Header textAlign={"center"} dividing color="green">
                            Job Experiences
                        </Header>
                        <Table basic={"very"} size="large" celled unstackable textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Workplace</Table.HeaderCell>
                                    <Table.HeaderCell>Position</Table.HeaderCell>
                                    <Table.HeaderCell>Start Year</Table.HeaderCell>
                                    <Table.HeaderCell>Quit Year</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {user.candidateJobExperiences?.map((candidateJobExperience) => (
                                    <Table.Row key={candidateJobExperience.id}>
                                        <Table.Cell>{candidateJobExperience.workPlace}</Table.Cell>
                                        <Table.Cell>{candidateJobExperience.position?.title}</Table.Cell>
                                        <Table.Cell>{candidateJobExperience.startYear}</Table.Cell>
                                        <Table.Cell>{!candidateJobExperience.quitYear ? "Continues" : candidateJobExperience.quitYear}</Table.Cell>
                                        <Table.Cell icon={"x"} onClick={() => {
                                            handleJobExperienceDelete(candidateJobExperience.id)
                                        }} negative selectable error width={1}/>
                                    </Table.Row>
                                ))}
                                <Table.Row>
                                    <Table.Cell>
                                        <Input
                                            type="text"
                                            placeholder="Work Place"
                                            value={formik.values.workPlace}
                                            name="workPlace"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Position" search selection
                                                  value={formik.values.position.id} options={positionOption}
                                                  onChange={(event, data) =>
                                                      handleChange("position", {
                                                          id: data.value,
                                                          title: event.target.innerText
                                                      })}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            type="number"
                                            placeholder="Start Year"
                                            value={formik.values.jobStartYear}
                                            name="jobStartYear"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            type="number"
                                            placeholder="Quit Year"
                                            value={formik.values.jobQuitYear}
                                            name="jobQuitYear"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Button primary onClick={handleJobExperienceAdd} style={{borderRadius: 15}}
                                disabled={invalidCandJobExp}
                        ><Icon name="plus"/>Add</Button>
                    </Grid.Column>

                    <Grid.Column width={16}>
                        <Header textAlign={"center"} dividing color="yellow">
                            Schools
                        </Header>
                        <Table basic={"very"} size="large" celled unstackable textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Schools</Table.HeaderCell>
                                    <Table.HeaderCell>Department</Table.HeaderCell>
                                    <Table.HeaderCell>Start Year</Table.HeaderCell>
                                    <Table.HeaderCell>Graduation Year</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {user.candidateSchools?.map((candidateSchool) => (
                                    <Table.Row key={candidateSchool.id}>
                                        <Table.Cell>{candidateSchool.school?.name}</Table.Cell>
                                        <Table.Cell>{candidateSchool.department?.name}</Table.Cell>
                                        <Table.Cell>{candidateSchool.startYear}</Table.Cell>
                                        <Table.Cell>{!candidateSchool.graduationYear ? "Continues" : candidateSchool.graduationYear}</Table.Cell>
                                        <Table.Cell icon={"x"} onClick={() => {
                                            handleSchoolDelete(candidateSchool.id)
                                        }} negative selectable error width={1}/>
                                    </Table.Row>
                                ))}
                                <Table.Row>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="School" search selection
                                                  value={formik.values.school.id}
                                                  options={schoolOption} selectOnBlur={false}
                                                  onChange={(event, data) =>
                                                      handleChange("school", {
                                                          id: data.value,
                                                          name: event.target.innerText
                                                      })}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Department" search selection
                                                  value={formik.values.department.id}
                                                  options={departmentOption} selectOnBlur={false}
                                                  onChange={(event, data) =>
                                                      handleChange("department", {
                                                          id: data.value,
                                                          name: event.target.innerText
                                                      })}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            type="number"
                                            placeholder="Start Year"
                                            value={formik.values.schoolStartYear}
                                            name="schoolStartYear"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            type="number"
                                            placeholder="Graduation Year"
                                            value={formik.values.schoolGraduationYear}
                                            name="schoolGraduationYear"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Button primary onClick={handleSchoolAdd} style={{borderRadius: 15}}
                                disabled={invalidCandSchool}><Icon name="plus"/>Add</Button>
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="violet">
                            Languages
                        </Header>
                        <Table basic={"very"} size="large" celled unstackable textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Languages</Table.HeaderCell>
                                    <Table.HeaderCell>Level(CEFR)</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {user.candidateLanguages?.map((candidateLanguage) => (
                                    <Table.Row key={candidateLanguage.id}>
                                        <Table.Cell>{candidateLanguage.language.name}</Table.Cell>
                                        <Table.Cell>{candidateLanguage.languageLevel}</Table.Cell>
                                        <Table.Cell icon={"x"} negative selectable error width={2}
                                                    onClick={() => handleLanguageDelete(candidateLanguage.id)}/>
                                    </Table.Row>
                                ))}
                                <Table.Row>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Language" search selection
                                                  value={formik.values.language.id} options={languageOption}
                                                  onChange={(event, data) =>
                                                      handleChange("language", {
                                                          id: data.value,
                                                          name: event.target.innerText
                                                      })} selectOnBlur={false}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Language Level" search selection
                                                  value={formik.values.languageLevel} options={languageLevelOption}
                                                  onChange={(event, data) =>
                                                      handleChange("languageLevel", data.value)}
                                                  selectOnBlur={false}
                                        />
                                    </Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Button primary onClick={handleLanguageAdd} style={{borderRadius: 15}}
                                disabled={invalidCandLang}><Icon name="plus"/>
                            Add
                        </Button>
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="pink">
                            Skills
                        </Header>
                        <Grid padded relaxed stackable>
                            {user.candidateSkills?.map((candidateSkill) => (
                                <Button key={candidateSkill.id} color={colors[Math.floor(Math.random() * 12)]}
                                        circular style={{marginTop: 6, marginLeft: 5}}>
                                    <Icon name="x" onClick={() => handleSkillDelete(candidateSkill.id)}/>
                                    {candidateSkill.skill?.name}
                                </Button>
                            ))}
                        </Grid>
                        <Dropdown clearable item placeholder="Skill" search selection
                                  style={{marginTop: 20, marginLeft: 5}} options={skillOption}
                                  value={formik.values.skill.id} selectOnBlur={false}
                                  onChange={(event, data) =>
                                      handleChange("skill", {
                                          id: data.value,
                                          name: event.target.innerText
                                      })}
                        />
                        <Button primary attached="right" onClick={handleSkillAdd} disabled={invalidCandSkill}>
                            <Icon name="plus"/>Add
                        </Button>
                    </Grid.Column>
                </Grid>
            </Grid>
            <Header dividing/>
        </div>
    )
}
