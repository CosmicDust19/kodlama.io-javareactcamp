import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Button, Dropdown, Input, TextArea, Card, Form, Grid, GridColumn,
    Progress, Icon, Header
} from "semantic-ui-react";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

export default function JobAdvertisementAdd() {
    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    let color = colors[Math.floor(Math.random() * 12)]

    const userProps = useSelector(state => state?.user?.userProps)

    const [progressBarState, setProgressBarState] = useState({percent: 0});
    const [workTimes] = useState(["Part Time", "Full Time"]);
    const [workModels] = useState(["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [is1stTimePosition, setIs1stTimePosition] = useState(true);
    const [is1stTimeCity, setIs1stTimeCity] = useState(true);
    const [is1stTimeWorkModel, setIs1stTimeWorkModel] = useState(true);
    const [is1stTimeWorkTime, setIs1stTimeWorkTime] = useState(true);
    const [is1stTimeHired, setIs1stTimeHired] = useState(true);
    const [is1stTimeMinSal, setIs1stTimeMinSal] = useState(true);
    const [is1stTimeMaxSal, setIs1stTimeMaxSal] = useState(true);
    const [is1stTimeJobDesc, setIs1stJobDesc] = useState(true);
    const [is1stTimeDeadline, setIs1stDeadline] = useState(true);

    const increment = () =>
        setProgressBarState((prevState) => ({
            percent: prevState.percent + 11 >= 100 ? 100 : prevState.percent + 11,
        }))

    const finish = () =>
        setProgressBarState(() => ({
            percent: 100
        }))

    let jobAdvertisementService = new JobAdvertisementService();
    const JobAdvertisementAddSchema = Yup.object().shape({
        positionId: Yup.string().required("This field cannot be empty"),
        cityId: Yup.string().required("This field cannot be empty"),
        workModel: Yup.string().required("This field cannot be empty"),
        workTime: Yup.string().required("This field cannot be empty"),
        minSalary: Yup.number().nullable().min(0, "Cannot be less than 0"),
        maxSalary: Yup.number().nullable().min(0, "Cannot be less than 0"),
        openPositions: Yup.string().required("This field cannot be empty").min(1, "This field cannot be less than 1"),
        deadline: Yup.date().required("This field cannot be empty"),
        jobDescription: Yup.string().required("This field cannot be empty")
    });

    const formik = useFormik({
        initialValues: {
            employerId: userProps.user?.id, jobDescription: "", positionId: "", workTime: "",
            workModel: "", openPositions: "", cityId: "",
            minSalary: "", maxSalary: "", deadline: "",
        },
        validationSchema: JobAdvertisementAddSchema,
        onSubmit: (values) => {
            let counter = 0
            if (values.minSalary && values.maxSalary && Number(values.minSalary) > Number(values.maxSalary)) {
                toast.warning("Minimum salary cannot be bigger than maximum salary")
                counter++
            }
            if (new Date(values.deadline).getTime() < new Date().getTime()) {
                toast.warning("Deadline should be a date in the future")
                counter++
            }
            if (counter === 0) {
                jobAdvertisementService.add(values).then((result) => {
                    console.log(result)
                    toast("Your advertisement received, it will be published after confirmation")
                    finish()
                }).catch(reason => {
                    console.log(reason)
                    toast.warning("A problem has occurred", {
                        autoClose: 4000
                    })
                    toast.warning("Probably you already have an advert in this city, this position and this description", {
                        autoClose: 8000
                    })
                })
            }
        }
    });

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

    const handleChange = (fieldName, value) => {
        switch (fieldName) {
            case "positionId":
                if (is1stTimePosition) {
                    increment()
                    setIs1stTimePosition(false)
                }
                break;
            case "cityId":
                if (is1stTimeCity) {
                    increment()
                    setIs1stTimeCity(false)
                }
                break;
            case "workModel":
                if (is1stTimeWorkModel) {
                    increment()
                    setIs1stTimeWorkModel(false)
                }
                break;
            case "workTime":
                if (is1stTimeWorkTime) {
                    increment()
                    setIs1stTimeWorkTime(false)
                }
                break;
            case "openPositions":
                if (is1stTimeHired) {
                    increment()
                    setIs1stTimeHired(false)
                }
                break;
            case "minSalary":
                if (is1stTimeMinSal) {
                    increment()
                    setIs1stTimeMinSal(false)
                }
                break;
            case "maxSalary":
                if (is1stTimeMaxSal) {
                    increment()
                    setIs1stTimeMaxSal(false)
                }
                break;
            case "jobDescription":
                if (is1stTimeJobDesc) {
                    increment()
                    setIs1stJobDesc(false)
                }
                break;
            case "deadline":
                if (is1stTimeDeadline) {
                    increment()
                    setIs1stDeadline(false)
                }
                break;
            default:
                return null
        }
        formik.setFieldValue(fieldName, value);
    }

    if (String(userProps.userType) !== "employer"){
        return (
            <Header>
                Sorry You Do Not Have Access Here
            </Header>
        )
    }

    return (
        <div>
            <Header textAlign = "center">
                Post Job
            </Header>
            <Progress percent={progressBarState.percent} indicating style = {{marginBottom: -13}} attached={"bottom"}/>
            <Card fluid color={color}>
                <Card.Content>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Field>
                            <Grid stackable>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Select a position" search selection
                                              onChange={(event, data) => {
                                                  handleChange("positionId", data.value)
                                              }}
                                              value={formik.values.positionId} options={positionOption}
                                    />
                                    {formik.errors.positionId && formik.touched.positionId && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.positionId}
                                        </div>
                                    )}
                                </GridColumn>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Select a city" search selection
                                              onChange={(event, data) => {
                                                  handleChange("cityId", data.value)
                                              }} value={formik.values.cityId} options={cityOption}
                                    />
                                    {formik.errors.cityId && formik.touched.cityId && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.cityId}
                                        </div>
                                    )}
                                </GridColumn>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Enter Work Model" search selection
                                              onChange={(event, data) => {
                                                  handleChange("workModel", data.value)
                                              }} value={formik.values.workModel} options={workModelOption}
                                    />
                                    {formik.errors.workModel && formik.touched.workModel && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.workModel}
                                        </div>
                                    )}
                                </GridColumn>
                                <GridColumn width={4}>
                                    <Dropdown clearable item placeholder="Enter Work Time" search selection openOnFocus
                                              value={formik.values.workTime} options={workTimeOption}
                                              onChange={(event, data) => {
                                                  handleChange("workTime", data.value)
                                              }}
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
                                    <Input style={{width: "89%"}} name="openPositions"
                                           onChange={(event, data) => {
                                               handleChange("openPositions", data.value)
                                           }} value={formik.values.openPositions} type="number"
                                           placeholder="Enter Open Positions"
                                    />
                                    {formik.errors.openPositions && formik.touched.openPositions && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.openPositions}
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Input
                                        style={{width: "78%"}} type="number" placeholder="Enter Minimum Salary"
                                        value={formik.values.minSalary} error={Boolean(formik.errors.minSalary)} name="minSalary"
                                        onChange={(event, data) => {
                                            handleChange("minSalary", data.value)
                                        }}
                                    />
                                    {formik.errors.minSalary && formik.touched.minSalary && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.minSalary}
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Input
                                        style={{width: "78%"}} type="number" placeholder="Enter Maximum Salary"
                                        value={formik.values.maxSalary} error={Boolean(formik.errors.maxSalary)} name="maxSalary"
                                        onChange={(event, data) => {
                                            handleChange("maxSalary", data.value)
                                        }}
                                    />
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
                                        placeholder="Enter Job Description" style={{minHeight: 300, maxWidth: 762}}
                                        value={formik.values.jobDescription} name="jobDescription"
                                        onChange={(event, data) => {
                                            handleChange("jobDescription", data.value)
                                        }}
                                    />
                                    {formik.errors.jobDescription && formik.touched.jobDescription && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.jobDescription}
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <label style={{fontWeight: "bold"}}>Deadline</label>
                                    <Input
                                        style={{width: "78%"}} type="date" error={Boolean(formik.errors.deadline)}
                                        onChange={(event, data) =>
                                            handleChange("deadline", data.value)
                                        } value={formik.values.deadline} name="deadline"
                                    />
                                    {formik.errors.deadline && formik.touched.deadline && (
                                        <div className={"ui pointing red basic label"}>
                                            {formik.errors.deadline}
                                        </div>
                                    )}
                                </Grid.Column>
                            </Grid>
                        </Form.Field>
                        <Button animated="fade" positive type="submit" size="large" onClick={() => {console.log(formik.values)}}>
                            <Button.Content hidden><Icon name='checkmark'/></Button.Content>
                            <Button.Content visible>Post</Button.Content>
                        </Button>
                    </Form>
                </Card.Content>
            </Card>
        </div>
    );
}
