import {Button, Checkbox, Header, Icon, Label, Loader, Menu, Message, Segment, Sidebar, Transition} from "semantic-ui-react";
import ItemsPerPageBar from "./ItemsPerPageBar";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import {
    getFilteredJobAdverts, initialJobAdvFilters, jobAdvertStatusOptions, workModelOptions, workTimeOptions
} from "../../utilities/JobAdvertUtils";
import {getCityOption, getEmployerOption, getPositionOption} from "../../utilities/Utils";
import SInput from "../../utilities/customFormControls/SInput";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";
import {useFormik} from "formik";
import {changeFilteredJobAdverts, changeJobAdvertsFilters} from "../../store/actions/listingActions";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {toast} from "react-toastify";
import JobAdvertSortBar from "./JobAdvertSortBar";

function JobAdvertSidebar({itemsPerPage, itemsPerPageClick, setWaitingResp}) {

    const dispatch = useDispatch();

    const userProps = useSelector(state => state?.user.userProps)
    const favoriteJobAdverts = userProps.user?.favoriteJobAdvertisements
    const management = String(userProps.userType) === "systemEmployee"

    const jobAdvertService = new JobAdvertisementService()
    const jobAdvertGetFunc = management ? jobAdvertService.getAll : jobAdvertService.getPublic

    const filterProps = useSelector(state => state?.listingReducer.listingProps.jobAdverts)
    const filteredJobAdverts = filterProps.filteredJobAdverts
    const filters = filterProps.filters
    const firstFilter = filterProps.firstFilter
    const lastSynced = filterProps.lastSynced
    const now = new Date().getTime()

    const [allJobAdverts, setAllJobAdverts] = useState();
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [favoritesMode, setFavoritesMode] = useState(false);
    const [jobAdvPerPageOpen, setJobAdvPerPageOpen] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(true);

    useEffect(() => {
        return () => {
            setAllJobAdverts(undefined)
            setCities(undefined)
            setPositions(undefined)
            setEmployers(undefined)
            setFavoritesMode(undefined)
            setJobAdvPerPageOpen(undefined)
            setFiltersOpen(undefined)
        };
    }, []);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        cityService.getAll().then((result) => setCities(result.data.data));
        positionService.getAll().then((result) => setPositions(result.data.data));
        employerService.getPublic().then((result) => setEmployers(result.data.data));
    }, []);

    useEffect(() => {
        setLoading(true)
        jobAdvertGetFunc()
            .then(r => {
                setAllJobAdverts(r.data.data)
                if (firstFilter === true && r.data.data)
                    dispatch(changeFilteredJobAdverts(r.data.data, undefined, r.data.data.length === 0))
                setWaitingResp(false)
            })
            .catch(() => {
                setWaitingResp(true)
                toast("Waiting for response 🕔 ... Thanks for your patience.")
                toast.warning("Please refresh the page after a while.", {autoClose: 10000})
            })
            .finally(() => setLoading(false))
    }, [dispatch, firstFilter, filteredJobAdverts, filters, jobAdvertGetFunc, setWaitingResp]);

    useEffect(() => {
        if (now - lastSynced > 180000) jobAdvertGetFunc().then(r => {
            setAllJobAdverts(r.data.data)
            if (r.data.data)
                dispatch(changeFilteredJobAdverts(getFilteredJobAdverts(r.data.data, filters), true))
        })
    }, [dispatch, filters, filteredJobAdverts, jobAdvertGetFunc, lastSynced, now]);

    const formik = useFormik({
        initialValues: management ? {...filters} : {...filters, statuses: []}
    });

    if (!allJobAdverts)
        return <Loader active inline='centered' size={"large"} content={"Waiting for response..."} style={{marginTop: 140, marginBottom: 100}}/>
    else if (allJobAdverts.length === 0)
        return (
            <Message warning compact as={Segment} raised style={{marginBottom: 50, marginLeft: -5}}>
                <Icon name={"wait"} size={"large"}/>
                <font style={{verticalAlign: "middle"}}>
                    No job adverts found. Please wait for employers to add. Job adverts listed if stored before.
                </font>
            </Message>
        )

    const verticalScreen = window.innerWidth < window.innerHeight

    const headerStyle = {marginBottom: 7, marginTop: 14, textAlign: "left"}
    const deadlineInputStyle = {marginBottom: 7, width: 130}
    const salaryInputStyle = {marginBottom: 7, marginRight: 5, marginLeft: 5, width: 70}
    const openPosInputStyle = {...salaryInputStyle}
    const filterDropdownStyle = {marginTop: 10, marginBottom: 10, marginRight: 15}

    const cityOption = getCityOption(cities)
    const positionOption = getPositionOption(positions)
    const employerOption = getEmployerOption(employers)

    const toggle = () => setVisible(!visible)

    const changeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const toggleFavoritesMode = (favoritesMode) => {
        const jobAdverts = favoritesMode === true ? favoriteJobAdverts : allJobAdverts
        const filteredJobAdverts = getFilteredJobAdverts(jobAdverts, filters)
        dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        setFavoritesMode(favoritesMode)
    }

    const handleReset = () => {
        setLoading(true)
        setFavoritesMode(false)
        formik.setValues({...initialJobAdvFilters})
        dispatch(changeJobAdvertsFilters({...initialJobAdvFilters}))
        dispatch(changeFilteredJobAdverts(allJobAdverts, true))
    }

    const handleFilter = ({reset = false}) => {
        setLoading(true)
        dispatch(changeJobAdvertsFilters(formik.values))
        const jobAdverts = favoritesMode === true && reset === false ? favoriteJobAdverts : allJobAdverts
        dispatch(changeFilteredJobAdverts(getFilteredJobAdverts(jobAdverts, formik.values), true))
        setVisible(false)
        window.scrollTo(0, 0)
    }

    const getAccordionStatusIcon = (active) =>
        <Icon name={active ? "circle" : "circle outline"} style={{float: "left", marginRight: -20}}/>

    return (
        <div style={{userSelect: "none"}}>
            <Sidebar as={Segment} animation={"push"} direction={"left"} visible={visible} textAlign={"center"} padded
            style={{backgroundColor: "rgb(247,247,247)"}}>

                <Label attached={"top right"} onClick={toggle} as={Button} style={{marginTop: 6, marginRight: 5, borderRadius: 20}}
                       icon={<Icon name={"x"} style={{marginRight: -3, marginLeft: 0, marginTop: -2}} size={"large"} color={"black"}/>}/>

                <br/><br/>
                <Button color={"yellow"} labelPosition={"right"} fluid style={{borderRadius: 7}}
                        content={"Scroll To Top"} icon={"arrow up"} onClick={() => window.scrollTo(0, 0)}/>

                {favoriteJobAdverts ? !favoritesMode ?
                    <Button icon labelPosition='right' color="violet" fluid style={{marginTop: 25, borderRadius: 7}}
                            onClick={() => toggleFavoritesMode(true)}>
                        <Icon name='heart'/>See Favorites
                    </Button> :
                    <Button icon labelPosition='right' color="violet" fluid style={{marginTop: 25, borderRadius: 7}}
                            onClick={() => toggleFavoritesMode(false)}>
                        <Icon name='arrow left'/>See All
                    </Button> : null}

                {verticalScreen ?
                    <div>
                        <Button style={{marginTop: 25, marginBottom: 15, borderRadius: 7}} color={"teal"} labelPosition={"right"} fluid icon={"ordered list"}
                                content={<span>{getAccordionStatusIcon(jobAdvPerPageOpen)}Adverts Per Page</span>}
                                onClick={() => setJobAdvPerPageOpen(!jobAdvPerPageOpen)}/>
                        <Transition visible={jobAdvPerPageOpen} duration={150}>
                            <div>
                                <ItemsPerPageBar itemPerPage={itemsPerPage} handleClick={itemsPerPageClick} vertical color={"teal"}
                                                 listedItemsLength={filteredJobAdverts.length} style={{maxWidth: 205}}/>
                            </div>
                        </Transition>
                    </div> : null}

                <JobAdvertSortBar loading={loading} setLoading={setLoading}/>

                <Button style={{marginTop: 25, marginBottom: 10, borderRadius: 7}} color={"linkedin"} labelPosition={"right"} fluid
                        onClick={() => setFiltersOpen(!filtersOpen)} icon={"filter"}
                        content={<span>{getAccordionStatusIcon(filtersOpen)}Filter</span>}/>
                <Transition visible={filtersOpen} duration={150}>
                    <div>
                        {management ? <SDropdown options={jobAdvertStatusOptions} name="statuses" placeholder="Statuses" fluid
                                                 formik={formik} style={filterDropdownStyle}/> : null}
                        <SDropdown options={cityOption} name="cityIds" placeholder="Cities" fluid
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={positionOption} name="positionIds" placeholder="Positions" fluid
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={employerOption} name="employerIds" placeholder="Employers" fluid
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={workModelOptions} name="workModels" placeholder="Work models" fluid
                                   formik={formik} style={filterDropdownStyle}/>
                        <SDropdown options={workTimeOptions} name="workTimes" placeholder="Work times" fluid
                                   formik={formik} style={filterDropdownStyle}/>

                        <Header size="tiny" style={{...headerStyle, marginTop: 20}} dividing sub>
                            <Icon name={"bullhorn"} color={"yellow"} style={{marginRight: 7}}/>Creation Date
                        </Header>
                        <Checkbox label='Today' checked={formik.values.today} className={"checkbox"}
                                  onChange={() => changeFilter("today", !formik.values.today)}/>
                        <Checkbox label='This Week' checked={formik.values.thisWeek} className={"checkbox"}
                                  onChange={() => changeFilter("thisWeek", !formik.values.thisWeek)}/>

                        <Header size="tiny" style={headerStyle} dividing sub>
                            <Icon name={"dollar sign"} style={{marginRight: 5, color: "rgba(29,150,11,0.8)"}}/>Minimum Salary
                        </Header>
                        <SInput name="minSalaryMoreThan" placeholder="Min" type="number" formik={formik}
                                size={"small"} style={salaryInputStyle}/>
                        <SInput name="minSalaryLessThan" placeholder="Max" type="number" formik={formik}
                                size={"small"} style={salaryInputStyle}/>

                        <Header size="tiny" style={headerStyle} dividing sub>
                            <Icon name={"dollar sign"} style={{marginRight: 5, color: "rgba(29,150,11,0.8)"}}/>Maximum Salary
                        </Header>
                        <SInput name="maxSalaryMoreThan" placeholder="Min" type="number" formik={formik}
                                size={"small"} style={salaryInputStyle}/>
                        <SInput name="maxSalaryLessThan" placeholder="Max" type="number" formik={formik}
                                size={"small"} style={salaryInputStyle}/>

                        <Header size="tiny" style={headerStyle} dividing sub>
                            <Icon name={"users"} color={"blue"} style={{marginRight: 7}}/>Open positions
                        </Header>
                        <SInput name="openPositionsMin" placeholder="Min" type="number" formik={formik}
                                size={"small"} style={openPosInputStyle}/>
                        <SInput name="openPositionsMax" placeholder="Max" type="number" formik={formik}
                                size={"small"} style={openPosInputStyle}/>

                        <Header size="tiny" dividing style={headerStyle} sub>
                            <Icon name={"calendar alternate outline"} color={"purple"} style={{marginRight: 5}}/>Application Deadline
                        </Header>
                        <font style={{fontStyle: "italic"}}>Before</font>&nbsp;&nbsp;&nbsp;
                        <SInput name="deadLineBefore" placeholder="Before" type="date" formik={formik} style={deadlineInputStyle}
                                size={"mini"}/><br/>
                        <font style={{fontStyle: "italic", marginLeft: 8}}>After</font>&nbsp;&nbsp;&nbsp;
                        <SInput name="deadLineAfter" placeholder="After" type="date" formik={formik} style={deadlineInputStyle}
                                size={"mini"}/>


                        <Header dividing style={{marginBottom: 10}} color={"blue"}/>
                        <Button color={"green"} content={"Apply"} labelPosition={"right"} fluid loading={loading}
                                icon={"filter"} onClick={handleFilter} disabled={loading}
                                style={{borderRadius: 7, marginTop: 10, marginBottom: 10}} basic/>
                        <Button color={"vk"} content={"Reset"} labelPosition={"right"} fluid loading={loading}
                                icon={"sync alternate"} onClick={handleReset} disabled={loading}
                                style={{borderRadius: 7}} basic/>
                    </div>
                </Transition>
            </Sidebar>
            <Transition visible={!visible} duration={1500}>
                <div>
                    <Menu fixed={"left"} size={"mini"} style={{width: 0}} secondary>
                        <Menu.Item onClick={toggle} style={{width: 40, height: 50, marginLeft: 0}} disabled={allJobAdverts.length === 0}>
                            <Icon name='arrow right' size={"large"} color={"black"} disabled={allJobAdverts.length === 0}/>
                        </Menu.Item>
                    </Menu>
                </div>
            </Transition>
        </div>
    )
}

export default JobAdvertSidebar;