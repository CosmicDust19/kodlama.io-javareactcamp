import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import * as Yup from "yup";
import {changeEmplJobAdverts} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {changePropInList, handleCatch} from "../../utilities/Utils";
import {useFormik} from "formik";
import {Button, Form, Grid, Header, Icon, Popup, Segment, TextArea} from "semantic-ui-react";
import JobAdvertInfoLabels from "../common/JobAdvertInfoLabels";
import EmplAdvertDropdown from "./EmplAdvertDropdown";
import SPopupDropdown from "../../utilities/customFormControls/SPopupDropdown";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import {workModelOptions, workTimeOptions} from "../../utilities/JobAdvertUtils";

export function EmplJobAdvertSeg({...props}) {

    const jobAdvertisementService = new JobAdvertisementService()

    const verticalScreen = window.innerWidth < window.innerHeight

    const errPopupStyle = {borderRadius: 10, color: "rgba(227,7,7)", backgroundColor: "rgba(250,250,250, 0.7)", marginTop: 10}
    const infoPopupStyle = {borderRadius: 10, color: "rgb(0,0,0)", backgroundColor: "rgba(250,250,250, 0.7)", marginTop: 10}
    const jobAdvAddDropdownStyle = {marginLeft: 20, marginRight: 20, marginTop: 15, marginBottom: 15, width: 200, height: 35}
    const jobAdvAddInputStyle = {marginLeft: 20, marginRight: 20, marginTop: 15, marginBottom: 15, width: 200, height: 40}
    const popupSize = "small"
    const popupPosition = !verticalScreen ? undefined : "top center"

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps.user)

    const [jobAdvert, setJobAdvert] = useState(props.jobAdvert);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        cityService.getAll().then((result) => setCities(result.data.data));
        positionService.getAll().then((result) => setPositions(result.data.data));
    }, []);

    useEffect(() => {
        setJobAdvert(props.jobAdvert)
    }, [props.jobAdvert]);

    let adding;
    let initialValues;
    if (!jobAdvert) {
        initialValues = {
            employerId: user?.id, jobDescription: "", positionId: "", workTime: "",
            workModel: "", openPositions: "", cityId: "",
            minSalary: "", maxSalary: "", deadline: new Date().toISOString().split('T')[0],
        }
        adding = true
    } else {
        initialValues = {
            id: jobAdvert.id,
            employerId: user?.id, jobDescription: jobAdvert.jobDescription,
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
            user.jobAdvertisements.push(result.data.data)
            dispatch(changeEmplJobAdverts(user.jobAdvertisements))
            toast("Your advert received. It will be published after verification")
        }).catch(handleCatch)
    }

    const update = (values) => {
        jobAdvertisementService.update(values).then((result) => {
            const jobAdverts = changePropInList(values.id, result.data.data, user.jobAdvertisements)
            dispatch(changeEmplJobAdverts(jobAdverts))
            setJobAdvert(result.data.data)
            toast("Your update request received. It will be visible after confirmation")
        }).catch(handleCatch)
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: jobAdvValidationSchema,
        onSubmit: values => adding ? add(values) : update(values)
    });

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
        <Segment raised style={{borderRadius: 0, centered: true}} textAlign={"center"}>
            {adding === false ?
                <div align={"right"}>
                    <JobAdvertInfoLabels jobAdvert={{...jobAdvert, employer: user}}/>
                    <EmplAdvertDropdown jobAdvert={{...jobAdvert, employer: user}} setJobAdvert={setJobAdvert} infoOption/>
                </div> : null}
            <Form onSubmit={formik.handleSubmit}>

                <Grid padded="vertically">
                    <Grid.Column>
                        <SPopupDropdown name={"cityId"} placeholder={"City"} formik={formik} popupsize={popupSize}
                                        popupposition={popupPosition} dropdownstyle={jobAdvAddDropdownStyle} options={cityOption}/>
                        <SPopupDropdown name={"positionId"} placeholder={"Position"} formik={formik} popupsize={popupSize}
                                        popupposition={popupPosition} dropdownstyle={jobAdvAddDropdownStyle} options={positionOption}/>
                        <SPopupDropdown name={"workModel"} placeholder={"Work Model"} formik={formik} popupsize={popupSize}
                                        popupposition={popupPosition} dropdownstyle={jobAdvAddDropdownStyle} options={workModelOptions}/>
                        <SPopupDropdown name={"workTime"} placeholder={"Work Time"} formik={formik} popupsize={popupSize}
                                        popupposition={popupPosition} dropdownstyle={jobAdvAddDropdownStyle} options={workTimeOptions}/>
                        <SPopupInput icon="dollar sign" placeholder="Min Salary (Optional)" name="minSalary" type={"number"}
                                     popupposition={popupPosition} popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                        <SPopupInput icon="dollar sign" placeholder="Max Salary (Optional)" name="maxSalary" type={"number"}
                                     popupposition={popupPosition} popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                        <SPopupInput icon="users" placeholder="Open Positions" name="openPositions" type={"number"}
                                     popupposition={popupPosition} popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                        <SPopupInput placeholder="Deadline" name="deadline" type={"date"}
                                     popupposition={popupPosition} popupsize={popupSize} inputstyle={jobAdvAddInputStyle} formik={formik}/>
                    </Grid.Column>
                </Grid>

                <Grid style={{opacity: 0.9}} padded>
                    <Grid.Column>
                        <Header sub dividing style={{marginBottom: 0}} color={"yellow"} textAlign={"left"}
                                content={<font style={{color: "rgb(0,0,0)", marginLeft: 10}}>• Job Description</font>}/>
                        <Popup
                            trigger={
                                <TextArea style={{minHeight: 120, borderRadius: 0}} name="jobDescription"
                                          value={formik.values.jobDescription} onChange={formik.handleChange}/>
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
