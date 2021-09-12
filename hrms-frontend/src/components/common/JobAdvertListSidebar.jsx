import {Accordion, Button, Checkbox, Divider, Header, Icon, Label, Menu, Segment, Sidebar} from "semantic-ui-react";
import ItemsPerPageBar from "./ItemsPerPageBar";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import {
    getFilteredJobAdverts, getFormikInitialFilters, initialJobAdvFilters, workModelOptions, workTimeOptions
} from "../../utilities/JobAdvertUtils";
import {defCheckBoxStyle, getCityOption, getEmployerOption, getPositionOption} from "../../utilities/Utils";
import SInput from "../../utilities/customFormControls/SInput";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";
import {useFormik} from "formik";
import {changeFilteredJobAdverts, changeJobAdvertsFilters} from "../../store/actions/filterActions";
import JobAdvertisementService from "../../services/jobAdvertisementService";

function JobAdvertListSidebar({jobAdvertsPerPage, itemsPerPageClick, jobAdverts, visible, setVisible}) {

    const jobAdvertService = new JobAdvertisementService()

    const dispatch = useDispatch();
    const favoriteJobAdverts = useSelector(state => state?.user.userProps.user?.favoriteJobAdvertisements)
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)

    const [loading, setLoading] = useState(false);
    const [favoritesMode, setFavoritesMode] = useState(false);
    const [jobAdvPerPageOpen, setJobAdvPerPageOpen] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getPublic().then((result) => setEmployers(result.data.data));
    }, []);

    const formik = useFormik({
        initialValues: getFormikInitialFilters({...filters, statuses: []})
    });

    const verticalScreen = window.innerWidth < window.innerHeight
    const filterInputStyle = {marginBottom: 10, color: "rgb(22,148,6)"}
    const filterDropdownStyle = {marginTop: 10, marginBottom: 10, marginRight: 10}

    const cityOption = getCityOption(cities)
    const positionOption = getPositionOption(positions)
    const employerOption = getEmployerOption(employers)

    const toggle = () => setVisible(!visible)

    const handleChangeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const setFavoriteJobAdvertsMode = () => {
        const filteredJobAdverts = getFilteredJobAdverts(favoriteJobAdverts, filters)
        dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        setFavoritesMode(true)
    }

    const setAllJobAdvertsMode = () => {
        const filteredJobAdverts = getFilteredJobAdverts(jobAdverts, filters)
        dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        setFavoritesMode(false)
    }

    const handleReset = () => {
        setFavoritesMode(false)
        formik.setValues(initialJobAdvFilters)
        formik.values = initialJobAdvFilters
        handleFilter({reset: true})
    }

    const handleFilter = ({reset = false}) => {
        setLoading(true)
        dispatch(changeJobAdvertsFilters(formik.values))
        if (favoritesMode === true && reset === false) {
            const filteredJobAdverts = getFilteredJobAdverts(favoriteJobAdverts, formik.values)
            dispatch(changeFilteredJobAdverts(filteredJobAdverts))
            lastFilterActions()
            return;
        }
        jobAdvertService.getPublic()
            .then(r => dispatch(changeFilteredJobAdverts(getFilteredJobAdverts(r.data.data, formik.values))))
            .finally(lastFilterActions)
    }

    const lastFilterActions = () => {
        setLoading(false)
        setVisible(false)
        window.scrollTo(0, 0)
    }

    return (
        <div>
            <Sidebar as={Segment} animation={"push"} direction={"left"} visible={visible} textAlign={"center"} padded>

                <Label attached={"top right"} onClick={toggle} as={Button}
                       icon={<Icon name={"x"} style={{marginRight: -3, marginLeft: 0, marginTop: -3}} size={"large"} color={"blue"}/>}
                       style={{marginTop: 6, marginRight: 5, borderRadius: 20, opacity: 0.85}}/>
                <Segment basic size={"mini"} style={{marginBottom: -10}}/>

                {verticalScreen ?
                    <Accordion>
                        <Accordion.Title onClick={() => setJobAdvPerPageOpen(!jobAdvPerPageOpen)} active={jobAdvPerPageOpen}>
                            <Header dividing style={{borderRadius: 0, height: 35, width: 210}} color={"blue"}
                                    block as={Segment} raised>
                                <Header.Content style={{marginTop: -5}}>
                                    <Icon name={jobAdvPerPageOpen ? "chevron down" : "chevron right"}/>Adverts Per Page
                                </Header.Content>
                            </Header>
                        </Accordion.Title>
                        <Accordion.Content active={jobAdvPerPageOpen}>
                            <ItemsPerPageBar itemPerPage={jobAdvertsPerPage} handleClick={itemsPerPageClick}/>
                        </Accordion.Content>
                        <Divider style={{marginBottom: 20}}/>
                    </Accordion> : null}

                <Accordion>
                    <Accordion.Title onClick={() => setFiltersOpen(!filtersOpen)} active={filtersOpen}>
                        <Header dividing style={{borderRadius: 0, height: 35, width: 210}}
                                color={"blue"} block as={Segment} raised>
                            <Header.Content style={{marginTop: -5}}>
                                <Icon name="filter"/>Filter
                            </Header.Content>
                        </Header>
                    </Accordion.Title>
                    <Accordion.Content active={filtersOpen}>
                        {favoriteJobAdverts ?
                            <div>
                                {!favoritesMode ?
                                    <Button compact icon labelPosition='right' color="red" fluid
                                            onClick={setFavoriteJobAdvertsMode} style={{borderRadius: 0}}>
                                        <Icon name='heart'/>See Favorites
                                    </Button> :
                                    <Button compact icon labelPosition='right' color="violet" fluid
                                            onClick={setAllJobAdvertsMode} style={{borderRadius: 0}}>
                                        <Icon name='arrow left'/>See All
                                    </Button>}
                                <Header dividing style={{marginTop: 10, marginBottom: 10}}/>
                            </div> : null}

                        <SDropdown options={cityOption} name="cityIds" placeholder="Cities" fluid multiple
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={positionOption} name="positionIds" placeholder="Positions" fluid multiple
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={employerOption} name="employerIds" placeholder="Employers" fluid multiple
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={workModelOptions} name="workModels" placeholder="Work models" fluid multiple
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={workTimeOptions} name="workTimes" placeholder="Work times" fluid multiple
                                   formik={formik} style={filterDropdownStyle}/>

                        <Checkbox label='Today' checked={formik.values.today} style={defCheckBoxStyle}
                                  onChange={() => handleChangeFilter("today", !formik.values.today)}/>
                        <Checkbox label='This Week' checked={formik.values.thisWeek} style={defCheckBoxStyle}
                                  onChange={() => handleChangeFilter("thisWeek", !formik.values.thisWeek)}/>

                        <Header size="tiny" style={{marginBottom: 7}} content={"Minimum Salary"} dividing/>
                        <SInput name="minSalaryMoreThan" placeholder="More than" type="number" icon={"dollar sign"} formik={formik}
                                size={"small"} style={filterInputStyle}/><br/>
                        <SInput name="minSalaryLessThan" placeholder="Less than" type="number" icon={"dollar sign"} formik={formik}
                                size={"small"} style={filterInputStyle}/>

                        <Header size="tiny" style={{marginBottom: 7}} dividing content={"Maximum Salary"}/>
                        <SInput name="maxSalaryMoreThan" placeholder="More than" type="number" icon={"dollar sign"} formik={formik}
                                size={"small"} style={filterInputStyle}/><br/>
                        <SInput name="maxSalaryLessThan" placeholder="Less than" type="number" icon={"dollar sign"} formik={formik}
                                size={"small"} style={filterInputStyle}/>

                        <Header size="tiny" content={"Application Deadline"} dividing
                                style={{marginBottom: 7}}/>
                        <font style={{fontStyle: "italic"}}>Before</font>&nbsp;&nbsp;&nbsp;
                        <SInput name="deadLineBefore" placeholder="Before" type="date" formik={formik} style={filterInputStyle}
                                size={"mini"}/><br/>
                        <font style={{fontStyle: "italic", marginLeft: 8}}>After</font>&nbsp;&nbsp;&nbsp;
                        <SInput name="deadLineAfter" placeholder="After" type="date" formik={formik} style={filterInputStyle}
                                size={"mini"}/>
                        <Header dividing style={{marginBottom: 20}} color={"blue"}/>
                        <Button basic animated="fade" fluid inverted color={"green"}
                                style={{borderRadius: 0, marginTop: 10, marginBottom: 10}}
                                loading={loading} active disabled={loading} onClick={handleFilter}>
                            <Button.Content visible>Apply</Button.Content>
                            <Button.Content hidden><Icon name='filter'/></Button.Content>
                        </Button>
                        <Button animated="fade" basic fluid color={"vk"} style={{borderRadius: 0}} loading={loading}
                                active disabled={loading} onClick={handleReset}>
                            <Button.Content visible>Reset</Button.Content>
                            <Button.Content hidden><Icon name='sync alternate'/></Button.Content>
                        </Button>
                    </Accordion.Content>
                </Accordion>

            </Sidebar>
            {!visible ?
                <Menu fixed={"left"} size={"mini"} style={{width: 0}} secondary>
                    <Menu.Item onClick={toggle} style={{width: 40, height: 50, marginLeft: 0}} disabled={jobAdverts.length === 0}>
                        <Icon name='arrow right' size={"large"} color={"black"} disabled={jobAdverts.length === 0}/>
                    </Menu.Item>
                </Menu> : null}
        </div>
    )
}

export default JobAdvertListSidebar;