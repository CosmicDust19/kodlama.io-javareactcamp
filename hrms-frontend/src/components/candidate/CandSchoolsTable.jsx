import {Button, Grid, Icon, Loader, Table, Transition} from "semantic-ui-react";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import SInput from "../../utilities/customFormControls/SInput";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import CandidateSchoolService from "../../services/candidateSchoolService";
import SchoolService from "../../services/schoolService";
import DepartmentService from "../../services/departmentService";
import {useFormik} from "formik";
import {getDepartmentOption, getSchoolOption, handleCatch} from "../../utilities/Utils";
import {changeSchools} from "../../store/actions/userActions";
import {getFilteredCandSchOption, onCVUpdate, onPropAdd, syncCandidate} from "../../utilities/CandidateUtils";
import CandidateCvService from "../../services/candidateCvService";
import ManagementTable from "../common/ManagementTable";
import AreYouSureModal from "../common/AreYouSureModal";

function CandSchoolsTable
({user, cv, editable = false, defaultClosed = false, unstackable = false, vertical = false, small = false, width = 16}) {

    const candSchService = new CandidateSchoolService();
    const candCvService = new CandidateCvService();

    const dispatch = useDispatch();

    const [schools, setSchools] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [active, setActive] = useState(defaultClosed !== true);
    const [candSchIdDel, setCandSchIdDel] = useState();

    useEffect(() => {
        return () => {
            setSchools(undefined)
            setDepartments(undefined)
            setActive(undefined)
            setCandSchIdDel(undefined)
        };
    }, []);

    useEffect(() => {
        if (editable && !cv) {
            const schoolService = new SchoolService();
            const departmentService = new DepartmentService();
            schoolService.getAll().then((result) => setSchools(result.data.data));
            departmentService.getAll().then((result) => setDepartments(result.data.data));
        }
    }, [cv, editable]);

    const formik = useFormik({
        initialValues: {
            candidateId: user.id, schoolId: "", departmentId: "", startYear: "", graduationYear: "", candSchIds: []
        }
    });

    if (!user || !user.candidateSchools) return <Loader active inline='centered' style={{marginTop: 50}}/>

    const cvCandSchs = cv ? (cv.candidateSchools ? cv.candidateSchools : []) : null
    const userCandSchs = user.candidateSchools ? user.candidateSchools : []
    const candSchs = cvCandSchs ? cvCandSchs : userCandSchs

    if (!editable && (candSchs.length === 0)) return null

    const inputStyle = {width: 215}
    const tableSize = small || (vertical && !editable) ? "small" : "large"
    const segmentSize = small ? "small" : undefined

    const schoolOption = !cv || !editable ? getSchoolOption(schools) : null
    const departmentOption = !cv || !editable ? getDepartmentOption(departments) : null
    const candSchOption = cv ? getFilteredCandSchOption(userCandSchs, cvCandSchs) : null

    const invalidCandSchool = !cv ?
        !formik.values.schoolId ||
        !formik.values.departmentId ||
        formik.values.startYear > new Date().getFullYear() ||
        formik.values.startYear < 1900 ||
        formik.values.graduationYear === 0 ||
        (!!formik.values.graduationYear &&
            (formik.values.graduationYear > new Date().getFullYear() ||
                formik.values.graduationYear < 1900 ||
                formik.values.startYear > formik.values.graduationYear)) : null

    //profile functions
    const addSchool = () =>
        candSchService.add(formik.values)
            .then(r => onPropAdd(dispatch, r.data.data, user.candidateSchools, changeSchools))
            .catch(handleCatch)

    const deleteSchool = (schoolId) => candSchService.delete(schoolId)
        .then(() => syncCandidate(dispatch, user.id))
        .catch(handleCatch)
    //

    //cv functions
    const addSchsToCv = () => {
        if (formik.values.candSchIds.length === 0) return
        candCvService.updateSchools(cv.id, formik.values.candSchIds, "add")
            .then(r => {
                onCVUpdate(dispatch, cv.id, user.cvs, r, "Added")
                formik.setValues({candSchIds: []})
            })
            .catch(handleCatch)
    }

    const removeSchFromCv = (candSchId) =>
        candCvService.updateSchools(cv.id, [candSchId], "remove")
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r, "Removed"))
            .catch(handleCatch)
    //

    const onRemove = () => {
        cv ? removeSchFromCv(candSchIdDel) : deleteSchool(candSchIdDel)
        setCandSchIdDel(undefined)
    }

    const headerRow = [
        "Schools", "Department", "Start Year", "Graduation Year",
        editable && (candSchs.length !== 0 || !cv) ? "" : undefined
    ]

    const tableData = candSchs
        .map(candSch => ({candSch: candSch}))
        .sort((a, b) => {
            if (!a.candSch.graduationYear) return -1
            else if (!b.candSch.graduationYear) return 1
            return b.candSch.graduationYear - a.candSch.graduationYear
        })

    const renderBodyRow = ({candSch}, i) => ({
        key: i,
        cells: [
            {content: candSch.school.name, key: "school"},
            {content: candSch.department.name, key: "department"},
            {content: candSch.startYear, key: "startYear"},
            candSch.graduationYear ? {content: candSch.graduationYear, key: "gradYear"} : "Continues",
            editable ?
                <Table.Cell key={"del"} onClick={() => setCandSchIdDel(candSch.id)} negative selectable
                            icon={<Icon name={"x"} style={{marginRight: 0}}/>}/> : null
        ]
    })

    const footerCells = editable && !cv ? [
        <SDropdown options={schoolOption} name="schoolId" placeholder="School" multiple={false} formik={formik} style={{}}/>,
        <SDropdown options={departmentOption} name="departmentId" placeholder="Department" multiple={false} formik={formik} style={{}}/>,
        <SInput name="startYear" placeholder="Start Year" formik={formik} style={inputStyle} type="number"/>,
        <SInput name="graduationYear" placeholder="Graduation Year" formik={formik} style={inputStyle} type="number"/>
    ] : null

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <AreYouSureModal open={!!candSchIdDel} message={`Are you sure you want to remove${cv ? "" : " from everywhere"} ?`}
                             yesColor={"red"} noColor={"grey"} onYes={onRemove} onNo={() => setCandSchIdDel(undefined)}/>
            <ManagementTable
                headerContent={"Schools"} color={"yellow"} unstackable={unstackable} open={active} setOpen={setActive}
                tableSize={tableSize} segmentSize={segmentSize} onAdd={addSchool} addDisabled={invalidCandSchool}
                headerRow={headerRow} tableData={tableData} renderBodyRow={renderBodyRow} footerCells={footerCells}/>
            <Transition visible={active} duration={200} animation={"slide down"}>
                <div>
                    {editable && cv ?
                        <div>
                            <SDropdown options={candSchOption} name="candSchIds" placeholder="Schools"
                                       formik={formik} loading={false} disabled={candSchOption.length === 0}
                                       style={{marginRight: 10, color: "rgba(220,150,10,0.9)", backgroundColor: "rgba(255,255,255,0.7)"}}/>
                            <Button icon="plus" color="blue" content={"Add"} onClick={addSchsToCv}
                                    disabled={formik.values.candSchIds.length === 0} style={{marginTop: 10, borderRadius: 10}}/>
                        </div> : null}
                </div>
            </Transition>
        </Grid.Column>
    )
}

export default CandSchoolsTable