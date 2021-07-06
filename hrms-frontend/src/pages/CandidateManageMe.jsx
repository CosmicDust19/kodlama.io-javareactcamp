import {Button, Dropdown, Grid, Header, Icon, Input, Table,} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {
    changeCvJobExp, changeCvLang, changeCvSchool, changeCvSkill, changeJobExps,
    changeLangs, changeSchools, changeSkills,
} from "../store/actions/userActions";
import PositionService from "../services/positionService";
import SchoolService from "../services/schoolService";
import DepartmentService from "../services/departmentService";
import LanguageService from "../services/languageService";
import SkillService from "../services/skillService";
import CandidateJobExperienceService from "../services/candidateJobExperienceService";
import CandidateLanguageService from "../services/candidateLanguageService";
import CandidateSchoolService from "../services/candidateSchoolService";
import CandidateSkillService from "../services/candidateSkillService";
import CandidateCvService from "../services/candidateCvService";

export function CandidateManageMe() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const candidateJobExperienceService = new CandidateJobExperienceService();
    const candidateLanguageService = new CandidateLanguageService();
    const candidateSchoolService = new CandidateSchoolService();
    const candidateSkillService = new CandidateSkillService();
    const candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)

    const [positions, setPositions] = useState([]);
    const [schools, setSchools] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [languageLevels, setLanguageLevels] = useState([]);
    const [skills, setSkills] = useState([]);
    const [refresh, setRefresh] = useState(0);

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
        let index = (user.candidateLanguages.findIndex((candidateLanguage) => {
            return candidateLanguage.language.id === language.id
        }))
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
        let index = (user.candidateSkills.findIndex((candidateSkill) => {
            return candidateSkill.skill.id === skill.id
        }))
        return index === -1;
    }).map((skill, index) => ({
        key: index,
        text: skill.name,
        value: skill.id,
    }));

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const handleJobExperienceAdd = () => {
        const index = user.candidateJobExperiences.findIndex((candidateJobExperience) => {
            return (candidateJobExperience.workPlace === formik.values.workPlace &&
                candidateJobExperience.position.id === formik.values.position.id)
        })
        if (index !== -1) {
            toast.warning("You already have this work place and position")
            return
        }
        const positionIdIndex = positions.findIndex((position) => {
            return (position.id === formik.values.position.id)
        })
        let newCandidateJobExperience = {
            candidateId: user.id,
            position: {id: formik.values.position.id, title: positions[positionIdIndex].title},
            quitYear: formik.values.jobQuitYear,
            startYear: formik.values.jobStartYear,
            workPlace: formik.values.workPlace
        };
        candidateJobExperienceService.add(newCandidateJobExperience).then(r => {
            console.log(r)
            if (r.data.success) {
                newCandidateJobExperience.id = Number(r.data.message)
                user.candidateJobExperiences.push(newCandidateJobExperience)
                dispatch(changeJobExps(user.candidateJobExperiences))
                toast("New Job Experience Added")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleSchoolAdd = () => {
        const index = user.candidateSchools.findIndex((candidateSchool) => {
            return (candidateSchool.school.id === formik.values.school.id &&
                candidateSchool.department.id === formik.values.department.id)
        })
        if (index !== -1) {
            toast.warning("You already have this school and department")
            return
        }
        const schoolIdIndex = schools.findIndex((school) => {
            return (school.id === formik.values.school.id)
        })
        const departmentIdIndex = departments.findIndex((department) => {
            return (department.id === formik.values.department.id)
        })
        let newCandidateSchool = {
            candidateId: user.id,
            school: {id: formik.values.school.id, name: schools[schoolIdIndex].name},
            department: {id: formik.values.department.id, name: departments[departmentIdIndex].name},
            schoolStartYear: formik.values.schoolStartYear,
            graduationYear: formik.values.schoolGraduationYear
        };
        candidateSchoolService.add(newCandidateSchool).then(r => {
            console.log(r)
            if (r.data.success) {
                newCandidateSchool.id = Number(r.data.message)
                user.candidateSchools.push(newCandidateSchool)
                dispatch(changeSchools(user.candidateSchools))
                toast("New School Added")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleLanguageAdd = () => {
        const index = user.candidateLanguages.findIndex((candidateLanguage) => {
            return (candidateLanguage.language.id === formik.values.language.id)
        })
        if (index !== -1) {
            toast.warning("You already have this language")
            return
        }
        const languageIdIndex = languages.findIndex((language) => {
            return (language.id === formik.values.language.id)
        })
        let newCandidateLanguage = {
            candidateId: user.id,
            language: {id: formik.values.language.id, name: languages[languageIdIndex].name},
            languageLevel: formik.values.languageLevel
        };
        candidateLanguageService.add(newCandidateLanguage).then(r => {
            console.log(r)
            if (r.data.success) {
                newCandidateLanguage.id = Number(r.data.message)
                user.candidateLanguages.push(newCandidateLanguage)
                dispatch(changeLangs(user.candidateLanguages))
                toast("New Language Added")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleSkillAdd = () => {
        const index = user.candidateSkills.findIndex((candidateSkill) => {
            return (candidateSkill.skill.id === formik.values.skill.id)
        })
        if (index !== -1) {
            toast.warning("You already have this skill")
            return
        }
        const skillIdIndex = skills.findIndex((skill) => {
            return (skill.id === formik.values.skill.id)
        })
        let newCandidateSkill = {
            candidateId: user.id,
            skill: {id: formik.values.skill.id, name: skills[skillIdIndex].name}
        };
        candidateSkillService.add(newCandidateSkill).then(r => {
            console.log(r)
            if (r.data.success) {
                newCandidateSkill.id = Number(r.data.message)
                user.candidateSkills.push(newCandidateSkill)
                dispatch(changeSkills(user.candidateSkills))
                toast("New Skill Added")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleJobExperienceDelete = (jobExpId) => {
        deleteJobExperienceFromAllCvs(jobExpId)
        candidateJobExperienceService.delete(jobExpId).then(r => {
            console.log(r)
            if (r.data.success) {
                const index = user.candidateJobExperiences.findIndex((candidateJobExperience) => {
                    return jobExpId === candidateJobExperience.id
                })
                user.candidateJobExperiences.splice(index, 1)
                dispatch(changeJobExps(user.candidateJobExperiences))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Removed From Your Infos And All CVs")
            } else {
                toast.warning("A problem has occurred when deleting the job experience")
            }
        }).catch(reason => {
            console.log(reason)
        });
    }

    const handleSchoolDelete = (schoolId) => {
        deleteSchoolFromAllCvs(schoolId)
        candidateSchoolService.delete(schoolId).then(r => {
            console.log(r)
            if (r.data.success) {
                const index = user.candidateSchools.findIndex((candidateSchool) => {
                    return schoolId === candidateSchool.id
                })
                user.candidateSchools.splice(index, 1)
                dispatch(changeSchools(user.candidateSchools))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Removed From Your Infos And All CVs")
            } else {
                toast.warning("A problem has occurred when deleting the school")
            }
        }).catch(reason => {
            console.log(reason)
        });
    }

    const handleLanguageDelete = (langId) => {
        deleteLanguageFromAllCvs(langId)
        candidateLanguageService.delete(langId).then(r => {
            console.log(r)
            if (r.data.success) {
                const index = user.candidateLanguages.findIndex((candidateLanguage) => {
                    return langId === candidateLanguage.id
                })
                user.candidateLanguages.splice(index, 1)
                dispatch(changeLangs(user.candidateLanguages))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Removed From Your Infos And All CVs")
            } else {
                toast.warning("A problem has occurred when deleting the language")
            }
        }).catch(reason => {
            console.log(reason)
        });
    }

    const handleSkillDelete = (skillId) => {
        deleteSkillFromAllCvs(skillId)
        candidateSkillService.delete(skillId).then(r => {
            console.log(r)
            if (r.data.success) {
                const index = user.candidateSkills.findIndex((candidateSkill) => {
                    return skillId === candidateSkill.id
                })
                user.candidateSkills.splice(index, 1)
                dispatch(changeSkills(user.candidateSkills))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Removed From Your Infos And All CVs")
            } else {
                toast.warning("A problem has occurred when deleting the skill")
            }
        }).catch(reason => {
            console.log(reason)
        });
    }

    const deleteJobExperienceFromAllCvs = (jobExpId) => {
        user.candidateCvs.forEach((candidateCv) => {
            const index = candidateCv.candidateJobExperiences.findIndex((candidateJobExperience) => {
                return jobExpId === candidateJobExperience.id
            })
            if (index !== -1) {
                candidateCvService.updateJobExperiences(candidateCv.id, [jobExpId], "delete").then(r => {
                    console.log(r)
                    if (r.data.success) {
                        candidateCv.candidateJobExperiences.splice(index, 1)
                        dispatch(changeCvJobExp(candidateCv.id, candidateCv.candidateJobExperiences))
                    } else toast.warning("A problem has occurred when deleting from your CVs")
                }).catch(reason => {
                    console.log(reason)
                    toast.warning("A problem has occurred when deleting from your CVs")
                });
            }
        })
    }

    const deleteSchoolFromAllCvs = (schoolId) => {
        user.candidateCvs.forEach((candidateCv) => {
            const index = candidateCv.candidateSchools.findIndex((candidateSchool) => {
                return schoolId === candidateSchool.id
            })
            if (index !== -1) {
                candidateCvService.updateSchools(candidateCv.id, [schoolId], "delete").then(r => {
                    console.log(r)
                    if (r.data.success) {
                        candidateCv.candidateSchools.splice(index, 1)
                        dispatch(changeCvSchool(candidateCv.id, candidateCv.candidateSchools))
                    } else toast.warning("A problem has occurred when deleting from your CVs")
                }).catch(reason => {
                    console.log(reason)
                    toast.warning("A problem has occurred when deleting from your CVs")
                });
            }
        })
    }

    const deleteLanguageFromAllCvs = (langId) => {
        user.candidateCvs.forEach((candidateCv) => {
            const index = candidateCv.candidateLanguages.findIndex((candidateLanguage) => {
                return langId === candidateLanguage.id
            })
            if (index !== -1) {
                candidateCvService.updateLanguages(candidateCv.id, [langId], "delete").then(r => {
                    console.log(r)
                    if (r.data.success) {
                        candidateCv.candidateLanguages.splice(index, 1)
                        dispatch(changeCvLang(candidateCv.id, candidateCv.candidateLanguages))
                    } else toast.warning("A problem has occurred when deleting from your CVs")
                }).catch(reason => {
                    console.log(reason)
                    toast.warning("A problem has occurred when deleting from your CVs")
                });
            }
        })
    }

    const deleteSkillFromAllCvs = (skillId) => {
        user.candidateCvs.forEach((candidateCv) => {
            const index = candidateCv.candidateSkills.findIndex((candidateSkill) => {
                return skillId === candidateSkill.id
            })
            if (index !== -1) {
                candidateCvService.updateSkills(candidateCv.id, [skillId], "delete").then(r => {
                    console.log(r)
                    if (r.data.success) {
                        candidateCv.candidateSkills.splice(index, 1)
                        dispatch(changeCvSkill(candidateCv.id, candidateCv.candidateSkills))
                    } else toast.warning("A problem has occurred when deleting from your CVs")
                }).catch(reason => {
                    console.log(reason)
                    toast.warning("A problem has occurred when deleting from your CVs")
                });
            }
        })
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
                                                  value={formik.values.position.id}
                                                  options={positionOption}
                                                  onChange={(event, data) => {
                                                      handleChange("position.id", data.value)
                                                  }}
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
                        <Button primary onClick={handleJobExperienceAdd} style={{borderRadius: 15}} disabled={
                            formik.values.workPlace.trim().length === 0 || formik.values.position.id <= 0 || !formik.values.position.id ||
                            formik.values.jobStartYear > new Date().getFullYear() || formik.values.jobStartYear < 1900 ||
                            (!!formik.values.jobQuitYear && (formik.values.jobQuitYear > new Date().getFullYear() ||
                                formik.values.jobQuitYear < 1900 || formik.values.jobStartYear > formik.values.jobQuitYear))}
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
                                        <Table.Cell>{candidateSchool.schoolStartYear}</Table.Cell>
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
                                                  options={schoolOption}
                                                  onChange={(event, data) => {
                                                      handleChange("school.id", data.value)
                                                  }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Department" search selection
                                                  value={formik.values.department.id}
                                                  options={departmentOption}
                                                  onChange={(event, data) => {
                                                      handleChange("department.id", data.value)
                                                  }}
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
                        <Button primary onClick={handleSchoolAdd} style={{borderRadius: 15}} disabled={
                            formik.values.school.id <= 0 || formik.values.department.id <= 0 || !formik.values.school.id || !formik.values.department.id ||
                            formik.values.schoolStartYear > new Date().getFullYear() || formik.values.schoolStartYear < 1900 ||
                            (!!formik.values.schoolGraduationYear && (formik.values.schoolGraduationYear > new Date().getFullYear() ||
                                formik.values.schoolGraduationYear < 1900 || formik.values.schoolStartYear > formik.values.schoolGraduationYear))
                        }><Icon name="plus"/>Add</Button>
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
                                        <Table.Cell icon={"x"} onClick={() => {
                                            handleLanguageDelete(candidateLanguage.id)
                                        }} negative selectable error width={2}/>
                                    </Table.Row>
                                ))}
                                <Table.Row>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Language" search selection
                                                  value={formik.values.language.id}
                                                  options={languageOption}
                                                  onChange={(event, data) => {
                                                      handleChange("language.id", data.value)
                                                  }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown clearable item placeholder="Language Level" search selection
                                                  value={formik.values.languageLevel}
                                                  options={languageLevelOption}
                                                  onChange={(event, data) => {
                                                      handleChange("languageLevel", data.value)
                                                  }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Button primary onClick={handleLanguageAdd} style={{borderRadius: 15}} disabled={
                            formik.values.language.id <= 0 || !formik.values.language.id || !formik.values.languageLevel
                        }><Icon name="plus"/>Add</Button>
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="pink">
                            Skills
                        </Header>
                        <Grid padded relaxed stackable>
                            {user.candidateSkills?.map((candidateSkill) => (
                                <Button key={candidateSkill.id} color={colors[Math.floor(Math.random() * 12)]}
                                        circular style={{marginTop: 6, marginLeft: 5}}>
                                    <Icon name="x" onClick = {() => {
                                        handleSkillDelete(candidateSkill.id)
                                    }}/>{candidateSkill.skill?.name}
                                </Button>
                            ))}
                        </Grid>
                        <Dropdown clearable item placeholder="Skill" search selection
                                  style={{marginTop: 20, marginLeft: 5}}
                                  value={formik.values.skill.id}
                                  options={skillOption}
                                  onChange={(event, data) => {
                                      handleChange("skill.id", data.value)
                                  }}
                        />
                        <Button primary attached="right" onClick={handleSkillAdd} disabled={
                            formik.values.skill.id <= 0 || !formik.values.skill.id}><Icon
                            name="plus"/>Add</Button>
                    </Grid.Column>
                </Grid>
            </Grid>
            <Header dividing/>
        </div>
    )
}
