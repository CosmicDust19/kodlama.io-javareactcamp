import {Button, Dropdown, Grid, Header, Icon, Input, Table,} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {
    changeCvJobExp, changeCvLang, changeCvSchool, changeCvSkill, changeJobExps, changeLangs, changeSchools, changeSkills,
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
import {getRandomColor, handleCatch} from "../../utilities/Utils";

export function CandidateProfile() {

    const ADDED = "Added"
    const REMOVED = "Removed"

    const candJobExpService = new CandidateJobExperienceService();
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
    const [skills, setSkills] = useState([]);
    const [languageLevels] = useState(["A1", "A2", "B1", "B2", "C1", "C2"]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const positionService = new PositionService();
        const schoolService = new SchoolService();
        const departmentService = new DepartmentService();
        const languageService = new LanguageService();
        const skillService = new SkillService();
        positionService.getPositions().then((result) => setPositions(result.data.data));
        schoolService.getSchools().then((result) => setSchools(result.data.data));
        departmentService.getDepartments().then((result) => setDepartments(result.data.data));
        languageService.getLanguages().then((result) => setLanguages(result.data.data));
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
        const index = (user.candidateLanguages.findIndex((candidateLanguage) => candidateLanguage.language.id === language.id))
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
        const index = (user.candidateSkills.findIndex((candidateSkill) => candidateSkill.skill.id === skill.id))
        return index === -1;
    }).map((skill, index) => ({
        key: index,
        text: skill.name,
        value: skill.id,
    }));

    const refreshPage = () => setRefresh(!refresh);

    const handleChange = (fieldName, value) => formik.setFieldValue(fieldName, value);

    const getPushedArray = (arr, object) => {
        arr.push(object)
        return arr
    }

    const deleteAndGetArray = (arr, index) => {
        arr.splice(index, 1)
        return arr
    }

    const addJobExperience = () => {
        const candJobExp = {
            candidateId: user.id,
            positionId: formik.values.position.id,
            quitYear: formik.values.jobQuitYear,
            startYear: formik.values.jobStartYear,
            workPlace: formik.values.workPlace,
            position: {id: formik.values.position.id, title: formik.values.position.title}
        };
        candJobExpService.add(candJobExp).then(r => {
            candJobExp.id = r.data.data.id
            dispatch(changeJobExps(getPushedArray(user.candidateJobExperiences, candJobExp)))
            toast(ADDED)
            refreshPage()
        }).catch(handleCatch)
    }

    const addSchool = () => {
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

    const addLanguage = () => {
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

    const addSkill = () => {
        const newCandidateSkill = {
            candidateId: user.id,
            skillId: formik.values.skill.id,
            skill: {id: formik.values.skill.id, name: formik.values.skill.name}
        };
        candidateSkillService.add(newCandidateSkill)
            .then(r => {
                newCandidateSkill.id = r.data.data.id
                dispatch(changeSkills(getPushedArray(user.candidateSkills, newCandidateSkill)))
                toast(ADDED)
                refreshPage()
            })
            .catch(handleCatch)
    }

    const deleteJobExperience = (jobExpId) => {
        candJobExpService.delete(jobExpId).then(() => {
            const index = user.candidateJobExperiences.findIndex((candJobExp) => jobExpId === candJobExp.id)
            dispatch(changeJobExps(deleteAndGetArray(user.candidateJobExperiences, index)))
            removeCandJobExpFromAllCvs(jobExpId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const deleteSchool = (schoolId) => {
        candidateSchoolService.delete(schoolId).then(() => {
            const index = user.candidateSchools.findIndex((candSchool) => schoolId === candSchool.id)
            dispatch(changeSchools(deleteAndGetArray(user.candidateSchools, index)))
            removeCandSchoolFromAllCvs(schoolId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const deleteLanguage = (langId) => {
        candidateLanguageService.delete(langId).then(() => {
            const index = user.candidateLanguages.findIndex((candLang) => langId === candLang.id)
            dispatch(changeLangs(deleteAndGetArray(user.candidateLanguages, index)))
            removeCandLangFromAllCvs(langId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const deleteSkill = (skillId) => {
        candidateSkillService.delete(skillId).then(() => {
            const index = user.candidateSkills.findIndex((candSkill) => skillId === candSkill.id)
            dispatch(changeSkills(deleteAndGetArray(user.candidateSkills, index)))
            removeCandSkillFromAllCvs(skillId)
            refreshPage()
            toast(REMOVED)
        }).catch(handleCatch)
    }

    const removeCandJobExpFromAllCvs = (jobExpId) => {
        user.cvs.forEach(cv => {
            const index = cv.candidateJobExperiences.findIndex(candJobExp => jobExpId === candJobExp.id)
            if (index !== -1) dispatch(changeCvJobExp(cv.id, deleteAndGetArray(cv.candidateJobExperiences, index)))
        })
    }

    const removeCandLangFromAllCvs = (langId) => {
        user.cvs.forEach(cv => {
            const index = cv.candidateLanguages.findIndex(candLang => langId === candLang.id)
            if (index !== -1) dispatch(changeCvLang(cv.id, deleteAndGetArray(cv.candidateLanguages, index)))
        })
    }

    const removeCandSchoolFromAllCvs = (schoolId) => {
        user.cvs.forEach(cv => {
            const index = cv.candidateSchools.findIndex(candSchool => schoolId === candSchool.id)
            if (index !== -1) dispatch(changeCvSchool(cv.id, deleteAndGetArray(cv.candidateSchools, index)))
        })
    }

    const removeCandSkillFromAllCvs = (skillId) => {
        user.cvs.forEach(cv => {
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

    if (String(userProps.userType) !== "candidate") return <Header content={"Sorry You Do Not Have Access Here"}/>

    return (
        <div>
            <Header dividing content={"Manage Your Infos"}/>
            <Grid stackable style={{marginTop: 10}}>
                <Grid.Column width={16}>
                    <Header textAlign={"center"} dividing color="green" content={"Job Experiences"}/>
                    <Table basic={"very"} size="large" celled unstackable textAlign="center">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell content={"Workplace"}/>
                                <Table.HeaderCell content={"Position"}/>
                                <Table.HeaderCell content={"Start Year"}/>
                                <Table.HeaderCell content={"Quit Year"}/>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {user.candidateJobExperiences?.map((candidateJobExperience) => (
                                <Table.Row key={candidateJobExperience.id}>
                                    <Table.Cell content={candidateJobExperience.workPlace}/>
                                    <Table.Cell content={candidateJobExperience.position?.title}/>
                                    <Table.Cell content={candidateJobExperience.startYear}/>
                                    <Table.Cell content={!candidateJobExperience.quitYear ? "Continues" : candidateJobExperience.quitYear}/>
                                    <Table.Cell icon={"x"} negative selectable error width={1}
                                                onClick={() => deleteJobExperience(candidateJobExperience.id)}/>
                                </Table.Row>
                            ))}
                            <Table.Row>
                                <Table.Cell>
                                    <Input type="text" placeholder="Work Place" value={formik.values.workPlace} name="workPlace"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <Dropdown clearable item placeholder="Position" search selection
                                              value={formik.values.position.id} options={positionOption}
                                              onChange={(event, data) =>
                                                  handleChange("position", {id: data.value, title: event.target.innerText})}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input type="number" placeholder="Start Year" value={formik.values.jobStartYear} name="jobStartYear"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <Input type="number" placeholder="Quit Year" value={formik.values.jobQuitYear} name="jobQuitYear"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Table.Cell>
                                <Table.Cell/>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Button primary onClick={addJobExperience} style={{borderRadius: 15}}
                            disabled={invalidCandJobExp}>
                        <Icon name="plus"/>Add
                    </Button>
                </Grid.Column>

                <Grid.Column width={16}>
                    <Header textAlign={"center"} dividing color="yellow" content={"Schools"}/>
                    <Table basic={"very"} size="large" celled unstackable textAlign="center">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell content={"Schools"}/>
                                <Table.HeaderCell content={"Department"}/>
                                <Table.HeaderCell content={"Start Year"}/>
                                <Table.HeaderCell content={"Graduation Year"}/>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {user.candidateSchools?.map((candidateSchool) => (
                                <Table.Row key={candidateSchool.id}>
                                    <Table.Cell content={candidateSchool.school?.name}/>
                                    <Table.Cell content={candidateSchool.department?.name}/>
                                    <Table.Cell content={candidateSchool.startYear}/>
                                    <Table.Cell content={!candidateSchool.graduationYear ? "Continues" : candidateSchool.graduationYear}/>
                                    <Table.Cell icon={"x"} onClick={() => {
                                        deleteSchool(candidateSchool.id)
                                    }} negative selectable error width={1}/>
                                </Table.Row>
                            ))}
                            <Table.Row>
                                <Table.Cell>
                                    <Dropdown clearable item placeholder="School" search selection value={formik.values.school.id}
                                              options={schoolOption} selectOnBlur={false}
                                              onChange={(event, data) =>
                                                  handleChange("school", {id: data.value, name: event.target.innerText})}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Dropdown clearable item placeholder="Department" search selection
                                              value={formik.values.department.id}
                                              options={departmentOption} selectOnBlur={false}
                                              onChange={(event, data) =>
                                                  handleChange("department", {id: data.value, name: event.target.innerText})}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input type="number" placeholder="Start Year" value={formik.values.schoolStartYear}
                                           name="schoolStartYear"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <Input type="number" placeholder="Graduation Year" value={formik.values.schoolGraduationYear}
                                           name="schoolGraduationYear" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Table.Cell>
                                <Table.Cell/>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Button primary onClick={addSchool} style={{borderRadius: 15}} disabled={invalidCandSchool}>
                        <Icon name="plus"/>Add
                    </Button>
                </Grid.Column>

                <Grid.Column width={8}>
                    <Header textAlign={"center"} dividing color="violet" content={"Languages"}/>
                    <Table basic={"very"} size="large" celled unstackable textAlign="center">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell content={"Languages"}/>
                                <Table.HeaderCell content={"Level(CEFR)"}/>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {user.candidateLanguages?.map((candidateLanguage) => (
                                <Table.Row key={candidateLanguage.id}>
                                    <Table.Cell content={candidateLanguage.language.name}/>
                                    <Table.Cell content={candidateLanguage.languageLevel}/>
                                    <Table.Cell icon={"x"} negative selectable error width={2}
                                                onClick={() => deleteLanguage(candidateLanguage.id)}/>
                                </Table.Row>
                            ))}
                            <Table.Row>
                                <Table.Cell>
                                    <Dropdown clearable item placeholder="Language" search selection selectOnBlur={false}
                                              value={formik.values.language.id} options={languageOption}
                                              onChange={(event, data) =>
                                                  handleChange("language", {id: data.value, name: event.target.innerText})}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Dropdown clearable item placeholder="Language Level" search selection selectOnBlur={false}
                                              value={formik.values.languageLevel} options={languageLevelOption}
                                              onChange={(event, data) =>
                                                  handleChange("languageLevel", data.value)}

                                    />
                                </Table.Cell>
                                <Table.Cell/>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Button primary onClick={addLanguage} style={{borderRadius: 15}}
                            disabled={invalidCandLang}>
                        <Icon name="plus"/>Add
                    </Button>
                </Grid.Column>

                <Grid.Column width={8}>
                    <Header textAlign={"center"} dividing color="pink" content={"Skills"}/>
                    <Grid padded relaxed stackable>
                        {user.candidateSkills?.map((candidateSkill) => (
                            <Button key={candidateSkill.id} color={getRandomColor()}
                                    circular style={{marginTop: 6, marginLeft: 5}}>
                                <Icon name="x" onClick={() => deleteSkill(candidateSkill.id)}/>
                                {candidateSkill.skill?.name}
                            </Button>
                        ))}
                    </Grid>
                    <Dropdown clearable item placeholder="Skill" search selection
                              style={{marginTop: 20, marginLeft: 5}} options={skillOption}
                              value={formik.values.skill.id} selectOnBlur={false}
                              onChange={(event, data) =>
                                  handleChange("skill", {id: data.value, name: event.target.innerText})}
                    />
                    <Button primary attached="right" onClick={addSkill} disabled={invalidCandSkill}>
                        <Icon name="plus"/>Add
                    </Button>
                </Grid.Column>
            </Grid>
            <Header dividing/>
        </div>
    )
}
