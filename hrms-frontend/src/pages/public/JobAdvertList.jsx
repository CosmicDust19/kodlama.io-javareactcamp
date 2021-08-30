import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {
    Button, Card, Checkbox, Grid, Header, Icon, Input, Label, Loader, Menu, Pagination, Segment, Sidebar
} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import CandidateService from "../../services/candidateService";
import {syncUser} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {changeFilteredJobAdverts, changeJobAdvertsFilters} from "../../store/actions/filterActions";
import {filterJobAdverts, handleCatch, inputStyle} from "../../utilities/Utils";
import filter from "../../store/initialStates/filterInitial";
import SDropdown from "../../utilities/customFormControls/SDropdown";

const jobAdvertisementService = new JobAdvertisementService();
export default function JobAdvertList() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const candidateService = new CandidateService();

    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user.userProps.user)
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)
    const initialFilters = {...filter.jobAdvertsFilters, pending: undefined, verification: undefined, activation: undefined}

    const [jobAdvertisements, setJobAdvertisements] = useState([]);
    const [filteredJobAdverts, setFilteredJobAdverts] = useState(useSelector(state => state?.filter.filter.filteredJobAdverts));
    const [favoriteJobAdverts, setFavoriteJobAdverts] = useState(useSelector(state => state?.user.userProps.user?.favoriteJobAdvertisements));
    const [noAdvFound, setNoAdvFound] = useState(false);
    const [itemsPerRow, setItemsPerRow] = useState(1);
    const [loading, setLoading] = useState(false);
    const [favoritesMode, setFavoritesMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertsPerPage, setJobAdvertsPerPage] = useState(10);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [workTimes] = useState(["Part Time", "Full Time"]);
    const [workModels] = useState(["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getPublic().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getPublic().then((result) => {
            setJobAdvertisements(result.data.data);
            if (filteredJobAdverts.length === 0) setFilteredJobAdverts(result.data.data)
        });
        setVerticalScreen(window.innerWidth < window.innerHeight)
    }, [filteredJobAdverts.length]);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
        setItemsPerRow(verticalScreen ? 1 : itemsPerRow)
    }, [itemsPerRow, verticalScreen, visible, currentPage]);

    const advertsLoading = jobAdvertisements.length === 0

    const indexOfLastJobAdvert = currentPage * jobAdvertsPerPage
    const indexOfFirstJobAdvert = indexOfLastJobAdvert - jobAdvertsPerPage
    const currentJobAdverts = filteredJobAdverts.slice(indexOfFirstJobAdvert, indexOfLastJobAdvert)

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

    const employerOption = employers.map((employer, index) => ({
        key: index,
        text: employer.companyName,
        value: employer.id,
    }));

    const workTimeOption = workTimes.map((workTime, index) => ({
        key: index,
        text: workTime,
        value: workTime,
    }))

    const workModelOption = workModels.map((workModel, index) => ({
        key: index,
        text: workModel,
        value: workModel,
    }))

    const formik = useFormik({
        initialValues: {
            cityIds: filters.cityIds,
            positionIds: filters.positionIds,
            employerIds: filters.employerIds,
            workTimes: filters.workTimes,
            workModels: filters.workModels,
            minSalaryLessThan: filters.minSalaryLessThan,
            maxSalaryLessThan: filters.maxSalaryLessThan,
            minSalaryMoreThan: filters.minSalaryMoreThan,
            maxSalaryMoreThan: filters.maxSalaryMoreThan,
            applicationDeadLineBefore: filters.applicationDeadLineBefore,
            applicationDeadLineAfter: filters.applicationDeadLineAfter,
            today: filters.today,
            thisWeek: filters.thisWeek,
        }
    });

    const handleChangeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const handleAdvertisementClick = id => {
        history.push(`/jobAdverts/${id}`);
        window.scrollTo(0, 0);
    };

    const handlePagePerJobAdvMenuClick = (number) => {
        setCurrentPage(1);
        setJobAdvertsPerPage(number);
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const toggle = () => setVisible(!visible)

    const handleAddToFavorites = (jobAdvId) => {
        candidateService.addJobAdvToFavorites(user.id, jobAdvId).then(r => {
            dispatch(syncUser(r.data.data))
            setFavoriteJobAdverts(r.data.data.favoriteJobAdvertisements)
            toast.error("Added to your favorites  😍")
        }).catch(handleCatch)
    }

    const handleDeleteFromFavorites = (jobAdvId) => {
        candidateService.removeJobAdvFromFavorites(user.id, jobAdvId).then(r => {
            dispatch(syncUser(r.data.data))
            setFavoriteJobAdverts(r.data.data.favoriteJobAdvertisements)
            toast("Deleted From Favorites")
        }).catch(handleCatch)
    }

    const setFavoriteJobAdvertsMode = () => {
        const filteredJobAdverts = filterJobAdverts(favoriteJobAdverts, formik.values)
        dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        setFilteredJobAdverts(filteredJobAdverts)
        setNoAdvFound(filteredJobAdverts.length === 0)
        setCurrentPage(1)
        setFavoritesMode(true)
    }

    const setAllJobAdvertsMode = () => {
        const filteredJobAdverts = filterJobAdverts(jobAdvertisements, formik.values)
        dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        setFilteredJobAdverts(filteredJobAdverts)
        setNoAdvFound(filteredJobAdverts.length === 0)
        setCurrentPage(1)
        setFavoritesMode(false)
    }

    const jobAdvInFavorites = (jobAdvId) => {
        return favoriteJobAdverts.findIndex((jobAdvertisement) => jobAdvertisement.id === jobAdvId) !== -1;
    }

    const resetFilters = () => {
        formik.setValues(initialFilters)
        formik.values = initialFilters
        handleFilter()
    }

    const handleFilter = () => {
        dispatch(changeJobAdvertsFilters(formik.values))
        const filteredJobAdverts =
            favoritesMode ?
                filterJobAdverts(favoriteJobAdverts, formik.values) :
                filterJobAdverts(jobAdvertisements, formik.values)
        if (favoriteJobAdverts && favoritesMode) dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        else dispatch(changeFilteredJobAdverts(filteredJobAdverts));
        setFilteredJobAdverts(filteredJobAdverts)
        setNoAdvFound(filteredJobAdverts.length === 0)
        setCurrentPage(1)
    }

    const applyFiltersClick = () => {
        setLoading(true)
        setTimeout(() => {
            handleFilter()
            setLoading(false)
            setVisible(false)
        }, 500)
    }

    const resetFiltersClick = () => {
        setLoading(true);
        setTimeout(() => {
            resetFilters()
            setLoading(false);
        }, 300)
    }

    function options() {
        return (
            <div>
                <Sidebar as={Segment} animation={"push"} direction={"left"} visible={visible} textAlign={"center"} padded
                         size={verticalScreen ? "large" : undefined} style={{opacity: 0.95}}>

                    <Label attached={"top right"} onClick={toggle} as={Button}
                           icon={<Icon name={"x"} style={{marginRight: -3, marginLeft: 0, marginTop: -3}} size={"large"}/>}
                           style={{marginTop: 5, marginRight: 5, borderRadius: 20}}/>
                    <Segment basic size={"mini"} style={{marginBottom: -10}}/>

                    <Segment size={"mini"} style={{borderRadius: 10}} raised vertical>
                        <Header dividing disabled={advertsLoading} style={{marginBottom: 10, marginTop: 10}} color={"blue"}
                                content={"Adverts Per Page"}/>
                        <Menu secondary icon={"labeled"} pagination size={"small"} vertical>
                            <Menu.Item name='5' active={jobAdvertsPerPage === 5}
                                       disabled={filteredJobAdverts.length === 0 || advertsLoading}
                                       onClick={() => handlePagePerJobAdvMenuClick(5)} content={"5"}/>
                            <Menu.Item name='10' active={jobAdvertsPerPage === 10}
                                       disabled={filteredJobAdverts.length === 0 || advertsLoading}
                                       onClick={() => handlePagePerJobAdvMenuClick(10)} content={"10"}/>
                            <Menu.Item name='20' active={jobAdvertsPerPage === 20}
                                       disabled={filteredJobAdverts.length === 0 || advertsLoading}
                                       onClick={() => handlePagePerJobAdvMenuClick(20)} content={"20"}/>
                            <Menu.Item name='50' active={jobAdvertsPerPage === 50}
                                       disabled={filteredJobAdverts.length === 0 || advertsLoading}
                                       onClick={() => handlePagePerJobAdvMenuClick(50)} content={"50"}/>
                            <Menu.Item name='100' active={jobAdvertsPerPage === 100}
                                       disabled={filteredJobAdverts.length === 0 || advertsLoading}
                                       onClick={() => handlePagePerJobAdvMenuClick(100)} content={"100"}/>
                        </Menu>
                    </Segment>

                    <Header dividing disabled={advertsLoading} style={{marginBottom: 10}} color={"purple"}>
                        <Header.Content content={<div><Icon name="filter"/>Filter</div>}/>
                    </Header>
                    {favoriteJobAdverts ?
                        <div>
                            {!favoritesMode ?
                                <Button compact icon labelPosition='right' color="red" fluid disabled={advertsLoading}
                                        onClick={setFavoriteJobAdvertsMode} style={{borderRadius: 6}}>
                                    <Icon name='heart'/>See Favorites
                                </Button> :
                                <Button compact icon labelPosition='right' color="violet" fluid disabled={advertsLoading}
                                        onClick={setAllJobAdvertsMode} style={{borderRadius: 6}}>
                                    <Icon name='arrow left'/>See All
                                </Button>}
                            <Header dividing style={{marginTop: 10, marginBottom: 10}}/>
                        </div> : null
                    }

                    <SDropdown options={cityOption} name="cityIds" placeholder="Cities" fluid multiple disabled={advertsLoading}
                               formik={formik}/>
                    <SDropdown options={positionOption} name="positionIds" placeholder="Positions" fluid multiple disabled={advertsLoading}
                               formik={formik}/>
                    <SDropdown options={employerOption} name="employerIds" placeholder="Employers" fluid multiple disabled={advertsLoading}
                               formik={formik}/>
                    <SDropdown options={workModelOption} name="workModels" placeholder="Work models" fluid multiple
                               disabled={advertsLoading}
                               formik={formik}/>
                    <SDropdown options={workTimeOption} name="workTimes" placeholder="Work times" fluid multiple disabled={advertsLoading}
                               formik={formik}/>

                    <Header dividing style={{marginTop: 10, marginBottom: 10}} color={"orange"}/>
                    <Checkbox label='Today' checked={formik.values.today} style={inputStyle}
                              disabled={advertsLoading} onChange={() => handleChangeFilter("today", !formik.values.today)}/>
                    <Checkbox label='This Week' checked={formik.values.thisWeek} style={inputStyle}
                              disabled={advertsLoading} onChange={() => handleChangeFilter("thisWeek", !formik.values.thisWeek)}/>
                    <Header dividing style={{marginTop: 10, marginBottom: 0}} color={"teal"}/>

                    <Header size="tiny" disabled={advertsLoading} style={{marginTop: 10, marginBottom: 5}} content={"Minimum Salary"}/>
                    <Input placeholder="More than" value={formik.values.minSalaryMoreThan} fluid name="minSalaryMoreThan"
                           type="number" disabled={advertsLoading} size={"small"} onChange={formik.handleChange}/>
                    <Input placeholder="Less than" value={formik.values.minSalaryLessThan} fluid name="minSalaryLessThan"
                           type="number" disabled={advertsLoading} size={"small"} onChange={formik.handleChange}
                           style={{marginTop: 5, marginBottom: 5}}/>

                    <Header dividing style={{marginTop: 10, marginBottom: 0}} color={"olive"}/>
                    <Header size="tiny" disabled={advertsLoading} style={{marginTop: 10, marginBottom: 5}} content={"Maximum Salary"}/>
                    <Input placeholder="More than" value={formik.values.maxSalaryMoreThan} fluid name="maxSalaryMoreThan"
                           type="number" disabled={advertsLoading} size={"small"} onChange={formik.handleChange}/>
                    <Input placeholder="Less than" value={formik.values.maxSalaryLessThan} fluid name="maxSalaryLessThan"
                           type="number" disabled={advertsLoading} size={"small"} onChange={formik.handleChange}
                           style={{marginTop: 5}}/>

                    <Header dividing style={{marginTop: 10, marginBottom: 0}} color={"blue"}/>
                    <Header size="tiny" disabled={advertsLoading} content={"Application Deadline"}
                            style={{marginBottom: 5, marginTop: 10}}/>
                    Before
                    <Input value={formik.values.applicationDeadLineBefore} fluid name="applicationDeadLineBefore" type="date"
                           style={{marginBottom: 5}} disabled={advertsLoading} size={"mini"} onChange={formik.handleChange}/>
                    After
                    <Input value={formik.values.applicationDeadLineAfter} fluid name="applicationDeadLineAfter" type="date"
                           disabled={advertsLoading} size={"mini"} onChange={formik.handleChange}/>

                    <Header dividing style={{marginTop: 10, marginBottom: 20}} color={"yellow"}/>
                    <Button basic animated="fade" fluid inverted color={"green"}
                            style={{borderRadius: 7, marginTop: 10, marginBottom: 10}}
                            loading={loading} active disabled={advertsLoading || loading} onClick={applyFiltersClick}>
                        <Button.Content visible>Apply</Button.Content>
                        <Button.Content hidden><Icon name='filter'/></Button.Content>
                    </Button>
                    <Button animated="fade" basic fluid color={"vk"} style={{borderRadius: 7}} loading={loading}
                            active disabled={advertsLoading || loading} onClick={resetFiltersClick}>
                        <Button.Content visible>Reset</Button.Content>
                        <Button.Content hidden><Icon name='sync alternate'/></Button.Content>
                    </Button>
                </Sidebar>
                {!visible ?
                    <Menu fixed={"left"} size={"mini"} style={{width: 0}} secondary>
                        <Menu.Item onClick={toggle} style={{width: 40, height: 50, marginLeft: 0}}>
                            <Icon name='arrow right' size={"large"}
                                  color={"black"}/>
                        </Menu.Item>
                    </Menu> : null}
            </div>
        )
    }

    function listJobAdverts(currentJobAdvertisements) {
        if (noAdvFound) return <Header style={{marginTop: "2em", marginLeft: "2em"}}
                                       content={<font class={"handWriting"} color="black">No results were found 🙃</font>}/>

        return (
            <Card.Group itemsPerRow={itemsPerRow}>
                {currentJobAdvertisements.map((jobAdvertisement) => (
                    <Card color={colors[Math.floor(Math.random() * 12)]}
                          key={jobAdvertisement.id} style={{borderRadius: 10}} raised>
                        <Card.Content>
                            <Card.Header>
                                <Grid>
                                    <Grid.Column width={13}>
                                        {jobAdvertisement.position.title}
                                    </Grid.Column>
                                    <Grid.Column width={3} textAlign={"right"}>
                                        {favoriteJobAdverts ?
                                            (jobAdvInFavorites(jobAdvertisement.id) ?
                                                <Icon name={"heart"} color={"red"} onClick={() => {
                                                    handleDeleteFromFavorites(jobAdvertisement.id)
                                                }}/> :
                                                <Icon name={"heart outline"} onClick={() => {
                                                    handleAddToFavorites(jobAdvertisement.id)
                                                }}/>) : null}
                                    </Grid.Column>
                                </Grid>
                            </Card.Header>

                            <Card.Meta>{jobAdvertisement.employer.companyName}</Card.Meta>
                            <Card.Description>
                                <Grid stackable>
                                    <Grid.Column width={8}>
                                        <Icon name={"map marker"}/> {jobAdvertisement.city.name}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign="right">
                                        <Button compact icon labelPosition='right' disabled={loading} onClick={() => {
                                            handleAdvertisementClick(jobAdvertisement.id);
                                        }} style={{marginTop: -7, borderRadius: 10}}><Icon name='right arrow'/>
                                            See detail</Button>
                                    </Grid.Column>
                                </Grid>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Grid>
                                    <Grid.Column width={8}>
                                        {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel}
                                    </Grid.Column>
                                    <Grid.Column width={8}
                                                 textAlign={"right"}>{!verticalScreen && itemsPerRow === 1 ? "Created at" : null}
                                        {" " + new Date(jobAdvertisement.createdAt).getDate() + " " +
                                        months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                                        new Date(jobAdvertisement.createdAt).getFullYear()}
                                    </Grid.Column>
                                </Grid>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        )
    }

    function paginationBar() {
        return (
            <Pagination
                totalPages={Math.ceil(filteredJobAdverts.length / jobAdvertsPerPage)}
                onPageChange={handlePaginationChange}
                activePage={currentPage}
                secondary
                pointing
                firstItem={null}
                lastItem={null}
                siblingRange={2}
                disabled={filteredJobAdverts.length === 0}
            />
        )
    }

    function itemsPerRowIcon() {
        if (verticalScreen) return null
        return (
            itemsPerRow === 1 ?
                <Icon name={"th large"} onClick={() =>
                    setItemsPerRow(2)} disabled={filteredJobAdverts.length === 0}
                      style={{marginLeft: 20, marginTop: 12, color: "rgba(199,39,39,0.78)"}}/> :
                <Icon name={"bars"} size="large" onClick={() =>
                    setItemsPerRow(1)} disabled={filteredJobAdverts.length === 0}
                      style={{marginLeft: 20, marginTop: 12, color: "rgba(20,191,103,0.87)"}}/>
        )
    }

    return (
        <Segment padded style={{marginTop: -40}} basic>
            {options()}
            {advertsLoading ?
                <Loader active inline='centered' size={"big"}/> :
                <div>
                    <Segment basic size={"mini"} textAlign={"center"} style={{marginTop: -20}}>
                        {paginationBar()}
                        {itemsPerRowIcon()}
                    </Segment>
                    {listJobAdverts(currentJobAdverts)}
                </div>
            }
        </Segment>
    );
}