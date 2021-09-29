import {Button, Card, Grid, Header, Icon, Loader, Segment, Transition} from "semantic-ui-react";
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
import AreYouSureModal from "../common/AreYouSureModal";

function CandSkillsSeg
({user, cv, editable = false, defaultClosed = false, width = 8}) {

    const candSkillService = new CandidateSkillService();
    const candCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [skills, setSkills] = useState([]);
    const [active, setActive] = useState(defaultClosed !== true);
    const [candSkillIdDel, setCandSkillIdDel] = useState();

    useEffect(() => {
        return () => {
            setSkills(undefined)
            setActive(undefined)
            setCandSkillIdDel(undefined)
        };
    }, []);

    useEffect(() => {
        if (editable && !cv) {
            const skillService = new SkillService();
            skillService.getAll().then((result) => setSkills(result.data.data));
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

    const onRemove = () => {
        cv ? removeSkillFromCv(candSkillIdDel) : deleteSkill(candSkillIdDel)
        setCandSkillIdDel(undefined)
    }
    const onAdd = () => cv ? addSkillsToCv() : addSkill()

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <AreYouSureModal open={!!candSkillIdDel} message={`Are you sure you want to remove${cv ? "" : " from everywhere"} ?`}
                             yesColor={"red"} noColor={"grey"} onYes={onRemove} onNo={() => setCandSkillIdDel(undefined)}/>
            <Card fluid raised style={{borderRadius: 0, userSelect: "none", backgroundColor: "rgb(250,250,250, 0.4)"}}>
                <Card.Header>
                    <Header textAlign={"center"} dividing color={"pink"} content={"Skills"} onClick={() => setActive(!active)}
                            style={{marginBottom: 0, marginTop: 0, borderRadius: 0, backgroundColor: "rgb(250,250,250, 0.4)"}} block/>
                </Card.Header>
            </Card>
            <Transition visible={active} duration={200} animation={"slide down"}>
                <div>
                    <Segment basic vertical style={{marginTop: -14, borderRadius: 0}}>
                        {candSkills.map((candSkill) => (
                            <Button key={candSkill.id} color={getRandomColor()}
                                    style={{marginTop: 2.5, marginBottom: 2.5, marginLeft: 5, borderRadius: 10}}>
                                {editable ? <Icon onClick={() => setCandSkillIdDel(candSkill.id)} name="x"/> : null}
                                {candSkill.skill?.name}
                            </Button>
                        ))}
                    </Segment>
                    {editable ?
                        <div>
                            {!cv ?
                                <SDropdown options={skillOption} name="skillId" placeholder="Skill" multiple={false} formik={formik}
                                           style={{marginRight: 10}}/> :
                                <SDropdown options={candSkillOption} name="candSkillIds" placeholder="Skills" formik={formik}
                                           loading={false} disabled={candSkillOption.length === 0}
                                           style={{marginRight: 10, color: "rgba(230,20,150,0.9)", backgroundColor: "rgba(255,255,255,0.7)"}}/>}
                            <Button icon="plus" color="blue" content={"Add"} onClick={onAdd}
                                    disabled={!cv ? !formik.values.skillId : formik.values.candSkillIds.length === 0}
                                    style={{marginTop: 10, borderRadius: 10}}/>
                        </div> : null}
                </div>
            </Transition>

        </Grid.Column>
    )
}

export default CandSkillsSeg