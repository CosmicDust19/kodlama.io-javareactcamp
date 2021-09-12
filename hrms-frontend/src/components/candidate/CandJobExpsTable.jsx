import {Accordion, Button, Card, Grid, Header, Icon, Loader, Segment, Table} from "semantic-ui-react";
import SInput from "../../utilities/customFormControls/SInput";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {changeJobExps} from "../../store/actions/userActions";
import {getPositionOption, handleCatch} from "../../utilities/Utils";
import CandidateJobExperienceService from "../../services/candidateJobExperienceService";
import {getFilteredCandJobExpOption, onCVUpdate, onPropAdd, syncCandidate} from "../../utilities/CandidateUtils";
import {useDispatch} from "react-redux";
import PositionService from "../../services/positionService";
import CandidateCvService from "../../services/candidateCvService";

function CandJobExpsTable({user, cv, editable = false, defaultClosed = false, unstackable = false, vertical = false, small = false, width = 16}) {

    const candJobExpService = new CandidateJobExperienceService();
    const candCvService = new CandidateCvService();

    const dispatch = useDispatch();

    const [positions, setPositions] = useState([]);
    const [open, setOpen] = useState(defaultClosed !== true);

    useEffect(() => {
        if (editable && !cv) {
            const positionService = new PositionService();
            positionService.getPositions().then((result) => setPositions(result.data.data));
        }
    }, [cv, editable]);

    const formik = useFormik({
        initialValues: {
            candidateId: user?.id, workPlace: "", positionId: "", quitYear: "", startYear: "", candJobExpIds: []
        }
    });

    if (!user || !user.candidateJobExperiences) return <Loader active inline='centered' style={{marginTop: 50}}/>

    const cvCandJobExps = cv ? (cv.candidateJobExperiences ? cv.candidateJobExperiences : []) : null
    const userCandJobExps = user.candidateJobExperiences ? user.candidateJobExperiences : []
    const candJobExps = cvCandJobExps ? cvCandJobExps : userCandJobExps

    if (!editable && (candJobExps.length === 0)) return null

    const inputStyle = {width: 215}
    const tableSize = small || (vertical && !editable) ? "small" : "large"
    const segmentSize = small ? "small" : undefined

    const positionOption = !cv || !editable ? getPositionOption(positions) : null
    const candJobExpOption = cv ? getFilteredCandJobExpOption(userCandJobExps, cvCandJobExps) : null

    const invalidCandJobExp = !cv ?
        formik.values.workPlace.trim().length === 0 ||
        !formik.values.positionId ||
        formik.values.startYear > new Date().getFullYear() ||
        formik.values.startYear < 1900 ||
        formik.values.quitYear === 0 ||
        (!!formik.values.quitYear &&
            (formik.values.quitYear > new Date().getFullYear() ||
                formik.values.quitYear < 1900 ||
                formik.values.startYear > formik.values.quitYear)) : null

    //profile functions
    const addJobExperience = () =>
        candJobExpService.add(formik.values)
            .then(r => onPropAdd(dispatch, r.data.data, candJobExps, changeJobExps))
            .catch(handleCatch)

    const deleteJobExperience = (jobExpId) => candJobExpService.delete(jobExpId)
        .then(() => syncCandidate(dispatch, user.id))
        .catch(handleCatch)
    //

    //cv functions
    const addJobExpsToCv = () => {
        if (formik.values.candJobExpIds.length === 0) return
        candCvService.updateJobExperiences(cv.id, formik.values.candJobExpIds, "add")
            .then(r => {
                onCVUpdate(dispatch, cv.id, user.cvs, r, "Added")
                formik.setValues({candJobExpIds: []})
            })
            .catch(handleCatch)
    }

    const removeJobExpFromCv = (candJobExpId) =>
        candCvService.updateJobExperiences(cv.id, [candJobExpId], "remove")
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r, "Removed"))
            .catch(handleCatch)
    //

    const onRemove = (candJobExpId) => cv ? removeJobExpFromCv(candJobExpId) : deleteJobExperience(candJobExpId)

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <Accordion>
                <Accordion.Title onClick={() => setOpen(!open)} active={open}>
                    <Card fluid raised style={{borderRadius: 0}} onClick={() => {}}>
                        <Card.Header>
                            <Header textAlign={"center"} dividing color="green" content={"Job Experiences"}
                                    style={{marginBottom: 0, borderRadius: 0}} block/>
                        </Card.Header>
                    </Card>
                </Accordion.Title>
                <Accordion.Content active={open} as={Segment} size={segmentSize} raised vertical
                                   style={{marginTop: -6.5, marginBottom: 10, borderRadius: 0}}>
                    <Table size={tableSize} celled unstackable={unstackable} textAlign="center" striped
                           style={{marginTop: -14, marginBottom: -14, borderRadius: 0}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell content={"Work Place"}/>
                                <Table.HeaderCell content={"Position"}/>
                                <Table.HeaderCell content={"Start Year"}/>
                                <Table.HeaderCell content={"Quit Year"}/>
                                {editable && (candJobExps.length !== 0 || !cv) ? <Table.HeaderCell/> : null}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {candJobExps.map((candJobExp) => (
                                <Table.Row key={candJobExp.id}>
                                    <Table.Cell content={candJobExp.workPlace}/>
                                    <Table.Cell content={candJobExp.position.title}/>
                                    <Table.Cell content={candJobExp.startYear}/>
                                    <Table.Cell content={!candJobExp.quitYear ? "Continues" : candJobExp.quitYear}/>
                                    {editable ? <Table.Cell onClick={() => onRemove(candJobExp.id)} negative selectable
                                                            icon={<Icon name={"x"} style={{marginRight: 0}}/>}/> : null}
                                </Table.Row>
                            ))}
                        </Table.Body>

                        {editable && !cv ?
                            <Table.Footer>
                                <Table.Row>
                                    <Table.Cell>
                                        <SInput name="workPlace" placeholder="Work Place" formik={formik} style={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SDropdown options={positionOption} name="positionId" placeholder="Position"
                                                   multiple={false} formik={formik} style={{}}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SInput name="startYear" placeholder="Start Year" formik={formik}
                                                style={inputStyle} type="number"/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SInput name="quitYear" placeholder="Quit Year" formik={formik}
                                                style={inputStyle} type="number"/>
                                    </Table.Cell>
                                    <Table.Cell positive icon={<Icon name={"plus"} style={{marginRight: 0}} disabled={invalidCandJobExp}/>}
                                                onClick={addJobExperience} selectable disabled={invalidCandJobExp}/>
                                </Table.Row>
                            </Table.Footer> : null}
                    </Table>
                </Accordion.Content>
            </Accordion>
            {editable && cv && open ?
                <div>
                    <SDropdown options={candJobExpOption} name="candJobExpIds" placeholder="Job experiences"
                               formik={formik} loading={false} disabled={candJobExpOption.length === 0}
                               style={{marginRight: 10, color: "rgba(30,170,30,0.9)"}}/>
                    <Button icon="plus" color="blue" content={"Add"} onClick={addJobExpsToCv}
                            disabled={formik.values.candJobExpIds.length === 0} style={{marginTop: 10, borderRadius: 10}}/>
                </div> : null}
        </Grid.Column>
    )
}

export default CandJobExpsTable;