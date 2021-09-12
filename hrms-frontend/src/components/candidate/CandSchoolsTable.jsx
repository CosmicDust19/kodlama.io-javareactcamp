import {Accordion, Button, Card, Grid, Header, Icon, Loader, Segment, Table} from "semantic-ui-react";
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

function CandSchoolsTable({user, cv, editable = false, defaultClosed = false, unstackable = false, vertical = false, small = false, width = 16}) {

    const candSchService = new CandidateSchoolService();
    const candCvService = new CandidateCvService();

    const dispatch = useDispatch();

    const [schools, setSchools] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(defaultClosed !== true);

    useEffect(() => {
        if (editable && !cv) {
            const schoolService = new SchoolService();
            const departmentService = new DepartmentService();
            schoolService.getSchools().then((result) => setSchools(result.data.data));
            departmentService.getDepartments().then((result) => setDepartments(result.data.data));
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

    const onRemove = (candSchId) => cv ? removeSchFromCv(candSchId) : deleteSchool(candSchId)

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <Accordion>
                <Accordion.Title onClick={() => setOpen(!open)} active={open}>
                    <Card fluid raised style={{borderRadius: 0}} onClick={() => {}}>
                        <Card.Header>
                            <Header textAlign={"center"} dividing color="yellow" content={"Schools"}
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
                                <Table.HeaderCell content={"Schools"}/>
                                <Table.HeaderCell content={"Department"}/>
                                <Table.HeaderCell content={"Start Year"}/>
                                <Table.HeaderCell content={"Graduation Year"}/>
                                {editable && (candSchs.length !== 0 || !cv) ? <Table.HeaderCell/> : null}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {candSchs.map((candSch) => (
                                <Table.Row key={candSch.id}>
                                    <Table.Cell content={candSch.school?.name}/>
                                    <Table.Cell content={candSch.department?.name}/>
                                    <Table.Cell content={candSch.startYear}/>
                                    <Table.Cell content={!candSch.graduationYear ? "Continues" : candSch.graduationYear}/>
                                    {editable ? <Table.Cell onClick={() => onRemove(candSch.id)} negative selectable
                                                            icon={<Icon name={"x"} style={{marginRight: 0}}/>}/> : null}
                                </Table.Row>
                            ))}
                        </Table.Body>

                        {editable && !cv ?
                            <Table.Footer>
                                <Table.Row>
                                    <Table.Cell>
                                        <SDropdown options={schoolOption} name="schoolId" placeholder="School"
                                                   multiple={false} formik={formik} style={{}}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SDropdown options={departmentOption} name="departmentId" placeholder="Department"
                                                   multiple={false} formik={formik} style={{}}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SInput name="startYear" placeholder="Start Year" formik={formik}
                                                style={inputStyle} type="number"/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SInput name="graduationYear" placeholder="Graduation Year" formik={formik}
                                                style={inputStyle} type="number"/>
                                    </Table.Cell>
                                    <Table.Cell positive icon={<Icon name={"plus"} style={{marginRight: 0}} disabled={invalidCandSchool}/>}
                                                onClick={addSchool} selectable disabled={invalidCandSchool}/>
                                </Table.Row>
                            </Table.Footer> : null}
                    </Table>
                </Accordion.Content>
            </Accordion>
            {editable && cv && open ?
                <div>
                    <SDropdown options={candSchOption} name="candSchIds" placeholder="Schools"
                               formik={formik} loading={false} disabled={candSchOption.length === 0}
                               style={{marginRight: 10, color: "rgba(220,150,10,0.9)"}}/>
                    <Button icon="plus" color="blue" content={"Add"} onClick={addSchsToCv}
                            disabled={formik.values.candSchIds.length === 0} style={{marginTop: 10, borderRadius: 10}}/>
                </div> : null}
        </Grid.Column>
    )
}

export default CandSchoolsTable