import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    Button, Dropdown, Form, Grid, Header, Icon,
    Label, Menu, Popup, Segment, TextArea
} from "semantic-ui-react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import * as Yup from "yup";
import {syncEmplJobAdvert, syncEmplJobAdverts} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import SPopupDropdown from "../../utilities/customFormControls/SPopupDropdown";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import {handleCatch} from "../../utilities/Utils";

export function EmployerJobAdverts() {

    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)

    const [jobAdverts, setJobAdverts] = useState(user.jobAdvertisements);
    const [selectedJobAdv, setSelectedJobAdv] = useState(undefined);
    const [activeItem, setActiveItem] = useState(-1);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        setJobAdverts(user.jobAdvertisements)
    }, [user.jobAdvertisements]);

    const handleMenuItemClick = (activeItem) => {
        setActiveItem(activeItem)
        const index = jobAdverts.findIndex(jobAdv => jobAdv.id === activeItem)
        setSelectedJobAdv(jobAdverts[index]);
    }

    const refreshComponent = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    if (String(userProps.userType) !== "employer") return <Header>Sorry You Do Not Have Access Here</Header>

    return (
        <div>
            <strong style={{marginLeft: 35, color: "rgba(79,2,84,0.61)"}}>Manage Advertisements</strong>
            <Grid padded stackable centered>
                <Grid.Column width={5}>
                    <Menu fluid vertical tabular size={"small"}>
                        {jobAdverts?.map((jobAdvertisement) => (
                            <Menu.Item
                                key={jobAdvertisement?.id} color={"blue"}
                                content={`${jobAdvertisement?.position.title} | ${jobAdvertisement?.city.name}`}
                                name={String(jobAdvertisement?.id)} active={activeItem === jobAdvertisement?.id}
                                onClick={() => handleMenuItemClick(jobAdvertisement?.id)}
                            />
                        ))}
                        <Menu.Item
                            name={"Post New"} color={"green"} header icon={"plus"}
                            onClick={() => handleMenuItemClick(-1, undefined)}
                            active={activeItem === -1}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={11}>
                    {JobAdvertsMenuSegment({jobAdvert: selectedJobAdv, refresh: refreshComponent})}
                </Grid.Column>
            </Grid>
        </div>
    )
}

function JobAdvertsMenuSegment(props) {

    const jobAdvertisementService = new JobAdvertisementService()

    const errPopupStyle = {
        borderRadius: 10, color: "rgba(227,7,7)", backgroundColor: "rgba(250,250,250, 0.7)", marginTop: 10
    }
    const infoPopupStyle = {
        borderRadius: 10, color: "rgb(0,0,0)", backgroundColor: "rgba(250,250,250, 0.7)", marginTop: 10
    }
    const jobAdvAddDropdownStyle = {
        marginLeft: 20, marginRight: 20, marginTop: 15, marginBottom: 15, width: 200, height: 35
    }
    const jobAdvAddInputStyle = {
        marginLeft: 20, marginRight: 20, marginTop: 15, marginBottom: 15, width: 200, height: 40
    }
    const popupSize = "small"

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
            dispatch(syncEmplJobAdvert(values.id, result.data.data))
            setJobAdvert(result.data.data)
            toast("Your update request received. It will be visible after confirmation")
        }).catch(handleCatch)
    }

    const changeActivation = (jobAdv, status) => {
        jobAdvertisementService.updateActivation(jobAdv.id, status).then((result) => {
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
                              simple labeled direction={"left"}>
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
                        <SPopupDropdown name={"cityId"} placeholder={"City"} formik={formik} popupSize={popupSize}
                                        customDropdownStyle={jobAdvAddDropdownStyle} options={cityOption}/>
                        <SPopupDropdown name={"positionId"} placeholder={"Position"} formik={formik}
                                        popupSize={popupSize} customDropdownStyle={jobAdvAddDropdownStyle}
                                        options={positionOption}/>
                        <SPopupDropdown name={"workModel"} placeholder={"Work Model"} formik={formik}
                                        popupSize={popupSize} customDropdownStyle={jobAdvAddDropdownStyle}
                                        options={workModelOption}/>
                        <SPopupDropdown name={"workTime"} placeholder={"Work Time"} formik={formik} popupSize={popupSize}
                                        customDropdownStyle={jobAdvAddDropdownStyle} options={workTimeOption}/>
                        <SPopupInput icon="money bill alternate" placeholder="Min Salary" name="minSalary"
                                     type={"number"} popupSize={popupSize} customInputStyle={jobAdvAddInputStyle}
                                     formik={formik}/>
                        <SPopupInput icon="money bill alternate" placeholder="Max Salary" name="maxSalary"
                                     type={"number"} popupSize={popupSize} customInputStyle={jobAdvAddInputStyle}
                                     formik={formik}/>
                        <SPopupInput icon="users" placeholder="Open Positions" name="openPositions"
                                     type={"number"} popupSize={popupSize} customInputStyle={jobAdvAddInputStyle}
                                     formik={formik}/>
                        <SPopupInput placeholder="Deadline" name="deadline"
                                     type={"date"} popupSize={popupSize} customInputStyle={jobAdvAddInputStyle}
                                     formik={formik}/>
                    </Grid.Column>
                </Grid>

                <Grid style={{opacity: 0.9}} padded>
                    <Grid.Column>
                        <Button attached={"top"} basic size={"mini"} color={"teal"} compact active
                                style={{marginLeft: 12, width: 130, marginBottom: -1, borderRadius: 7}}>
                            <strong style={{color: "rgba(37,37,37,0.94)", fontSize: "small"}}>
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
                            size={popupSize} open={formik.errors.jobDescription && formik.touched.jobDescription}
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
