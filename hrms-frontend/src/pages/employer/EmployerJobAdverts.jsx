import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Button, Dropdown, Form, Grid, Header, Icon, Menu, Popup, Segment, TextArea} from "semantic-ui-react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import * as Yup from "yup";
import {syncEmplJobAdverts} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import SPopupDropdown from "../../utilities/customFormControls/SPopupDropdown";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import {changePropInList, handleCatch} from "../../utilities/Utils";
import SInfoLabel from "../../utilities/customFormControls/SInfoLabel";
import {useHistory} from "react-router-dom";

export function EmployerJobAdverts() {

    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)

    const [jobAdverts, setJobAdverts] = useState(user.jobAdvertisements);
    const [selectedJobAdv, setSelectedJobAdv] = useState(undefined);
    const [activeItem, setActiveItem] = useState(-1);

    useEffect(() => {
        setJobAdverts(user.jobAdvertisements)
    }, [user.jobAdvertisements]);

    const getJobAdvColor = (jobAdvert) => {
        if (jobAdvert.rejected === null && jobAdvert.verified === false)
            return "blue"
        else if (jobAdvert.rejected === true)
            return "red"
        else if (jobAdvert.updateVerified === false)
            return "orange"
        else if (Math.floor((new Date(jobAdvert.deadline).getTime() - new Date().getTime()) / 86400000) + 1 <= 0)
            return "purple"
        else if (jobAdvert.active === false)
            return "grey"
        else if (jobAdvert.verified === true)
            return "green"
        else
            return undefined
    }

    const handleMenuItemClick = (activeItem) => {
        setActiveItem(activeItem)
        const index = jobAdverts.findIndex(jobAdv => jobAdv.id === activeItem)
        setSelectedJobAdv(jobAdverts[index]);
    }

    if (String(userProps.userType) !== "employer") return <Header content={"Sorry You Do Not Have Access Here"}/>

    return (
        <div>
            <strong style={{marginLeft: 35, color: "rgba(79,2,84,0.61)"}}>Manage Advertisements</strong>
            <Grid padded stackable centered>
                <Grid.Column width={5}>
                    <Menu fluid vertical tabular pointing secondary size={"small"}>
                        {jobAdverts?.map((jobAdvert) => (
                            <Menu.Item
                                key={jobAdvert?.id} color={getJobAdvColor(jobAdvert)}
                                content={`${jobAdvert?.position.title} | ${jobAdvert?.city.name}`}
                                name={String(jobAdvert?.id)} active={activeItem === jobAdvert?.id}
                                onClick={() => handleMenuItemClick(jobAdvert?.id)}
                            />
                        ))}
                        <Menu.Item
                            name={"-1"} content={"Post New"} color={"blue"} header icon={"plus"} active={activeItem === -1}
                            onClick={() => handleMenuItemClick(-1)}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={11}>
                    {EmplJobAdvertManageSegment({jobAdvert: selectedJobAdv})}
                </Grid.Column>
            </Grid>
        </div>
    )
}

function EmplJobAdvertManageSegment(props) {

    const jobAdvertisementService = new JobAdvertisementService()

    const errPopupStyle = {borderRadius: 10, color: "rgba(227,7,7)", backgroundColor: "rgba(250,250,250, 0.7)", marginTop: 10}
    const infoPopupStyle = {borderRadius: 10, color: "rgb(0,0,0)", backgroundColor: "rgba(250,250,250, 0.7)", marginTop: 10}
    const jobAdvAddDropdownStyle = {marginLeft: 20, marginRight: 20, marginTop: 15, marginBottom: 15, width: 200, height: 35}
    const jobAdvAddInputStyle = {marginLeft: 20, marginRight: 20, marginTop: 15, marginBottom: 15, width: 200, height: 40}
    const popupSize = "small"

    const workTimes = ["Part Time", "Full Time"]
    const workModels = ["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]

    const dispatch = useDispatch();
    const history = useHistory();

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

    const handleDetailClick = (jobAdvertId) => {
        history.push(`/jobAdverts/${jobAdvertId}`);
        window.scrollTo(0, 0);
    }

    const add = (values) => {
        jobAdvertisementService.add(values).then((result) => {
            user.jobAdvertisements.push(result.data.data)
            dispatch(syncEmplJobAdverts(user.jobAdvertisements))
            toast("Your advert received. It will be published after verification")
        }).catch(handleCatch)
    }

    const update = (values) => {
        jobAdvertisementService.update(values).then((result) => {
            const jobAdverts = changePropInList(values.id, result.data.data, user.jobAdvertisements)
            dispatch(syncEmplJobAdverts(jobAdverts))
            setJobAdvert(result.data.data)
            toast("Your update request received. It will be visible after confirmation")
        }).catch(handleCatch)
    }

    const changeActivation = (jobAdv, status) => {
        jobAdvertisementService.updateActivation(jobAdv.id, status).then((result) => {
            const jobAdverts = changePropInList(jobAdv.id, result.data.data, user.jobAdvertisements)
            dispatch(syncEmplJobAdverts(jobAdverts))
            setJobAdvert(result.data.data)
            status === true ? toast("Activated") : toast("Deactivated")
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

    return (
        <Segment raised style={{borderRadius: 10, centered: true}} textAlign={"center"}>
            {adding === false ?
                <div align={"right"}>
                    <SInfoLabel content={<div><Icon name="bullhorn" color="blue"/>Release Approval</div>}
                                visible={jobAdvert.verified === false && jobAdvert.rejected === null}
                                backgroundColor={"rgba(0,94,255,0.1)"}/>
                    <SInfoLabel content={<div><Icon name="redo alternate" color="orange"/>Update Approval</div>}
                                visible={jobAdvert.updateVerified === false} backgroundColor={"rgba(255,113,0,0.1)"}/>
                    <SInfoLabel content={<div><Icon name="check circle outline" color="green"/>Verified</div>}
                                visible={jobAdvert.verified === true} backgroundColor={"rgba(58,255,0,0.1)"}/>
                    <SInfoLabel content={<div><Icon name="ban" color="red"/>Rejected</div>}
                                visible={jobAdvert.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
                    <SInfoLabel content={<div><Icon name="checkmark" color="green"/>Active</div>}
                                visible={jobAdvert.active === true} backgroundColor={"rgba(57,255,0,0.1)"}/>
                    <SInfoLabel content={<div><Icon name="minus circle" color="brown"/>Inactive</div>}
                                visible={jobAdvert.active === false} backgroundColor={"rgba(76,16,11,0.1)"}/>
                    <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                              simple labeled direction={"left"}>
                        <Dropdown.Menu style={{marginTop: 0, marginLeft: -6, backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 10}}>
                            {jobAdvert.active === false ?
                                <Dropdown.Item
                                    onClick={() => changeActivation(jobAdvert, true)}>
                                    <Icon name="check" color="green"/>Activate
                                </Dropdown.Item> :
                                <Dropdown.Item
                                    onClick={() => changeActivation(jobAdvert, false)}>
                                    <Icon name="minus circle" color="brown"/>Deactivate
                                </Dropdown.Item>}
                            <Dropdown.Item
                                onClick={() => handleDetailClick(jobAdvert.id)}>
                                <Icon name="eye" color="blue"/>See
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div> : null}
            <Form onSubmit={formik.handleSubmit}>

                <Grid padded="vertically">
                    <Grid.Column>
                        <SPopupDropdown name={"cityId"} placeholder={"City"} formik={formik} popupsize={popupSize}
                                        dropdownstyle={jobAdvAddDropdownStyle} options={cityOption}/>
                        <SPopupDropdown name={"positionId"} placeholder={"Position"} formik={formik} popupsize={popupSize}
                                        dropdownstyle={jobAdvAddDropdownStyle} options={positionOption}/>
                        <SPopupDropdown name={"workModel"} placeholder={"Work Model"} formik={formik} popupsize={popupSize}
                                        dropdownstyle={jobAdvAddDropdownStyle} options={workModelOption}/>
                        <SPopupDropdown name={"workTime"} placeholder={"Work Time"} formik={formik} popupsize={popupSize}
                                        dropdownstyle={jobAdvAddDropdownStyle} options={workTimeOption}/>
                        <SPopupInput icon="dollar sign" placeholder="Min Salary (Optional)" name="minSalary" type={"number"}
                                     popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                        <SPopupInput icon="dollar sign" placeholder="Max Salary (Optional)" name="maxSalary" type={"number"}
                                     popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                        <SPopupInput icon="users" placeholder="Open Positions" name="openPositions" type={"number"}
                                     popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                        <SPopupInput placeholder="Deadline" name="deadline" type={"date"}
                                     popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                    </Grid.Column>
                </Grid>

                <Grid style={{opacity: 0.9}} padded>
                    <Grid.Column>
                        <Button attached={"top"} basic size={"mini"} color={"teal"} compact active
                                style={{marginLeft: 12, width: 130, marginBottom: -1, borderRadius: 7}}>
                            <strong style={{color: "rgba(37,37,37,0.94)", fontSize: "small"}}>Job Description</strong>
                        </Button>
                        <Popup
                            trigger={
                                <TextArea
                                    style={{minHeight: 120, borderRadius: 10}} name="jobDescription"
                                    value={formik.values.jobDescription} onChange={formik.handleChange}
                                />
                            }
                            position={"bottom center"}
                            content={formik.errors.jobDescription ? formik.errors.jobDescription : "Job Description"}
                            style={formik.errors.jobDescription ? errPopupStyle : infoPopupStyle}
                            size={popupSize} open={formik.errors.jobDescription && formik.touched.jobDescription}
                        />
                    </Grid.Column>
                </Grid>

                <Grid padded>
                    <Grid.Column>
                        {adding ?
                            <Button animated="fade" positive type="submit" compact floated={"left"} style={{borderRadius: 10}}>
                                <Button.Content hidden><Icon name='checkmark'/></Button.Content>
                                <Button.Content visible>Post <Icon name={"plus"}/></Button.Content>
                            </Button> :
                            <Button animated="fade" primary type="submit" compact floated={"left"} style={{borderRadius: 10}}>
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
