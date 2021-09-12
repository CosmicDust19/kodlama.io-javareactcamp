import {Accordion, Button, Card, Checkbox, Grid, Header, Icon, Segment} from "semantic-ui-react";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import {
    getFilteredJobAdverts, getFormikInitialFilters, initialJobAdvFilters, jobAdvertStatusOptions, workModelOptions, workTimeOptions
} from "../../utilities/JobAdvertUtils";
import SInput from "../../utilities/customFormControls/SInput";
import {defCheckBoxStyle, getCityOption, getEmployerOption, getPositionOption} from "../../utilities/Utils";
import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import {changeFilteredJobAdverts, changeJobAdvertsFilters} from "../../store/actions/filterActions";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";

function JobAdvertMngFilterSeg({allJobAdverts}) {

    const jobAdvertService = new JobAdvertisementService()

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)

    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getAll().then((result) => setEmployers(result.data.data));
    }, []);

    const formik = useFormik({
        initialValues: getFormikInitialFilters(filters)
    });

    const cityOption = getCityOption(cities)
    const positionOption = getPositionOption(positions)
    const employerOption = getEmployerOption(employers)

    const changeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const resetFilters = () => {
        formik.setValues(initialJobAdvFilters)
        formik.values = initialJobAdvFilters
        handleFilter()
    }

    const handleFilter = () => {
        setLoading(true)
        dispatch(changeJobAdvertsFilters(formik.values))
        jobAdvertService.getAll().then(r => {
            const filteredJobAdverts = getFilteredJobAdverts(r.data.data, formik.values)
            dispatch(changeFilteredJobAdverts(filteredJobAdverts));
        }).finally(() => setLoading(false))
    }

    return (
        <Accordion>
            <Accordion.Title onClick={() => allJobAdverts.length !== 0 ? setFilterOpen(!filterOpen) : null}>
                <Card fluid raised style={{height: 35, marginBottom: -15, marginTop: -15}}>
                    <Button basic animated="vertical" fluid color={"blue"} loading={loading} active disabled={allJobAdverts.length === 0}>
                        <Button.Content visible><Icon name="filter"/>Filter</Button.Content>
                        <Button.Content hidden><Icon name={filterOpen ? 'angle double up' : 'angle double down'}/></Button.Content>
                    </Button>
                </Card>
            </Accordion.Title>
            <Accordion.Content active={filterOpen}>
                <Segment style={{borderRadius: 0}} raised textAlign={"center"} padded>
                    <Grid padded celled={"internally"} stackable>
                        <Grid.Column width={8}>
                            <SDropdown name={"cityIds"} placeholder="Cities" options={cityOption} formik={formik}/>
                            <SDropdown name={"positionIds"} placeholder="Positions" options={positionOption} formik={formik}/>
                            <SDropdown name={"employerIds"} placeholder="Employers" options={employerOption} formik={formik}/>
                            <SDropdown name={"workModels"} placeholder="Work models" options={workModelOptions} formik={formik}/>
                            <SDropdown name={"workTimes"} placeholder="Work times" options={workTimeOptions} formik={formik}/>
                            <SDropdown name={"statuses"} placeholder="Statuses" options={jobAdvertStatusOptions} formik={formik}/>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header size="tiny" content={"Minimum Salary"}/>
                            <SInput name="minSalaryMoreThan" placeholder="More than" type="number" icon={"dollar sign"}
                                    formik={formik}/>
                            <SInput name="minSalaryLessThan" placeholder="Less than" type="number" icon={"dollar sign"}
                                    formik={formik}/>
                            <Header size="tiny" content={"Maximum Salary"}/>
                            <SInput name="maxSalaryMoreThan" placeholder="More than" type="number" icon={"dollar sign"}
                                    formik={formik}/>
                            <SInput name="maxSalaryLessThan" placeholder="Less than" type="number" icon={"dollar sign"}
                                    formik={formik}/>
                            <Header/>
                            <Checkbox label='Today' checked={formik.values.today} style={defCheckBoxStyle}
                                      onChange={() => changeFilter("today", !formik.values.today)}/>
                            <Checkbox label='This Week' checked={formik.values.thisWeek} style={defCheckBoxStyle}
                                      onChange={() => changeFilter("thisWeek", !formik.values.thisWeek)}/>
                            <Header size="tiny" content={"Application Deadline"}/>
                            <font style={{fontStyle: "italic"}}>Before</font>&nbsp;&nbsp;&nbsp;
                            <SInput name="deadLineBefore" placeholder="Before" type="date" formik={formik} style={{}}/>
                            <Header style={{marginTop: 0}}/>
                            <font style={{fontStyle: "italic", marginLeft: 8}}>After</font>&nbsp;&nbsp;&nbsp;
                            <SInput name="deadLineAfter" placeholder="After" type="date" formik={formik}
                                    style={{marginBottom: 20}}/>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Grid stackable padded={"vertically"}>
                    <Grid.Column width="10">
                        <Button basic animated="fade" fluid color={"green"} loading={loading} style={{borderRadius: 0}}
                                disabled={loading} active onClick={handleFilter}>
                            <Button.Content visible>Apply Filters & Sync</Button.Content>
                            <Button.Content hidden><Icon name='filter'/></Button.Content>
                        </Button>
                    </Grid.Column>
                    <Grid.Column width="6">
                        <Button animated="fade" basic fluid color={"grey"} loading={loading} style={{borderRadius: 0}}
                                disabled={loading} active onClick={resetFilters}>
                            <Button.Content visible>Reset</Button.Content>
                            <Button.Content hidden><Icon name='sync alternate'/></Button.Content>
                        </Button>
                    </Grid.Column>
                </Grid>
            </Accordion.Content>
        </Accordion>
    )
}

export default JobAdvertMngFilterSeg;