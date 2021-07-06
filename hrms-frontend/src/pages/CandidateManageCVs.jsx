import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    addCv, changeCoverLetter, changeCvJobExp, changeCvLang,
    changeCvSchool, changeCvSkill, changeTitle, deleteCv
} from "../store/actions/userActions";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import {
    Button, Card, Dropdown, Form, Grid, Header, Icon, Input,
    Menu, Modal, Popup, Segment, Table
} from "semantic-ui-react";
import CandidateCvService from "../services/candidateCvService";

export function CandidateManageCvs() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    let color = colors[Math.floor(Math.random() * 12)]

    let candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)

    const [isCvAddPopupOpen, setIsCvAddPopupOpen] = useState(false);
    const [isCvDeletePopupOpen, setIsCvDeletePopupOpen] = useState(false);
    const [isJobExpAddPopupOpen, setIsJobExpAddPopupOpen] = useState(false);
    const [isLangAddPopupOpen, setIsLangAddPopupOpen] = useState(false);
    const [isSchoolAddPopupOpen, setIsSchoolAddPopupOpen] = useState(false);
    const [isSkillAddPopupOpen, setIsSkillAddPopupOpen] = useState(false);
    const [isCoverLetterPopupOpen, setIsCoverLetterPopupOpen] = useState(false);
    const [isTitlePopupOpen, setIsTitlePopupOpen] = useState(false);
    const [index, setIndex] = useState(0)
    const [selectedCv, setSelectedCv] = useState({});
    const [activeItem, setActiveItem] = useState()
    const [refresh, setRefresh] = useState(0);

    const formik = useFormik({
        initialValues: {
            title: "", cvAddTitle: "", coverLetter: "",
            jobExperienceIds: [], languageIds: [], schoolIds: [], skillIds: []
        }
    });

    useEffect(() => {
        if (user.candidateCvs && user.candidateCvs[index]) setSelectedCv(user?.candidateCvs[index]);
    }, [index, user?.candidateCvs]);

    const candidateJobExperienceOption = user.candidateJobExperiences?.filter((candidateJobExperience) => {
        let index = (selectedCv.candidateJobExperiences?.findIndex((candidateJobExperience2) => {
            return candidateJobExperience2.id === candidateJobExperience.id
        }))
        return index === -1;
    }).map((candidateJobExperience, index) => ({
        key: index,
        text: `${candidateJobExperience.workPlace} | ${candidateJobExperience.position.title}`,
        value: candidateJobExperience.id,
    }));

    const candidateLanguageOption = user.candidateLanguages?.filter((candidateLanguage) => {
        let index = (selectedCv.candidateLanguages?.findIndex((candidateLanguage2) => {
            return candidateLanguage2.id === candidateLanguage.id
        }))
        return index === -1;
    }).map((candidateLanguage, index) => ({
        key: index,
        text: `${candidateLanguage.language.name} | ${candidateLanguage.languageLevel}`,
        value: candidateLanguage.id,
    }));

    const candidateSchoolOption = user.candidateSchools?.filter((candidateSchool) => {
        let index = (selectedCv.candidateSchools?.findIndex((candidateSchool2) => {
            return candidateSchool2.id === candidateSchool.id
        }))
        return index === -1;
    }).map((candidateSchool, index) => ({
        key: index,
        text: `${candidateSchool.school.name} | ${candidateSchool.department.name}`,
        value: candidateSchool.id,
    }));

    const candidateSkillOption = user.candidateSkills?.filter((candidateSkill) => {
        let index = (selectedCv.candidateSkills?.findIndex((candidateSkill2) => {
            return candidateSkill2.id === candidateSkill.id
        }))
        return index === -1;
    }).map((candidateSkill, index) => ({
        key: index,
        text: candidateSkill.skill.name,
        value: candidateSkill.id,
    }));

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const handleMenuItemClick = (activeItem, CvIndex) => {
        setActiveItem(activeItem)
        setIndex(CvIndex)
    }

    const handleCvAdd = () => {
        if (!formik.values.cvAddTitle || formik.values.cvAddTitle === "") {
            toast.warning("Please give a title to add a new CV", {
                autoClose: 1800
            })
            return
        }
        let index = user.candidateCvs.findIndex((candidateCv) => {
            return candidateCv.title === formik.values.cvAddTitle
        })
        if (index !== -1) {
            toast.warning("Please choose an unused title", {
                autoClose: 2500
            })
            return
        }
        let CV = {title: formik.values.cvAddTitle, candidateId: user.id}
        candidateCvService.add(CV).then(response => {
            console.log(response)
            if (response.data.success) {
                const createdId = Number(response.data.message)
                dispatch(addCv({
                    id: createdId, title: formik.values.cvAddTitle, createdAt: new Date(),
                    candidateJobExperiences: [], candidateLanguages: [], candidateSchools: [], candidateSkills: []
                }))
                setSelectedCv(user.candidateCvs[user.candidateCvs.length - 1])
                setActiveItem(formik.values.cvAddTitle)
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
            formik.values.cvAddTitle = ""
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleCvDelete = () => {
        candidateCvService.delete(selectedCv.id).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(deleteCv(selectedCv.id))
                if (user.candidateCvs.length === 0) setSelectedCv({})
                else setSelectedCv(user.candidateCvs[0])
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleCoverLetterSubmit = () => {
        candidateCvService.updateCoverLetter(selectedCv.id, formik.values.coverLetter).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCoverLetter(selectedCv.id, formik.values.coverLetter))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleTitleSubmit = () => {
        if (formik.values.title.length === 0) {
            toast.warning("Title should be at least 1 character", {
                autoClose: 1800
            })
            return
        }
        let index = user.candidateCvs.findIndex((candidateCv) => {
            return candidateCv.title === formik.values.title
        })
        if (index !== -1) {
            toast.warning("Please choose an unused title", {
                autoClose: 1800
            })
            return
        }
        candidateCvService.updateTitle(selectedCv.id, formik.values.title).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeTitle(selectedCv.id, formik.values.title))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
    }

    const handleCvJobExperiencesAdd = () => {
        if (formik.values.jobExperienceIds.length === 0) return
        formik.values.jobExperienceIds.forEach((jobExperienceId) => {
            let index = user.candidateJobExperiences.findIndex((candidateJobExperience) => {
                return candidateJobExperience.id === jobExperienceId
            })
            selectedCv.candidateJobExperiences.push(user.candidateJobExperiences[index])
        })
        candidateCvService.updateJobExperiences(selectedCv.id, formik.values.jobExperienceIds, "add").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvJobExp(selectedCv.id, selectedCv.candidateJobExperiences))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        formik.values.jobExperienceIds = []
    }

    const handleCvLanguageAdd = () => {
        if (formik.values.languageIds.length === 0) return
        formik.values.languageIds.forEach((languageId) => {
            let index = user.candidateLanguages.findIndex((candidateLanguage) => {
                return candidateLanguage.id === languageId
            })
            selectedCv.candidateLanguages.push(user.candidateLanguages[index])
        })
        candidateCvService.updateLanguages(selectedCv.id, formik.values.languageIds, "add").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvLang(selectedCv.id, selectedCv.candidateLanguages))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        formik.values.languageIds = []
    }

    const handleCvSchoolAdd = () => {
        if (formik.values.schoolIds.length === 0) return
        formik.values.schoolIds.forEach((schoolId) => {
            let index = user.candidateSchools.findIndex((candidateSchool) => {
                return candidateSchool.id === schoolId
            })
            selectedCv.candidateSchools.push(user.candidateSchools[index])
        })
        candidateCvService.updateSchools(selectedCv.id, formik.values.schoolIds, "add").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvSchool(selectedCv.id, selectedCv.candidateSchools))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        formik.values.schoolIds = []
    }

    const handleCvSkillAdd = () => {
        if (formik.values.skillIds.length === 0) return
        formik.values.skillIds.forEach((skillId) => {
            let index = user.candidateSkills.findIndex((candidateSkill) => {
                return candidateSkill.id === skillId
            })
            selectedCv.candidateSkills.push(user.candidateSkills[index])
        })
        candidateCvService.updateSkills(selectedCv.id, formik.values.skillIds, "add").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvSkill(selectedCv.id, selectedCv.candidateSkills))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        formik.values.skillIds = []
    }

    const handleCvJobExperiencesDelete = (candidateJobExpId) => {
        let index = selectedCv.candidateJobExperiences.findIndex((candidateJobExperience) => {
            return candidateJobExperience.id === candidateJobExpId
        })
        selectedCv.candidateJobExperiences.splice(index, 1)
        candidateCvService.updateJobExperiences(selectedCv.id, [candidateJobExpId], "delete").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvJobExp(selectedCv.id, selectedCv.candidateJobExperiences))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        if (refresh === 0) setRefresh(1);
        else setRefresh(0)
    }

    const handleCvLanguageDelete = (candidateLangId) => {
        let index = selectedCv.candidateLanguages.findIndex((candidateLanguage) => {
            return candidateLanguage.id === candidateLangId
        })
        selectedCv.candidateLanguages.splice(index, 1)
        candidateCvService.updateLanguages(selectedCv.id, [candidateLangId], "delete").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvLang(selectedCv.id, selectedCv.candidateLanguages))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        if (refresh === 0) setRefresh(1);
        else setRefresh(0)
    }

    const handleCvSchoolDelete = (candidateSchoolId) => {
        let index = selectedCv.candidateSchools.findIndex((candidateSchool) => {
            return candidateSchool.id === candidateSchoolId
        })
        selectedCv.candidateSchools.splice(index, 1)
        candidateCvService.updateSchools(selectedCv.id, [candidateSchoolId], "delete").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvSchool(selectedCv.id, selectedCv.candidateSchools))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        if (refresh === 0) setRefresh(1);
        else setRefresh(0)
    }

    const handleCvSkillDelete = (candidateSkillId) => {
        let index = selectedCv.candidateSkills.findIndex((candidateSkill) => {
            return candidateSkill.id === candidateSkillId
        })
        selectedCv.candidateSkills.splice(index, 1)
        candidateCvService.updateSkills(selectedCv.id, [candidateSkillId], "delete").then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeCvSkill(selectedCv.id, selectedCv.candidateSkills))
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            toast.warning("A problem has occurred")
            console.log(reason)
        })
        if (refresh === 0) setRefresh(1);
        else setRefresh(0)
    }

    function editTitle() {
        return (
            <Grid centered>
                <Grid.Column width="8" textAlign="right">
                    <Popup
                        trigger={
                            <Button icon={"signup"} size={"big"} basic circular compact
                                    style={{marginTop: -20, marginRight: 40}}
                                    onClick={() => {
                                        if (isTitlePopupOpen) setIsTitlePopupOpen(false)
                                        if (!isTitlePopupOpen) setIsTitlePopupOpen(true)
                                    }}/>}
                        content={
                            <Form>
                                <Input placeholder="Title" value={formik.values.title} name="title"
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       actionPosition={"left"} transparent size="large"/>
                                <Button content={"Save"} circular style={{marginTop: 10}} onClick={() => {
                                    handleTitleSubmit()
                                    setIsTitlePopupOpen(false)
                                }} secondary compact fluid type="submit"/>
                            </Form>}
                        on='focus' open={isTitlePopupOpen} position='left center' pinned
                        style={{opacity: 0.8}}
                    />
                </Grid.Column>
                <Grid.Column width="8" textAlign={"left"}>
                    <Header>
                        <font color="black" style={{fontStyle: "italic", marginLeft: -50}}>
                            Title: {selectedCv?.title}</font>
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }

    function coverLetterPopup() {
        return (
            <Modal basic onClose={() => setIsCoverLetterPopupOpen(false)} onOpen={() => setIsCoverLetterPopupOpen(true)}
                   open={isCoverLetterPopupOpen} size='small'>
                <Form size="large" style={{marginLeft: "3em", marginBottom: 50}}>
                    <label><b>Cover Letter</b></label>
                    <Form.TextArea
                        placeholder="Cover Letter"
                        type="text"
                        value={formik.values.coverLetter}
                        name="coverLetter"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{minHeight: 200, marginTop: 15, borderRadius: 10}}
                    />
                    <Button color="blue" size="large" onClick={() => {
                        handleCoverLetterSubmit()
                        setIsCoverLetterPopupOpen(false)
                    }} content="Save"/>
                </Form>
            </Modal>
        )
    }

    function addJobExperiencePopup() {
        return (
            <Modal basic onClose={() => setIsJobExpAddPopupOpen(false)} onOpen={() => setIsJobExpAddPopupOpen(true)}
                   open={isJobExpAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached = "bottom" style = {{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing>
                        Your Job Experiences
                    </Header>
                    <Dropdown multiple clearable item placeholder="Select job experience(s)" search
                              selection fluid value={formik.values.jobExperienceIds}
                              options={candidateJobExperienceOption}
                              onChange={(event, data) => {
                                  handleChange(`jobExperienceIds`, data.value)
                              }}
                    />

                </Segment>
                <Button onClick={() => {
                    handleCvJobExperiencesAdd()
                    setIsJobExpAddPopupOpen(false)
                }} primary attached = "bottom">Add To CV</Button>
            </Modal>
        )
    }

    function addSchoolPopup() {
        return (
            <Modal basic onClose={() => setIsSchoolAddPopupOpen(false)} onOpen={() => setIsSchoolAddPopupOpen(true)}
                   open={isSchoolAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached = "bottom" style = {{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing>
                        Your Schools
                    </Header>
                    <Dropdown multiple clearable item placeholder="Select school(s)" search
                              selection fluid value={formik.values.schoolIds}
                              options={candidateSchoolOption}
                              onChange={(event, data) => {
                                  handleChange(`schoolIds`, data.value)
                              }}
                    />
                </Segment>
                <Button onClick={() => {
                    handleCvSchoolAdd()
                    setIsSchoolAddPopupOpen(false)
                }} primary attached>Add To CV</Button>
            </Modal>
        )
    }

    function addLanguagePopup() {
        return (
            <Modal basic onClose={() => setIsLangAddPopupOpen(false)} onOpen={() => setIsLangAddPopupOpen(true)}
                   open={isLangAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached = "bottom" style = {{borderRadius: 15}} >
                    <Header textAlign={"center"} dividing>
                        Your Languages
                    </Header>
                    <Dropdown multiple clearable item placeholder="Select language(s)" search
                              selection fluid value={formik.values.languageIds}
                              options={candidateLanguageOption}
                              onChange={(event, data) => {
                                  handleChange(`languageIds`, data.value)
                              }}
                    />
                </Segment>
                <Button onClick={() => {
                    handleCvLanguageAdd()
                    setIsLangAddPopupOpen(false)
                }} primary attached>Add To CV</Button>
            </Modal>
        )
    }

    function addSkillPopup() {
        return (
            <Modal basic onClose={() => setIsSkillAddPopupOpen(false)} onOpen={() => setIsSkillAddPopupOpen(true)}
                   open={isSkillAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached = "bottom" style = {{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing>
                        Your Skills
                    </Header>
                    <Dropdown multiple clearable item placeholder="Select skill(s)" search
                              selection fluid value={formik.values.skillIds}
                              options={candidateSkillOption}
                              onChange={(event, data) => {
                                  handleChange(`skillIds`, data.value)
                              }}
                    />
                </Segment>
                <Button onClick={() => {
                    handleCvSkillAdd()
                    setIsSkillAddPopupOpen(false)
                }} primary attached>Add To CV</Button>
            </Modal>
        )
    }

    function cvManagementMenu() {
        return (
            <div>

                {editTitle()}
                {coverLetterPopup()}
                {addJobExperiencePopup()}
                {addSchoolPopup()}
                {addLanguagePopup()}
                {addSkillPopup()}

                <Card fluid color={color} style = {{borderRadius: 15}}>
                    <Card.Content>
                        <Card.Header>
                            Cover Letter
                            <Button icon={"edit"} size={"big"} circular compact
                                    style={{marginLeft: 10}}
                                    onClick={() => {
                                        setIsCoverLetterPopupOpen(true)
                                    }} content="Edit"/>
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <font color="black"
                              style={{fontStyle: "italic"}}>{selectedCv?.coverLetter ? selectedCv?.coverLetter :
                            "There is no cover letter"}</font>
                    </Card.Content>
                </Card>

                <Segment basic>
                    <Header textAlign={"center"} dividing color="green">
                        Job Experiences
                    </Header>
                    <Table basic={"very"} size={"large"} textAlign="center" celled unstackable>
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
                            {selectedCv.candidateJobExperiences?.map((candidateJobExperience) => (
                                <Table.Row key={candidateJobExperience.id}>
                                    <Table.Cell>{candidateJobExperience.workPlace}</Table.Cell>
                                    <Table.Cell>{candidateJobExperience.position?.title}</Table.Cell>
                                    <Table.Cell>{candidateJobExperience.startYear}</Table.Cell>
                                    <Table.Cell>{!candidateJobExperience.quitYear ? "Continues" : candidateJobExperience.quitYear}</Table.Cell>
                                    <Table.Cell icon={"x"} onClick={() => {
                                        handleCvJobExperiencesDelete(candidateJobExperience.id)
                                    }} negative selectable error width={1}/>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <Button circular icon="plus" color="blue" content={"Add New"} onClick={() => {
                        setIsJobExpAddPopupOpen(true)
                    }}/>
                </Segment>

                <Segment basic>
                    <Header textAlign={"center"} dividing color="yellow">
                        Schools
                    </Header>
                    <Table basic={"very"} size="large" celled unstackable textAlign={"center"}>
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
                            {selectedCv.candidateSchools?.map((candidateSchool) => (
                                <Table.Row key={candidateSchool.id}>
                                    <Table.Cell>{candidateSchool.school?.name}</Table.Cell>
                                    <Table.Cell>{candidateSchool.department?.name}</Table.Cell>
                                    <Table.Cell>{candidateSchool.schoolStartYear}</Table.Cell>
                                    <Table.Cell>{!candidateSchool.graduationYear ? "Continues" : candidateSchool.graduationYear}</Table.Cell>
                                    <Table.Cell icon={"x"} onClick={() => {
                                        handleCvSchoolDelete(candidateSchool.id)
                                    }} negative selectable error width={1}/>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <Button circular icon="plus" color="blue" content={"Add New"} onClick={() => {
                        setIsSchoolAddPopupOpen(true)
                    }}/>
                </Segment>

                <Grid columns={"equal"}>
                    <Grid.Column>
                        <Segment basic>
                            <Header textAlign={"center"} dividing color="violet">
                                Languages
                            </Header>
                            <Table basic={"very"} size="large" celled unstackable textAlign={"center"}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Languages</Table.HeaderCell>
                                        <Table.HeaderCell>Level(CEFR)</Table.HeaderCell>
                                        <Table.HeaderCell/>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {selectedCv.candidateLanguages?.map((candidateLanguage) => (
                                        <Table.Row key={candidateLanguage.id}>
                                            <Table.Cell>{candidateLanguage.language.name}</Table.Cell>
                                            <Table.Cell>{candidateLanguage.languageLevel}</Table.Cell>
                                            <Table.Cell icon={"x"} onClick={() => {
                                                handleCvLanguageDelete(candidateLanguage.id)
                                            }} negative selectable error width={2}/>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            <Button circular icon="plus" color="blue" content={"Add New"} onClick={() => {
                                setIsLangAddPopupOpen(true)
                            }}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment basic>
                            <Header textAlign={"center"} dividing color="pink">
                                Skills
                            </Header>
                            {selectedCv.candidateSkills?.map((candidateSkill) => (
                                <Button key={candidateSkill.id} color={colors[Math.floor(Math.random() * 12)]}
                                        circular style={{marginTop: 5}} onClick={() => {
                                    handleCvSkillDelete(candidateSkill.id)
                                }}>
                                    <Icon name="x"/>
                                    {candidateSkill.skill?.name}
                                </Button>
                            ))}
                            <Button color={"blue"} icon="plus" content={"Add New"}
                                    circular style={{marginTop: 5}} onClick={() => {
                                setIsSkillAddPopupOpen(true)
                            }}/>
                        </Segment>
                    </Grid.Column>
                </Grid>

                <Table basic={"very"} textAlign="right">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <label><b>
                                    Created at
                                    {` ${new Date(selectedCv?.createdAt).getDate()} 
                                    ${months[new Date(selectedCv?.createdAt).getMonth()]} 
                                    ${new Date(selectedCv?.createdAt).getFullYear()} `}
                                </b></label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <Popup
                                    trigger={
                                        <Button icon={"x"} content={"Delete CV"} negative onClick = {() => {
                                            if (isCvDeletePopupOpen) setIsCvDeletePopupOpen(false)
                                            if (!isCvDeletePopupOpen) setIsCvDeletePopupOpen(true)
                                        }}/>}
                                    content={
                                        <Button icon={"x"} content={"Delete CV"} negative onClick={() => {
                                            handleCvDelete()
                                            setIsCvDeletePopupOpen(false)
                                        }}/>}
                                    on='focus' position='bottom center' size={"mini"} open = {isCvDeletePopupOpen}
                                    style={{opacity: 0.9}}
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        )
    }

    return (
        <div>
            <Grid padded>
                <Grid.Column width={4}>
                    <strong>Manage Your CVs</strong>
                    <Menu fluid vertical secondary>
                        {user?.candidateCvs?.map((candidateCv) => (
                            <Menu.Item
                                key={candidateCv?.id}
                                name={candidateCv?.title}
                                active={activeItem === candidateCv?.title}
                                onClick={() => handleMenuItemClick(candidateCv?.title, user.candidateCvs.indexOf(candidateCv))}
                            />
                        ))}
                        <Popup
                            trigger={
                                <Menu.Item
                                    name={"Add New"} color={"green"} header icon={"plus"}
                                    onClick={() => {
                                        if (isCvAddPopupOpen) setIsCvAddPopupOpen(false)
                                        if (!isCvAddPopupOpen) setIsCvAddPopupOpen(true)
                                    }}
                                    active={isCvAddPopupOpen}
                                />}
                            content={
                                <Form>
                                    <Input placeholder="Title" value={formik.values.cvAddTitle} name="cvAddTitle"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           actionPosition={"left"} transparent size="large"/>
                                    <Button content={"Save"} circular style={{marginTop: 10}} onClick={() => {
                                        handleCvAdd()
                                        setIsCvAddPopupOpen(false)
                                    }} secondary compact fluid type="submit"/>
                                </Form>}
                            on='focus' open={isCvAddPopupOpen} position='bottom center' pinned
                            style={{opacity: 0.8}}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                    {selectedCv.id ? cvManagementMenu() : null}
                </Grid.Column>
            </Grid>
        </div>
    )
}