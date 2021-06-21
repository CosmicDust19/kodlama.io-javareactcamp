import React, {useEffect, useState, Component} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Button,
    Dropdown,
    Input,
    TextArea,
    Card,
    Form,
    Grid,
    GridColumn,
    Segment,
    Progress,
    Icon
} from "semantic-ui-react";
import CityService from "../services/cityService";
import PositionService from "../services/positionService";
import JobAdvertisementService from "../services/jobAdvertisementService";

class ProgressBar extends Component {

    constructor(props) {
        super(props);
        this.increment = this.increment.bind(this);
        this.state = {percent: 0};
    }

    increment = () =>
        this.setState((prevState) => ({
            percent: prevState.percent + 10 >= 100 ? 100 : prevState.percent + 10,
        }))

    decrement = () =>
        this.setState((prevState) => ({
            percent: prevState.percent - 10 <= 0 ? 0 : prevState.percent - 10,
        }))

    render() {
        return (
            <div>
                <Progress percent={this.state.percent} indicating/>
            </div>
        )
    }
}

export default function JobAdvertisementAdd() {

    let jobAdvertisementService = new JobAdvertisementService();
    const JobAdvertisementAddSchema = Yup.object().shape({
        position: Yup.object().required("This field cannot be empty"),
        city: Yup.object().required("This field cannot be empty"),
        workModel: Yup.string().required("This field cannot be empty"),
        workTime: Yup.string().required("This field cannot be empty"),
        minSalary: Yup.number().nullable().min(0, "Cannot be less than 0"),
        maxSalary: Yup.number().nullable().min(0, "Cannot be less than 0"),
        numberOfPeopleToBeHired: Yup.string().required("This field cannot be empty").min(1, "This field cannot be less than 1"),
        applicationDeadline: Yup.date().nullable().min(new Date().getDay(), "Deadline must be in the future"),
        jobDescription: Yup.string().required("This field cannot be empty")
    });

    const formik = useFormik({
        initialValues: {
            jobDescription: "", position: {}, workTime: "",
            workModel: "", numberOfPeopleToBeHired: "", city: {},
            minSalary: "", maxSalary: "", applicationDeadline: "",
        },
        validationSchema: JobAdvertisementAddSchema,
        onSubmit: (values) => {
            values.employerId = 7;
            jobAdvertisementService.add(values).then((result) => console.log(result.data.data));
            alert("Advertisement has been published");
        },
    });

    const [workTimes] = useState(["Part Time", "Full Time"]);
    const [workModals] = useState(["Remote", "Office"]);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        let cityService = new CityService();
        let positionService = new PositionService();

        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
    }, []);

    const workTimeOption = workTimes.map((workTime, index) => ({
        key: index,
        text: workTime,
        value: workTime,
    }));

    const workModalOption = workModals.map((workModal, index) => ({
        key: index,
        text: workModal,
        value: workModal,
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

    const handleChangeSemantic = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    return (
        <div>
            <ProgressBar/>
            <Segment inverted color='blue' size={"big"} textAlign={"center"}>Post Job</Segment>
            <Card fluid color={"blue"}>
                <Card.Content>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Field>
                            <Grid>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Select a position" search selection
                                              onChange={(event, data) =>
                                                  handleChangeSemantic("position.id", data.value)
                                              }
                                              onBlur={formik.handleBlur} id="id"
                                              value={formik.values.position.id} options={positionOption}
                                    />
                                    {formik.errors.position && formik.touched.position && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.position}
                                        </div>
                                    )}
                                </GridColumn>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Select a city" search selection
                                              onChange={(event, data) =>
                                                  handleChangeSemantic("city.id", data.value)
                                              }
                                              onBlur={formik.handleBlur} id="id" value={formik.values.city.id}
                                              options={cityOption}
                                    />
                                    {formik.errors.city && formik.touched.city && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.city}
                                        </div>
                                    )}
                                </GridColumn>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Enter Work Model" search selection
                                              onChange={(event, data) =>
                                                  handleChangeSemantic("workModel", data.value)
                                              }
                                              onBlur={formik.handleBlur} id="workModel"
                                              value={formik.values.workModel} options={workModalOption}
                                    />
                                    {formik.errors.workModel && formik.touched.workModel && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.workModel}
                                        </div>
                                    )}
                                </GridColumn>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Enter Work Time" search selection
                                              onChange={(event, data) =>
                                                  handleChangeSemantic("workTime", data.value)
                                              }
                                              onBlur={formik.handleBlur} id="workTime"
                                              value={formik.values.workTime} options={workTimeOption}
                                    />
                                    {formik.errors.workTime && formik.touched.workTime && (
                                        <div className={"ui pointing red basic label"}>{formik.errors.workTime}</div>
                                    )}
                                </GridColumn>
                            </Grid>
                        </Form.Field>
                        <Form.Field>
                            <Grid stackable>
                                <Grid.Column width={8}>
                                    <Input style={{width: "89%"}}
                                           id="numberOfPeopleToBeHired" name="numberOfPeopleToBeHired"
                                           error={Boolean(formik.errors.numberOfPeopleToBeHired)}
                                           onChange={formik.handleChange} value={formik.values.numberOfPeopleToBeHired}
                                           onBlur={formik.handleBlur} type="number"
                                           placeholder="Enter the number of people to be hired"
                                    />
                                    {formik.errors.numberOfPeopleToBeHired && formik.touched.numberOfPeopleToBeHired && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.numberOfPeopleToBeHired}
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Input
                                        style={{width: "78%"}}
                                        type="number"
                                        placeholder="Enter Minimum Salary"
                                        value={formik.values.minSalary}
                                        name="minSalary"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                    </Input>
                                    {formik.errors.minSalary && formik.touched.minSalary && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.minSalary}
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Input
                                        style={{width: "78%"}}
                                        type="number"
                                        placeholder="Enter Maximum Salary"
                                        value={formik.values.maxSalary}
                                        name="maxSalary"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                    </Input>
                                    {formik.errors.maxSalary && formik.touched.maxSalary && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.maxSalary}
                                        </div>
                                    )}
                                </Grid.Column>
                            </Grid>
                        </Form.Field>
                        <Form.Field>
                            <Grid stackable>
                                <Grid.Column width={12}>
                                    <label style={{fontWeight: "bold"}}>Job Description</label>
                                    <TextArea
                                        placeholder="Enter Job Description"
                                        style={{minHeight: 300, maxWidth: 762}}
                                        error={Boolean(formik.errors.jobDescription).toString()}
                                        value={formik.values.jobDescription}
                                        name="jobDescription"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.jobDescription && formik.touched.jobDescription && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.jobDescription}
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <label style={{fontWeight: "bold"}}>Application Deadline</label>
                                    <Input
                                        style={{width: "78%"}} type="date"
                                        error={Boolean(formik.errors.applicationDeadline)}
                                        onChange={(event, data) =>
                                            handleChangeSemantic("applicationDeadline", data.value)
                                        }
                                        value={formik.values.applicationDeadline} onBlur={formik.handleBlur}
                                        name="applicationDeadline"
                                    />
                                    {formik.errors.applicationDeadline && formik.touched.applicationDeadline && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.applicationDeadline}
                                        </div>
                                    )}
                                </Grid.Column>
                            </Grid>
                        </Form.Field>
                        <Button animated="fade" positive type="submit">
                            <Button.Content hidden><Icon name='checkmark'/></Button.Content>
                            <Button.Content visible>Post</Button.Content>
                        </Button>
                    </Form>
                </Card.Content>
            </Card>
        </div>
    );
}
