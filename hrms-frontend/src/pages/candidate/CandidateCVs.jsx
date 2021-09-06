import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {syncCandCVs} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import {Button, Card, Dropdown, Form, Grid, Header, Icon, Input, Menu, Modal, Popup, Segment, Table} from "semantic-ui-react";
import CandidateCvService from "../../services/candidateCvService";
import {changePropInList, getRandomColor, handleCatch, months} from "../../utilities/Utils";

export function CandidateCVs() {

    const candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)

    const [cvAddPopupOpen, setCvAddPopupOpen] = useState(false);
    const [cvDeletePopupOpen, setCvDeletePopupOpen] = useState(false);
    const [jobExpAddPopupOpen, setJobExpAddPopupOpen] = useState(false);
    const [langAddPopupOpen, setLangAddPopupOpen] = useState(false);
    const [schoolAddPopupOpen, setSchoolAddPopupOpen] = useState(false);
    const [skillAddPopupOpen, setSkillAddPopupOpen] = useState(false);
    const [coverLetterPopupOpen, setCoverLetterPopupOpen] = useState(false);
    const [titlePopupOpen, setTitlePopupOpen] = useState(false);
    const [selectedCv, setSelectedCv] = useState(user?.cvs[0] ? user?.cvs[0] : {});
    const [activeItem, setActiveItem] = useState(selectedCv?.title)

    const formik = useFormik({
        initialValues: {
            title: "", cvAddTitle: "", coverLetter: "",
            jobExperienceIds: [], languageIds: [], schoolIds: [], skillIds: []
        }
    });

    const candidateJobExperienceOption = user.candidateJobExperiences?.filter((candJobExp) => {
        const index = (selectedCv.candidateJobExperiences?.findIndex((cvCandJobExp) => cvCandJobExp.id === candJobExp.id))
        return index === -1;
    }).map((candidateJobExperience, index) => ({
        key: index,
        text: `${candidateJobExperience.workPlace} | ${candidateJobExperience.position.title}`,
        value: candidateJobExperience.id,
    }));

    const candidateLanguageOption = user.candidateLanguages?.filter((candidateLanguage) => {
        const index = (selectedCv.candidateLanguages?.findIndex((candidateLanguage2) => candidateLanguage2.id === candidateLanguage.id))
        return index === -1;
    }).map((candidateLanguage, index) => ({
        key: index,
        text: `${candidateLanguage.language.name} | ${candidateLanguage.languageLevel}`,
        value: candidateLanguage.id,
    }));

    const candidateSchoolOption = user.candidateSchools?.filter((candidateSchool) => {
        const index = (selectedCv.candidateSchools?.findIndex((candidateSchool2) => candidateSchool2.id === candidateSchool.id))
        return index === -1;
    }).map((candidateSchool, index) => ({
        key: index,
        text: `${candidateSchool.school.name} | ${candidateSchool.department.name}`,
        value: candidateSchool.id,
    }));

    const candidateSkillOption = user.candidateSkills?.filter((candidateSkill) => {
        const index = (selectedCv.candidateSkills?.findIndex((candidateSkill2) => candidateSkill2.id === candidateSkill.id))
        return index === -1;
    }).map((candidateSkill, index) => ({
        key: index,
        text: candidateSkill.skill.name,
        value: candidateSkill.id,
    }));

    const handleChange = (fieldName, value) => formik.setFieldValue(fieldName, value);

    const handleMenuItemClick = (activeItem, CvIndex) => {
        setActiveItem(activeItem)
        setSelectedCv(user?.cvs[CvIndex])
    }

    const addCv = () => {
        const CV = {title: formik.values.cvAddTitle, candidateId: user.id}
        candidateCvService.add(CV).then(response => {
            user.cvs.push(response.data.data.CV.data)
            dispatch(syncCandCVs(user.cvs))
            setSelectedCv(user.cvs[user.cvs.length - 1])
            setActiveItem(formik.values.cvAddTitle)
            formik.values.cvAddTitle = ""
            setCvAddPopupOpen(false)
        }).catch(handleCatch)
    }

    const deleteCv = () => {
        candidateCvService.deleteById(selectedCv.id).then(() => {
            const cvIndex = user.cvs.findIndex(cv => cv.id === selectedCv.id)
            user.cvs.splice(cvIndex, 1)
            dispatch(syncCandCVs(user.cvs))
            user.cvs.length === 0 ? setSelectedCv({}) : setSelectedCv(user.cvs[0])
            setCvDeletePopupOpen(false)
            window.scrollTo(0,0)
        }).catch(handleCatch)
    }

    const handleAfterCVUpdate = (response, msg) => {
        const CVs = changePropInList(selectedCv.id, response.data.data, user.cvs)
        dispatch(syncCandCVs(CVs))
        setSelectedCv(response.data.data)
        formik.setValues({...formik.initialValues, coverLetter: formik.values.coverLetter})
        setCoverLetterPopupOpen(false)
        setTitlePopupOpen(false)
        setJobExpAddPopupOpen(false)
        setSkillAddPopupOpen(false)
        setSchoolAddPopupOpen(false)
        setLangAddPopupOpen(false)
        toast(msg)
    }

    const updateCoverLetter = () => {
        candidateCvService.updateCoverLetter(selectedCv.id, formik.values.coverLetter)
            .then(r => handleAfterCVUpdate(r))
            .catch(handleCatch)
    }

    const updateTitle = () => {
        candidateCvService.updateTitle(selectedCv.id, formik.values.title)
            .then(r => handleAfterCVUpdate(r, "Added"))
            .catch(handleCatch)
    }

    const addJobExp = () => {
        if (formik.values.jobExperienceIds.length === 0) return
        candidateCvService.updateJobExperiences(selectedCv.id, formik.values.jobExperienceIds, "add")
            .then(r => handleAfterCVUpdate(r, "Added"))
            .catch(handleCatch)
    }

    const addLanguage = () => {
        if (formik.values.languageIds.length === 0) return
        candidateCvService.updateLanguages(selectedCv.id, formik.values.languageIds, "add")
            .then(r => handleAfterCVUpdate(r, "Added"))
            .catch(handleCatch)
    }

    const addSchool = () => {
        if (formik.values.schoolIds.length === 0) return
        candidateCvService.updateSchools(selectedCv.id, formik.values.schoolIds, "add")
            .then(r => handleAfterCVUpdate(r, "Added"))
            .catch(handleCatch)
    }

    const addSkill = () => {
        if (formik.values.skillIds.length === 0) return
        candidateCvService.updateSkills(selectedCv.id, formik.values.skillIds, "add")
            .then(r => handleAfterCVUpdate(r, "Added"))
            .catch(handleCatch)
    }

    const removeJobExp = (candJobExpId) => {
        candidateCvService.updateJobExperiences(selectedCv.id, [candJobExpId], "remove")
            .then(r => handleAfterCVUpdate(r, "Deleted"))
            .catch(handleCatch)
    }

    const removeLanguage = (candidateLangId) => {
        candidateCvService.updateLanguages(selectedCv.id, [candidateLangId], "remove")
            .then(r => handleAfterCVUpdate(r, "Deleted"))
            .catch(handleCatch)
    }

    const removeSchool = (candidateSchoolId) => {
        candidateCvService.updateSchools(selectedCv.id, [candidateSchoolId], "remove")
            .then(r => handleAfterCVUpdate(r, "Deleted"))
            .catch(handleCatch)
    }

    const removeSkill = (candidateSkillId) => {
        candidateCvService.updateSkills(selectedCv.id, [candidateSkillId], "remove")
            .then(r => handleAfterCVUpdate(r, "Deleted"))
            .catch(handleCatch)
    }

    function editTitle() {
        return (
            <div>
                <Popup
                    trigger={
                        <Button icon={"signup"} size={"big"} basic circular compact style={{}}
                                onClick={() => setTitlePopupOpen(!titlePopupOpen)}/>
                    }
                    content={
                        <Form>
                            <Input placeholder="Title" value={formik.values.title} name="title" onChange={formik.handleChange}
                                   onBlur={formik.handleBlur} actionPosition={"left"} transparent size="large"/>
                            <Button content={"Save"} circular style={{marginTop: 10}} onClick={() => updateTitle()}
                                    secondary compact fluid type="submit"/>
                        </Form>
                    }
                    on='focus' open={titlePopupOpen} position='bottom left' pinned style={{opacity: 0.9}}
                />
                <Header as="font" color="black" style={{fontStyle: "italic"}} content={`Title: ${selectedCv?.title}`}/>
            </div>
        )
    }

    function coverLetterPopup() {
        return (
            <Modal basic onClose={() => setCoverLetterPopupOpen(false)} open={coverLetterPopupOpen} size='small'>
                <Form size="large" as={Segment} basic>
                    <Header content={"Cover Letter"} size={"small"} dividing inverted icon={"write"}/>
                    <Form.TextArea
                        placeholder="Cover Letter (Max. 200 character)" type="text" name="coverLetter"
                        value={formik.values.coverLetter} onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{minHeight: 250, borderRadius: 8}}
                    />
                    <Button color="blue" size="large" style={{borderRadius: 8}} content="Save" onClick={() => updateCoverLetter()}/>
                </Form>
            </Modal>
        )
    }

    function addJobExperiencePopup() {
        return (
            <Modal basic onClose={() => setJobExpAddPopupOpen(false)} onOpen={() => setJobExpAddPopupOpen(true)}
                   open={jobExpAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached="bottom" style={{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing content={"Your Job Experiences"}/>
                    <Dropdown multiple clearable item placeholder="Select job experience(s)" search
                              selection fluid value={formik.values.jobExperienceIds}
                              options={candidateJobExperienceOption}
                              onChange={(event, data) => handleChange(`jobExperienceIds`, data.value)}
                    />
                </Segment>
                <Button onClick={() => addJobExp()} primary attached="bottom" content={"Add To CV"}/>
            </Modal>
        )
    }

    function addSchoolPopup() {
        return (
            <Modal basic onClose={() => setSchoolAddPopupOpen(false)} onOpen={() => setSchoolAddPopupOpen(true)}
                   open={schoolAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached="bottom" style={{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing content={"Your Schools"}/>
                    <Dropdown multiple clearable item placeholder="Select school(s)" search
                              selection fluid value={formik.values.schoolIds}
                              options={candidateSchoolOption}
                              onChange={(event, data) => handleChange(`schoolIds`, data.value)}
                    />
                </Segment>
                <Button onClick={() => addSchool()} primary attached content={"Add To CV"}/>
            </Modal>
        )
    }

    function addLanguagePopup() {
        return (
            <Modal basic onClose={() => setLangAddPopupOpen(false)} onOpen={() => setLangAddPopupOpen(true)}
                   open={langAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached="bottom" style={{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing content={"Your Languages"}/>
                    <Dropdown multiple clearable item placeholder="Select language(s)" search
                              selection fluid value={formik.values.languageIds}
                              options={candidateLanguageOption}
                              onChange={(event, data) => handleChange(`languageIds`, data.value)}
                    />
                </Segment>
                <Button onClick={() => addLanguage()} primary attached content={"Add To CV"}/>
            </Modal>
        )
    }

    function addSkillPopup() {
        return (
            <Modal basic onClose={() => setSkillAddPopupOpen(false)} onOpen={() => setSkillAddPopupOpen(true)}
                   open={skillAddPopupOpen} size='mini'>
                <Segment placeholder secondary attached="bottom" style={{borderRadius: 15}}>
                    <Header textAlign={"center"} dividing content={"Your Skills"}/>
                    <Dropdown multiple clearable item placeholder="Select skill(s)" search
                              selection fluid value={formik.values.skillIds}
                              options={candidateSkillOption}
                              onChange={(event, data) => handleChange(`skillIds`, data.value)}
                    />
                </Segment>
                <Button onClick={() => addSkill()} primary attached content={"Add To CV"}/>
            </Modal>
        )
    }

    function cvManagementMenu() {
        return (
            <div style={{marginRight: -20, marginLeft: -20}}>

                {coverLetterPopup()}
                {addJobExperiencePopup()}
                {addSchoolPopup()}
                {addLanguagePopup()}
                {addSkillPopup()}

                {editTitle()}
                <Card fluid color={getRandomColor()} style={{borderRadius: 15}}>
                    <Card.Content>
                        <Card.Header>
                            Cover Letter
                            <Button icon={"edit"} size={"big"} circular compact style={{marginLeft: 10}}
                                    content={<font className={"handWriting"}>Edit</font>}
                                    onClick={() => setCoverLetterPopupOpen(true)}/>
                        </Card.Header>
                    </Card.Content>
                    <Card.Content as={Grid} padded>
                        <strong>{selectedCv?.coverLetter ? selectedCv?.coverLetter : "There is no cover letter"}</strong>
                    </Card.Content>
                </Card>

                <Segment basic vertical>
                    <Header textAlign={"center"} dividing color="green" content={"Job Experiences"}/>
                    <Table basic={"very"} size={"large"} textAlign="center" celled unstackable>
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
                            {selectedCv.candidateJobExperiences?.map(candidateJobExperience =>
                                <Table.Row key={candidateJobExperience.id}>
                                    <Table.Cell content={candidateJobExperience.workPlace}/>
                                    <Table.Cell content={candidateJobExperience.position?.title}/>
                                    <Table.Cell content={candidateJobExperience.startYear}/>
                                    <Table.Cell content={!candidateJobExperience.quitYear ? "Continues" : candidateJobExperience.quitYear}/>
                                    <Table.Cell icon={"x"} negative selectable error width={1}
                                                onClick={() => removeJobExp(candidateJobExperience.id)}/>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <Button circular icon="plus" color="blue" content={"Add New"} onClick={() => setJobExpAddPopupOpen(true)}/>
                </Segment>

                <Segment basic vertical>
                    <Header textAlign={"center"} dividing color="yellow" content={"Schools"}/>
                    <Table basic={"very"} size="large" celled unstackable textAlign={"center"}>
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
                            {selectedCv.candidateSchools?.map(candidateSchool =>
                                <Table.Row key={candidateSchool.id}>
                                    <Table.Cell content={candidateSchool.school?.name}/>
                                    <Table.Cell content={candidateSchool.department?.name}/>
                                    <Table.Cell content={candidateSchool.startYear}/>
                                    <Table.Cell content={!candidateSchool.graduationYear ? "Continues" : candidateSchool.graduationYear}/>
                                    <Table.Cell icon={"x"} negative selectable error width={1}
                                                onClick={() => removeSchool(candidateSchool.id)}/>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <Button circular icon="plus" color="blue" content={"Add New"} onClick={() => setSchoolAddPopupOpen(true)}/>
                </Segment>

                <Grid stackable columns={"equal"}>
                    <Grid.Column>
                        <Segment basic vertical>
                            <Header textAlign={"center"} dividing color="violet" content={"Languages"}/>
                            <Table basic={"very"} size="large" celled unstackable textAlign={"center"}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell content={"Languages"}/>
                                        <Table.HeaderCell content={"Level(CEFR)"}/>
                                        <Table.HeaderCell/>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {selectedCv.candidateLanguages?.map(candidateLanguage =>
                                        <Table.Row key={candidateLanguage.id}>
                                            <Table.Cell content={candidateLanguage.language.name}/>
                                            <Table.Cell content={candidateLanguage.languageLevel}/>
                                            <Table.Cell icon={"x"} negative selectable error width={2}
                                                        onClick={() => removeLanguage(candidateLanguage.id)}/>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                            <Button circular icon="plus" color="blue" content={"Add New"} onClick={() => setLangAddPopupOpen(true)}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment basic vertical>
                            <Header textAlign={"center"} dividing color="pink" content={"Skills"}/>
                            {selectedCv.candidateSkills?.map(candidateSkill =>
                                <Button key={candidateSkill.id} color={getRandomColor()}
                                        circular style={{marginTop: 5}} onClick={() => removeSkill(candidateSkill.id)}>
                                    <Icon name="x"/>
                                    {candidateSkill.skill?.name}
                                </Button>
                            )}
                            <Button color={"blue"} icon="plus" content={"Add New"} circular style={{marginTop: 5}}
                                    onClick={() => setSkillAddPopupOpen(true)}/>
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
                                        <Button icon={"x"} content={"Delete CV"} negative
                                                onClick={() => setCvDeletePopupOpen(!cvDeletePopupOpen)}/>
                                    }
                                    content={<Button icon={"x"} content={"Delete CV"} negative onClick={() => deleteCv()}/>}
                                    closeOnEscape closeOnTriggerClick on='click' position='bottom center' size={"mini"}
                                    style={{backgroundColor: "rgba(0,0,0,0)"}}
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        )
    }

    if (String(userProps.userType) !== "candidate") return <Header content={"Sorry, You Do Not Have Access Here"}/>

    return (
        <div>
            <Grid stackable padded>
                <Grid.Column width={4}>
                    <strong>Manage Your CVs</strong>
                    <Menu fluid vertical secondary>
                        {user?.cvs?.map(cv =>
                            <Menu.Item key={cv?.id} name={cv?.title} active={activeItem === cv?.title}
                                       onClick={() => handleMenuItemClick(cv?.title, user.cvs.indexOf(cv))}
                            />
                        )}
                        <Popup
                            trigger={
                                <Menu.Item
                                    name={"Add New"} color={"green"} header icon={"plus"}
                                    onClick={() => setCvAddPopupOpen(!cvAddPopupOpen)}
                                    active={cvAddPopupOpen}
                                />
                            }
                            content={
                                <Form>
                                    <Input placeholder="Title" value={formik.values.cvAddTitle} name="cvAddTitle"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           actionPosition={"left"} transparent size="large"/>
                                    <Button content={"Save"} circular style={{marginTop: 10}} onClick={() => addCv()}
                                            secondary compact fluid type="submit"/>
                                </Form>}
                            on='focus' open={cvAddPopupOpen} position='bottom center' pinned
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
