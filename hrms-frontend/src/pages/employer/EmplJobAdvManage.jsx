import JobAdvertisementService from "../../services/jobAdvertisementService";
import React, {useEffect, useState} from "react";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import {Button, Dropdown, Form, Grid, Icon, Input, Label, Popup, Segment, TextArea} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {syncEmplJobAdvert, syncEmplJobAdverts} from "../../store/actions/userActions";

export function EmplJobAdvManage(props) {

    const jobAdvertisementService = new JobAdvertisementService()

    const errPopupStyle = {
        borderRadius: 10,
        color: "rgba(227,7,7)",
        backgroundColor: "rgba(250,250,250, 0.7)",
        marginTop: -5
    }
    const infoPopupStyle = {
        borderRadius: 10,
        color: "rgb(0,0,0)",
        backgroundColor: "rgba(250,250,250, 0.7)",
        marginTop: -5
    }
    const jobAdvAddDropdownStyle = {
        marginLeft: 20, marginRight: 20,
        marginTop: 15, marginBottom: 15,
        width: 200, height: 35
    }
    const jobAdvAddInputStyle = {
        marginLeft: 20, marginRight: 20,
        marginTop: 15, marginBottom: 15,
        width: 200, height: 40
    }

    const jobAdvAddPopupPosition = "bottom center"

    const workTimes = ["Part Time", "Full Time"]
    const workModels = ["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]

    const dispatch = useDispatch();

    const user = useSelector(state => state?.user?.userProps.user)
    const userProps = useSelector(state => state?.user?.userProps)

    const [jobAdvert, setJobAdvert] = useState(props.jobAdvert);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        setJobAdvert(props.jobAdvert)
    }, [props.jobAdvert]);

    let adding;
    let initialValues;
    if (!jobAdvert) {
        initialValues = {
            employerId: userProps.user?.id, jobDescription: "", positionId: "", workTime: "",
            workModel: "", openPositions: "", cityId: "",
            minSalary: "", maxSalary: "", deadline: new Date().toISOString().split('T')[0],
        }
        adding = true
    } else {
        initialValues = {
            id: jobAdvert.id,
            employerId: userProps.user?.id, jobDescription: jobAdvert.jobDescription,
            positionId: jobAdvert.position.id, cityId: jobAdvert.city.id,
            workTime: jobAdvert.workTime, workModel: jobAdvert.workModel,
            openPositions: jobAdvert.openPositions, deadline: jobAdvert.deadline,
            minSalary: jobAdvert.minSalary === null ? "" : jobAdvert.minSalary,
            maxSalary: jobAdvert.maxSalary === null ? "" : jobAdvert.maxSalary,
        }
        adding = false
    }

    const jobAdvValidationSchema = Yup.object().shape({
        positionId: Yup.string().required("Required"),
        cityId: Yup.string().required("Required"),
        workModel: Yup.string().required("Required"),
        workTime: Yup.string().required("Required"),
        minSalary: Yup.number().integer().positive("Should be positive"),
        maxSalary: Yup.number().integer().when("minSalary", {
            is: minSalary => !!minSalary,
            then: Yup.number().integer().moreThan(Yup.ref("minSalary"), "Cannot be less than min salary")
        }),
        openPositions: Yup.number().integer().required("Required").positive("Should be positive"),
        deadline: Yup.date().required("Required").min(new Date(), "Deadline should be a date in the future"),
        jobDescription: Yup.string().required("Required")
    });

    const add = (values) => {
        jobAdvertisementService.add(values).then((result) => {
            console.log(result)
            user.jobAdvertisements.push(result.data.data)
            dispatch(syncEmplJobAdverts(user.jobAdvertisements))
            props.refresh()
            toast("Your advert received. It will be published after verification")
        }).catch(handleCatch)
    }

    const update = (values) => {
        jobAdvertisementService.update(values).then((result) => {
            console.log(result)
            dispatch(syncEmplJobAdvert(values.id, result.data.data))
            setJobAdvert(result.data.data)
            toast("Your update request received. It will be visible after confirmation")
        }).catch(handleCatch)
    }

    const changeActivation = (jobAdv, status) => {
        jobAdvertisementService.updateActivation(jobAdv.id, status).then((result) => {
            console.log(result)
            dispatch(syncEmplJobAdvert(jobAdv.id, result.data.data))
            setJobAdvert(result.data.data)
            if (status === true) toast("Activated")
            else toast("Deactivated")
        }).catch(handleCatch)
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: jobAdvValidationSchema,
        onSubmit: values => adding ? add(values) : update(values)
    });

    const workTimeOption = workTimes.map((workTime, index) => ({
        key: index,
        text: workTime,
        value: workTime,
    }));

    const workModelOption = workModels.map((workModel, index) => ({
        key: index,
        text: workModel,
        value: workModel,
    }));

    const cityOption = cities.map((city, index) => ({
        key: index,
        text: city.name,
        value: city.id,
    }));

    const positionOption = positions.map((position, index) => ({
        key: index,
        text: position.title,
        value: position.id,
    }));

    const errPopupOnOpen = (field) => {
        setTimeout(() => {
            formik.setFieldTouched(field, false)
        }, 1500)
    }

    const handleCatch = (error) => {
        const resp = error.response
        console.log(error)
        console.log(resp)
        if (resp.data?.data?.errors) {
            Object.entries(resp.data.data.errors).forEach((invalidProp) => {
                invalidProp[1] = invalidProp[1].toLowerCase()
                const message = `${invalidProp[1].charAt(0).toUpperCase()}${invalidProp[1].substr(1)}`
                const propName = `${invalidProp[0].charAt(0).toUpperCase()}${invalidProp[0].substr(1)}`
                toast.warning(`${message} (${propName})`)
            })
            return
        }
        if (resp.data?.data?.details) {
            for (let i = 0; i < resp.data.data.details.length; i++) {
                const detail = resp.data.data.details[i]
                if (detail.includes("uk_job_advertisements_emp_pos_desc_city")) {
                    toast.warning("You already have an advert in this city, position and description")
                    return
                } else if (detail.includes("uk_job_advertisement_updates_emp_pos_desc_city")) {
                    toast.warning("You already have an advert update request or an advert in this city, position and description")
                    return
                }
            }
        }
        if (resp.data?.message) {
            toast.warning(resp.data.message)
        }
    }

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    return (
        <Segment raised style={{borderRadius: 10, centered: true}} textAlign={"center"}>
            {adding === false ?
                <div align={"right"}>
                    {!jobAdvert.verified && jobAdvert.rejected === null ?
                        <Label style={{marginTop: 4, backgroundColor: "rgba(0,94,255,0.1)"}}>
                            <Icon name="bullhorn" color="blue"/>Release Approval
                        </Label> : null}
                    {jobAdvert.updateVerified === false ?
                        <Label style={{marginTop: 4, backgroundColor: "rgba(255,113,0,0.1)"}}>
                            <Icon name="redo alternate" color="orange"/>Update Approval
                        </Label> : null}
                    {jobAdvert.verified === true ?
                        <Label style={{marginTop: 4, backgroundColor: "rgba(58,255,0,0.1)"}}>
                            <Icon name="check circle outline" color="green"/>Verified
                        </Label> : null}
                    {jobAdvert.rejected === true ?
                        <Label style={{marginTop: 4, backgroundColor: "rgba(226,14,14,0.1)"}}>
                            <Icon name="ban" color="red"/>Rejected
                        </Label> : null}
                    {jobAdvert.active === true ?
                        <Label style={{marginTop: 4, backgroundColor: "rgba(57,255,0,0.1)"}}>
                            <Icon name="checkmark" color="green"/>Active
                        </Label> :
                        <Label style={{marginTop: 4, backgroundColor: "rgba(76,16,11,0.1)"}}>
                            <Icon name="minus circle" color="brown"/>Inactive
                        </Label>}
                    <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                              simple labeled>
                        <Dropdown.Menu
                            style={{
                                marginTop: 0,
                                marginLeft: -6,
                                backgroundColor: "rgba(250,250,250, 0.7)",
                                borderRadius: 10
                            }}>
                            {jobAdvert.active === false ?
                                <Dropdown.Item
                                    onClick={() => changeActivation(jobAdvert, true)}>
                                    <Icon name="check circle outline" color="green"/>Activate
                                </Dropdown.Item> :
                                <Dropdown.Item
                                    onClick={() => changeActivation(jobAdvert, false)}>
                                    <Icon name="minus circle" color="brown"/>Deactivate
                                </Dropdown.Item>}
                        </Dropdown.Menu>
                    </Dropdown>
                </div> : null}
            <Form onSubmit={formik.handleSubmit}>

                <Grid padded="vertically">
                    <Grid.Column>
                        <Popup
                            trigger={
                                <Dropdown clearable item placeholder="City" search selection
                                          options={cityOption} value={formik.values.cityId}
                                          style={jobAdvAddDropdownStyle} selectOnBlur={false}
                                          onChange={(event, data) => handleChange("cityId", data.value)}/>
                            }
                            content={formik.errors.cityId ? formik.errors.cityId : "City"}
                            position={jobAdvAddPopupPosition}
                            style={formik.errors.cityId ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.cityId && formik.touched.cityId}
                            onOpen={() => errPopupOnOpen("cityId")}
                        />
                        <Popup
                            trigger={
                                <Dropdown clearable item placeholder="Position" search selection
                                          options={positionOption} value={formik.values.positionId}
                                          style={jobAdvAddDropdownStyle} selectOnBlur={false}
                                          onChange={(event, data) => handleChange("positionId", data.value)}/>
                            }
                            content={formik.errors.positionId ? formik.errors.positionId : "Position"}
                            position={"bottom center"} style={formik.errors.positionId ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.positionId && formik.touched.positionId}
                            onOpen={() => errPopupOnOpen("positionId")}
                        />
                        <Popup
                            trigger={
                                <Dropdown clearable item placeholder="Work Model" search selection
                                          options={workModelOption} value={formik.values.workModel}
                                          style={jobAdvAddDropdownStyle} selectOnBlur={false}
                                          onChange={(event, data) => handleChange("workModel", data.value)}/>
                            }
                            content={formik.errors.workModel ? formik.errors.workModel : "Work Model"}
                            position={"bottom center"} style={formik.errors.workModel ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.workModel && formik.touched.workModel}
                            onOpen={() => errPopupOnOpen("workModel")}
                        />
                        <Popup
                            trigger={
                                <Dropdown clearable item placeholder="Work Time" search selection
                                          options={workTimeOption} value={formik.values.workTime}
                                          style={jobAdvAddDropdownStyle} selectOnBlur={false}
                                          onChange={(event, data) => handleChange("workTime", data.value)}/>
                            }
                            content={formik.errors.workTime ? formik.errors.workTime : "Work Time"}
                            position={"bottom center"} style={formik.errors.workTime ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.workTime && formik.touched.workTime}
                            onOpen={() => errPopupOnOpen("workTime")}
                        />
                        <Popup
                            trigger={
                                <Input placeholder="Min Salary" value={formik.values.minSalary}
                                       name="minSalary" type="number" style={jobAdvAddInputStyle}
                                       onChange={formik.handleChange} icon={"money bill alternate"}/>
                            }
                            content={formik.errors.minSalary ? formik.errors.minSalary : "Min Salary (Optional)"}
                            position={"bottom center"} style={formik.errors.minSalary ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.minSalary && formik.touched.minSalary}
                            onOpen={() => errPopupOnOpen("minSalary")}
                        />
                        <Popup
                            trigger={
                                <Input placeholder="Max Salary" value={formik.values.maxSalary}
                                       name="maxSalary" type="number" style={jobAdvAddInputStyle}
                                       onChange={formik.handleChange} icon={"money bill alternate"}/>
                            }
                            content={formik.errors.maxSalary ? formik.errors.maxSalary : "Max Salary (Optional)"}
                            position={"bottom center"} style={formik.errors.maxSalary ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.maxSalary && formik.touched.maxSalary}
                            onOpen={() => errPopupOnOpen("maxSalary")}
                        />
                        <Popup
                            trigger={
                                <Input placeholder="Open Positions" value={formik.values.openPositions}
                                       name="openPositions" type="number" style={jobAdvAddInputStyle}
                                       onChange={formik.handleChange} icon={"users"}/>
                            }
                            content={formik.errors.openPositions ? formik.errors.openPositions : "Open Positions"}
                            position={"bottom center"}
                            style={formik.errors.openPositions ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.openPositions && formik.touched.openPositions}
                            onOpen={() => errPopupOnOpen("openPositions")}
                        />
                        <Popup
                            trigger={
                                <Input value={formik.values.deadline} type="date" name="deadline"
                                       style={jobAdvAddInputStyle} onChange={formik.handleChange}/>
                            }
                            content={formik.errors.deadline ? formik.errors.deadline : "Deadline"}
                            position={"bottom center"} style={formik.errors.deadline ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.deadline && formik.touched.deadline}
                            onOpen={() => errPopupOnOpen("deadline")}
                        />
                    </Grid.Column>
                </Grid>

                <Grid style={{opacity: 0.9}} padded>
                    <Grid.Column>
                        <Button attached={"top"} basic size={"mini"} color={"teal"} compact active
                                style={{marginLeft: 12, width: 100, marginBottom: -1, borderRadius: 7}}>
                            <strong style={{color: "rgba(37,37,37,0.94)", fontSize: "x-small"}}>
                                Job Description
                            </strong>
                        </Button>
                        <Popup
                            trigger={
                                <TextArea
                                    style={{minHeight: 120, borderRadius: 10}}
                                    name="jobDescription" value={formik.values.jobDescription}
                                    onChange={formik.handleChange}
                                />
                            }
                            content={formik.errors.jobDescription ? formik.errors.jobDescription : "Job Description"}
                            position={"bottom center"}
                            style={formik.errors.jobDescription ? errPopupStyle : infoPopupStyle}
                            size={"mini"} open={formik.errors.jobDescription && formik.touched.jobDescription}
                            onOpen={() => errPopupOnOpen("jobDescription")}
                        />
                    </Grid.Column>
                </Grid>

                <Grid padded>
                    <Grid.Column>
                        {adding ?
                            <Button animated="fade" positive type="submit" compact floated={"left"}
                                    style={{borderRadius: 10}}>
                                <Button.Content hidden><Icon name='checkmark'/></Button.Content>
                                <Button.Content visible>Post <Icon name={"plus"}/></Button.Content>
                            </Button> :
                            <Button animated="fade" primary type="submit" compact floated={"left"}
                                    style={{borderRadius: 10}}>
                                <Button.Content hidden><Icon name='checkmark'/></Button.Content>
                                <Button.Content visible>Save <Icon name='save'/></Button.Content>
                            </Button>
                        }

                    </Grid.Column>
                </Grid>

            </Form>
        </Segment>
    )
}