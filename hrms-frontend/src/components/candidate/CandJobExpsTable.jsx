import {Button, Grid, Icon, Loader, Table, Transition} from "semantic-ui-react";
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
import ManagementTable from "../common/ManagementTable";
import AreYouSureModal from "../common/AreYouSureModal";

function CandJobExpsTable
({user, cv, editable = false, defaultClosed = false, unstackable = false, vertical = false, small = false, width = 16}) {

    const candJobExpService = new CandidateJobExperienceService();
    const candCvService = new CandidateCvService();

    const dispatch = useDispatch();

    const [positions, setPositions] = useState([]);
    const [active, setActive] = useState(defaultClosed !== true);
    const [candJobExpIdDel, setCandJobExpIdDel] = useState();

    useEffect(() => {
        return () => {
            setPositions(undefined)
            setActive(undefined)
            setCandJobExpIdDel(undefined)
        };
    }, []);

    useEffect(() => {
        if (editable && !cv) {
            const positionService = new PositionService();
            positionService.getAll().then((result) => setPositions(result.data.data));
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

    const onRemove = () => {
        cv ? removeJobExpFromCv(candJobExpIdDel) : deleteJobExperience(candJobExpIdDel)
        setCandJobExpIdDel(undefined)
    }

    const headerRow = [
        "Workplace", "Position", "Start Year", "Quit Year",
        editable && (candJobExps.length !== 0 || !cv) ? "" : undefined
    ]

    const tableData = candJobExps
        .map(candJobExp => ({candJobExp: candJobExp}))
        .sort((a, b) => {
            if (!a.candJobExp.quitYear) return -1
            else if (!b.candJobExp.quitYear) return 1
            return b.candJobExp.quitYear - a.candJobExp.quitYear
        })

    // semantic takes the field value as the key. we guaranteed that they will be different by giving a unique key
    const renderBodyRow = ({candJobExp}, i) => ({
        key: i,
        cells: [
            {content: candJobExp.workPlace, key: "workPlace"},
            {content: candJobExp.position.title, key: "position"},
            {content: candJobExp.startYear, key: "startYear"},
            candJobExp.quitYear ? {content: candJobExp.quitYear, key: "quitYear"} : "Continues",
            editable ?
                <Table.Cell key={"del"} onClick={() => setCandJobExpIdDel(candJobExp.id)} negative selectable
                            icon={<Icon name={"x"} style={{marginRight: 0}}/>}/> : null
        ]
    })

    const footerCells = editable && !cv ? [
        <SInput name="workPlace" placeholder="Workplace" formik={formik} style={inputStyle}/>,
        <SDropdown options={positionOption} name="positionId" placeholder="Position" multiple={false} formik={formik} style={{}}/>,
        <SInput name="startYear" placeholder="Start Year" formik={formik} style={inputStyle} type="number"/>,
        <SInput name="quitYear" placeholder="Quit Year" formik={formik} style={inputStyle} type="number"/>
    ] : null

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <AreYouSureModal open={!!candJobExpIdDel} message={`Are you sure you want to remove${cv ? "" : " from everywhere"} ?`}
                             yesColor={"red"} noColor={"grey"} onYes={onRemove} onNo={() => setCandJobExpIdDel(undefined)}/>
            <ManagementTable
                headerContent={"Job Experiences"} color={"green"} unstackable={unstackable} open={active} setOpen={setActive}
                tableSize={tableSize} segmentSize={segmentSize} onAdd={addJobExperience} addDisabled={invalidCandJobExp}
                headerRow={headerRow} tableData={tableData} renderBodyRow={renderBodyRow} footerCells={footerCells}/>
            <Transition visible={active} duration={200} animation={"slide down"}>
                <div>
                    {editable && cv ?
                        <div>
                            <SDropdown options={candJobExpOption} name="candJobExpIds" placeholder="Job experiences"
                                       formik={formik} loading={false} disabled={candJobExpOption.length === 0}
                                       style={{marginRight: 10, color: "rgba(30,170,30,0.9)", backgroundColor: "rgba(255,255,255,0.7)"}}/>
                            <Button icon="plus" color="blue" content={"Add"} onClick={addJobExpsToCv}
                                    disabled={formik.values.candJobExpIds.length === 0} style={{marginTop: 10, borderRadius: 10}}/>
                        </div> : null}
                </div>
            </Transition>
        </Grid.Column>
    )
}

export default CandJobExpsTable;