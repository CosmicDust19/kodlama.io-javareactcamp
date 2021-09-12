import {Accordion, Button, Card, Grid, Header, Icon, Loader, Segment} from "semantic-ui-react";
import {getRandomColor, handleCatch} from "../../utilities/Utils";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import CandidateSkillService from "../../services/candidateSkillService";
import SkillService from "../../services/skillService";
import {useFormik} from "formik";
import {getFilteredCandSkillOption, getFilteredSkillOption, onCVUpdate, onPropAdd, syncCandidate} from "../../utilities/CandidateUtils";
import {changeSkills} from "../../store/actions/userActions";
import CandidateCvService from "../../services/candidateCvService";

function CandSkillsSeg({user, cv, editable = false, defaultClosed = false, width = 8}) {

    const candSkillService = new CandidateSkillService();
    const candCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [skills, setSkills] = useState([]);
    const [open, setOpen] = useState(defaultClosed !== true);

    useEffect(() => {
        if (editable && !cv) {
            const skillService = new SkillService();
            skillService.getSkills().then((result) => setSkills(result.data.data));
        }
    }, [cv, editable]);

    const formik = useFormik({
        initialValues: {
            candidateId: user.id, skillId: "", candSkillIds: []
        }
    });

    if (!user || !user.candidateSkills) return <Loader active inline='centered' style={{marginTop: 50}}/>

    const cvCandSkills = cv ? (cv?.candidateSkills ? cv?.candidateSkills : []) : null
    const userCandSkills = user.candidateSkills ? user.candidateSkills : []
    const candSkills = cvCandSkills ? cvCandSkills : userCandSkills

    if (!editable && (candSkills.length === 0)) return null

    const skillOption = !cv || !editable ? getFilteredSkillOption(skills, user.candidateSkills) : null
    const candSkillOption = cv ? getFilteredCandSkillOption(userCandSkills, cvCandSkills) : null

    //profile functions
    const addSkill = () =>
        candSkillService.add(formik.values)
            .then(r => {
                onPropAdd(dispatch, r.data.data, user.candidateSkills, changeSkills)
                formik.setFieldValue("skillId", "")
            })
            .catch(handleCatch)

    const deleteSkill = (skillId) => candSkillService.delete(skillId)
        .then(() => syncCandidate(dispatch, user.id))
        .catch(handleCatch)
    //

    //cv functions
    const addSkillsToCv = () => {
        if (formik.values.candSkillIds.length === 0) return
        candCvService.updateSkills(cv.id, formik.values.candSkillIds, "add")
            .then(r => {
                onCVUpdate(dispatch, cv.id, user.cvs, r, "Added")
                formik.setValues({candSkillIds: []})
            })
            .catch(handleCatch)
    }

    const removeSkillFromCv = (candSkillId) =>
        candCvService.updateSkills(cv.id, [candSkillId], "remove")
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r, "Removed"))
            .catch(handleCatch)
    //

    const onRemove = (candSkillId) => cv ? removeSkillFromCv(candSkillId) : deleteSkill(candSkillId)
    const onAdd = () => cv ? addSkillsToCv() : addSkill()

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <Accordion>
                <Accordion.Title onClick={() => setOpen(!open)} active={open}>
                    <Card fluid raised style={{borderRadius: 0}} onClick={() => {}}>
                        <Card.Header>
                            <Header textAlign={"center"} dividing color="pink" content={"Skills"}
                                    style={{marginBottom: 0, borderRadius: 0}} block/>
                        </Card.Header>
                    </Card>
                </Accordion.Title>
                <Accordion.Content active={open} as={Segment} basic vertical
                                   style={{marginTop: -6, borderRadius: 0}}>
                    {candSkills.map((candidateSkill) => (
                        <Button key={candidateSkill.id} color={getRandomColor()}
                                style={{marginTop: 2.5, marginBottom: 2.5, marginLeft: 5, borderRadius: 10}}>
                            {editable ? <Icon onClick={() => onRemove(candidateSkill.id)} name="x"/> : null}
                            {candidateSkill.skill?.name}
                        </Button>
                    ))}
                </Accordion.Content>
            </Accordion>
            {editable && open ?
                <div>
                    {!cv ?
                        <SDropdown options={skillOption} name="skillId" placeholder="Skill" multiple={false} formik={formik}
                                   style={{marginRight: 10}}/> :
                        <SDropdown options={candSkillOption} name="candSkillIds" placeholder="Skills" formik={formik}
                                   loading={false} disabled={candSkillOption.length === 0}
                                   style={{marginRight: 10, color: "rgba(230,20,150,0.9)"}}/>}
                    <Button icon="plus" color="blue" content={"Add"} onClick={onAdd}
                            disabled={!cv ? !formik.values.skillId : formik.values.candSkillIds.length === 0}
                            style={{marginTop: 10, borderRadius: 10}}/>
                </div> : null}
        </Grid.Column>
    )
}

export default CandSkillsSeg