import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {
    Button, Card, Checkbox, Dropdown, Grid, Header, Icon, Image,
    Input, Menu, Pagination, Placeholder, Popup, Segment
} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import CityService from "../services/cityService";
import PositionService from "../services/positionService";
import EmployerService from "../services/employerService";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import CandidateService from "../services/candidateService";
import {changeFavoriteJobAdv} from "../store/actions/userActions";
import {toast} from "react-toastify";
import {changeJobAdvertsFilters, filterJobAdverts} from "../store/actions/filterActions";
import filter from "../store/initialStates/filterInitial";
import _ from "lodash";

let jobAdvertisementService = new JobAdvertisementService();
export default function JobAdvertisementsList() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    const candidateService = new CandidateService();

    const history = useHistory();
    const dispatch = useDispatch();
    const isFirstVisit = useSelector(state => state?.user.userProps.guest)
    const user = useSelector(state => state?.user.userProps.user)
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)
    let filteredJobAdvertisements = useSelector(state => state?.filter.filter.filteredJobAdverts)

    const [itemsPerRow, setItemsPerRow] = useState(1);
    const [loading, setLoading] = useState(false);
    const [favoritesMode, setFavoritesMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertisementsPerPage, setJobAdvertisementsPerPage] = useState(10);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [workTimes] = useState(["Part Time", "Full Time"]);
    const [workModels] = useState(["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]);
    const [jobAdvertisements, setJobAdvertisements] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getPublic().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getPublic().then((result) => {
            setJobAdvertisements(result.data.data)
        });
    }, []);

    if (filteredJobAdvertisements === undefined) filteredJobAdvertisements = jobAdvertisements
    else if (filteredJobAdvertisements.length === 0 && isFirstVisit) {
        const _ = require('lodash');
        if (_.isEqual(filters, filter.jobAdvertsFilters)) filteredJobAdvertisements = jobAdvertisements
    }

    const indexOfLastJobAdvertisement = currentPage * jobAdvertisementsPerPage
    const indexOfFirstJobAdvertisement = indexOfLastJobAdvertisement - jobAdvertisementsPerPage
    const currentJobAdvertisements = filteredJobAdvertisements.slice(indexOfFirstJobAdvertisement, indexOfLastJobAdvertisement)

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

    const refreshPage = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleCatch = (error) => {
        toast.warning("An error has occurred")
        console.log(error.response)
        refreshPage()
    }

    const handleChangeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
        window.scrollTo(0, 0)
    };

    const handlePagePerJobAdvMenuClick = (number) => {
        setCurrentPage(1)
        setJobAdvertisementsPerPage(number)
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const handleAddToFavorites = (jobAdvId) => {
        console.log(jobAdvId)
        candidateService.addJobAdvToFavorites(user.id, jobAdvId).then(() => {
            const index = jobAdvertisements.findIndex((jobAdvertisement) => jobAdvertisement.id === jobAdvId)
            user.favoriteJobAdvertisements.push(jobAdvertisements[index])
            dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
            toast.error("Added To Favorites  😍")
            refreshPage()
        }).catch(handleCatch)
    }

    const handleDeleteFromFavorites = (jobAdvId) => {
        candidateService.removeJobAdvFromFavorites(user.id, jobAdvId).then(() => {
            const index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement) => jobAdvertisement.id === jobAdvId)
            user.favoriteJobAdvertisements.splice(index, 1)
            dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
            toast("Deleted From Favorites")
            refreshPage()
        }).catch(handleCatch)
    }

    const setFavoriteJobAdvertsMode = () => {
        setCurrentPage(1)
        dispatch(filterJobAdverts(user.favoriteJobAdvertisements, formik.values))
        setFavoritesMode(true)
    }

    const setAllJobAdvertsMode = () => {
        setCurrentPage(1)
        dispatch(filterJobAdverts(jobAdvertisements, formik.values))
        setFavoritesMode(false)
    }

    const isJobAdvInFavorites = (jobAdvId) => {
        let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement) => jobAdvertisement.id === jobAdvId)
        return index !== -1;
    }

    const handleResetFilters = () => {
        handleChangeFilter("cityIds", [])
        handleChangeFilter("positionIds", [])
        handleChangeFilter("employerIds", [])
        handleChangeFilter("workModels", [])
        handleChangeFilter("workTimes", [])
        handleChangeFilter("minSalaryLessThan", "")
        handleChangeFilter("maxSalaryLessThan", "")
        handleChangeFilter("minSalaryMoreThan", "")
        handleChangeFilter("maxSalaryMoreThan", "")
        handleChangeFilter("applicationDeadLineBefore", "")
        handleChangeFilter("applicationDeadLineAfter", "")
        handleChangeFilter("today", false)
        handleChangeFilter("thisWeek", false)
        formik.values = {
            cityIds: [], positionIds: [], employerIds: [], workTimes: [], workModels: [],
            minSalaryLessThan: "", maxSalaryLessThan: "", minSalaryMoreThan: "", maxSalaryMoreThan: "",
            applicationDeadLineBefore: "", applicationDeadLineAfter: "",
            today: false, thisWeek: false,
        }
        handleFilter()
    }

    const handleFilter = () => {
        dispatch(changeJobAdvertsFilters(formik.values))
        if (user?.favoriteJobAdvertisements && favoritesMode) dispatch(filterJobAdverts(user.favoriteJobAdvertisements, formik.values))
        else dispatch(filterJobAdverts(jobAdvertisements, formik.values))
        setCurrentPage(1)
    }

    function filtersSegment() {
        return (
            <Segment style={{borderRadius: 10, marginRight: 40}} textAlign={"center"} floated={"left"} raised>
                <Header dividing disabled={jobAdvertisements.length === 0}>
                    <Header.Content>
                        <Icon name="filter"/>
                        Filter
                    </Header.Content>
                    <Header.Content style={{marginLeft: 40, marginTop: -8}}>
                        <Button compact icon basic active color = {"black"} labelPosition='left' disabled={jobAdvertisements.length === 0 || loading}
                                style={{borderRadius: 10}} loading={loading} onClick={() => {
                            setLoading(true);
                            setTimeout(() => {
                                handleResetFilters()
                                setLoading(false);
                            }, 300)
                        }}>
                            <Icon name='sync alternate' color="black" circular={jobAdvertisements.length === 0}
                                  loading={jobAdvertisements.length === 0}/>
                            Reset
                        </Button>
                    </Header.Content>
                </Header>
                {user?.favoriteJobAdvertisements ?
                    (!favoritesMode ?
                        <Button compact icon labelPosition='right' color="red" fluid
                                disabled={jobAdvertisements.length === 0}
                                onClick={setFavoriteJobAdvertsMode}
                                style={{borderRadius: 10, marginTop: -5, marginBottom: 10}}><Icon name='heart'/>See
                            Favorites</Button> :
                        <Button compact icon labelPosition='right' color="violet" fluid
                                disabled={jobAdvertisements.length === 0}
                                onClick={setAllJobAdvertsMode}
                                style={{borderRadius: 10, marginTop: -5, marginBottom: 10}}><Icon name='arrow left'/>See
                            All</Button>) : null}
                <Dropdown clearable item placeholder="Select cities" search multiple selection fluid
                          options={cityOption} value={formik.values.cityIds}
                          disabled={jobAdvertisements.length === 0} loading={cities.length === 0}
                          onChange={(event, data) => {
                              handleChangeFilter("cityIds", data.value)
                          }}/>
                <Dropdown clearable item placeholder="Select positions" search multiple selection fluid
                          options={positionOption} value={formik.values.positionIds} style={{marginTop: 10}}
                          disabled={jobAdvertisements.length === 0} loading={positions.length === 0}
                          onChange={(event, data) => {
                              handleChangeFilter("positionIds", data.value)
                          }}/>
                <Dropdown clearable item placeholder="Select employers" search multiple selection fluid
                          options={employerOption} value={formik.values.employerIds} style={{marginTop: 10}}
                          disabled={jobAdvertisements.length === 0} loading={employers.length === 0}
                          onChange={(event, data) => {
                              handleChangeFilter("employerIds", data.value)
                          }}/>
                <Dropdown clearable item placeholder="Select work model" search multiple selection fluid
                          options={workModelOption} value={formik.values.workModels} style={{marginTop: 10}}
                          disabled={jobAdvertisements.length === 0} loading={workModels.length === 0}
                          onChange={(event, data) => {
                              handleChangeFilter("workModels", data.value)
                          }}/>
                <Dropdown clearable item placeholder="Select work time" search multiple selection fluid
                          options={workTimeOption} value={formik.values.workTimes} style={{marginTop: 10}}
                          disabled={jobAdvertisements.length === 0} loading={workTimes.length === 0}
                          onChange={(event, data) => {
                              handleChangeFilter("workTimes", data.value)
                          }}/>

                <Segment basic size={"mini"}>
                    <Checkbox label='Today' checked={formik.values.today} style={{marginRight: 20}}
                              disabled={jobAdvertisements.length === 0} onChange={() => {
                        handleChangeFilter("today", !formik.values.today)
                    }}/>
                    <Checkbox label='This Week' checked={formik.values.thisWeek} style={{marginLeft: 20}}
                              disabled={jobAdvertisements.length === 0} onChange={() => {
                        handleChangeFilter("thisWeek", !formik.values.thisWeek)
                    }}/>
                </Segment>

                <Header size="tiny" disabled={jobAdvertisements.length === 0} style={{marginTop: 10}}>
                    Minimum Salary
                </Header>
                <Grid columns="equal">
                    <Grid.Column>
                        <Input placeholder="More than" value={formik.values.minSalaryMoreThan} fluid
                               name="minSalaryMoreThan" type="number"
                               disabled={jobAdvertisements.length === 0} size={"small"}
                               onChange={formik.handleChange}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder="Less than" value={formik.values.minSalaryLessThan} fluid
                               name="minSalaryLessThan" type="number"
                               disabled={jobAdvertisements.length === 0} size={"small"}
                               onChange={formik.handleChange}/>
                    </Grid.Column>
                </Grid>


                <Header size="tiny" disabled={jobAdvertisements.length === 0}>
                    Maximum Salary
                </Header>
                <Grid columns="equal">
                    <Grid.Column>
                        <Input placeholder="More than" value={formik.values.maxSalaryMoreThan} fluid
                               name="maxSalaryMoreThan" type="number"
                               disabled={jobAdvertisements.length === 0} size={"small"}
                               onChange={formik.handleChange}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder="Less than" value={formik.values.maxSalaryLessThan} fluid
                               name="maxSalaryLessThan" type="number"
                               disabled={jobAdvertisements.length === 0} size={"small"}
                               onChange={formik.handleChange}/>
                    </Grid.Column>
                </Grid>

                <Header size="tiny" disabled={jobAdvertisements.length === 0}>
                    Application Deadline
                    <Header.Subheader>
                        <Grid columns={"equal"} textAlign={"center"}>
                            <Grid.Column>
                                Before
                            </Grid.Column>
                            <Grid.Column>
                                After
                            </Grid.Column>
                        </Grid>
                    </Header.Subheader>
                </Header>
                <Grid columns="equal" style={{marginTop: -40}}>
                    <Grid.Column>
                        <Input value={formik.values.applicationDeadLineBefore} fluid
                               name="applicationDeadLineBefore" type="date" style={{marginRight: -10}}
                               disabled={jobAdvertisements.length === 0} size={"mini"}
                               onChange={formik.handleChange}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Input value={formik.values.applicationDeadLineAfter} fluid
                               name="applicationDeadLineAfter" type="date" style={{marginLeft: -10}}
                               disabled={jobAdvertisements.length === 0} size={"mini"}
                               onChange={formik.handleChange}/>
                    </Grid.Column>
                </Grid>

                <Segment basic>
                    <Button basic animated="fade" fluid color={"green"} style={{borderRadius: 10}} loading={loading}
                            active disabled={jobAdvertisements.length === 0 || loading} onClick={() => {
                        setLoading(true)
                        setTimeout(() => {
                            handleFilter()
                            setLoading(false)
                        }, 500)
                    }}>
                        <Button.Content visible>Apply</Button.Content>
                        <Button.Content hidden><Icon name='filter'/></Button.Content>
                    </Button>
                </Segment>
            </Segment>
        )
    }

    function listJobAdvertisements(currentJobAdvertisements) {
        if (jobAdvertisements.length === 0) {
            let placeHolders = []
            for (let i = 0; i < 5; i++) {
                placeHolders.push(
                    <Card color={colors[Math.floor(Math.random() * 12)]} fluid key={i}
                          style={{borderRadius: 10, marginLeft: -9, marginRight: -9, marginTop: 10}}>
                        <Card.Content>
                            <Card.Header>
                                <Grid><Grid.Column width={8}>
                                    <Placeholder><Placeholder.Line length={"medium"}/></Placeholder>
                                </Grid.Column>
                                    <Grid.Column width={8} textAlign={"right"}>{user?.favoriteJobAdvertisements ?
                                        <Icon name={"heart outline"} disabled/> : null}</Grid.Column></Grid>
                            </Card.Header>
                            <Card.Description>
                                <Grid style={{marginTop: -19}}><Grid.Column width={8}>
                                    <Placeholder><Placeholder.Line length={"very short"}/></Placeholder></Grid.Column>
                                    <Grid.Column width={8} textAlign="right">
                                        <Button compact icon labelPosition='right'
                                                style={{marginTop: -7, borderRadius: 10}} disabled>
                                            <Icon name='circle notched' circular color="black"
                                                  loading={jobAdvertisements.length === 0}/>
                                            See detail</Button></Grid.Column></Grid>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Grid style={{marginTop: -23}}><Grid.Column width={13}><Placeholder><Placeholder.Line
                                    length={"short"}/></Placeholder></Grid.Column>
                                    <Grid.Column width={3} textAlign={"right"}><Placeholder><Placeholder.Line
                                        length={"very long"}/></Placeholder></Grid.Column></Grid>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                )
            }
            return (
                <Segment basic size={"large"}>
                    <Card.Group style={{marginTop: -22, marginLeft: -40, marginRight: -18}}>
                        {placeHolders}
                    </Card.Group>
                </Segment>
            )
        } else if (currentJobAdvertisements.length === 0) {
            return (
                <Header style={{marginTop: "2em", marginLeft: "2em"}}>
                    <font style={{fontStyle: "italic"}} color="black">No results were found</font>
                </Header>
            )
        }

        return (
            <Card.Group itemsPerRow={itemsPerRow} style={{marginLeft: -40}}>
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
                                        {user?.favoriteJobAdvertisements ?
                                            (isJobAdvInFavorites(jobAdvertisement.id) ?
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
                                <Grid>
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
                                    <Grid.Column width={8} textAlign={"right"}>Created at
                                        {" " + new Date(jobAdvertisement.createdAt).getDate() + " " +
                                        months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                                        new Date(jobAdvertisement.createdAt).getFullYear()}
                                    </Grid.Column>
                                </Grid>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                ))}
                <Card style={{opacity: 0}}
                      content={<Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png'/>}/>
            </Card.Group>
        )
    }

    function itemsPerPageBar() {
        return (
            <Popup
                trigger={
                    <Menu secondary icon={"labeled"} fixed="right" vertical pagination
                          style={{marginRight: "4em", marginTop: "20em"}}>
                        <Menu.Item name='5' active={jobAdvertisementsPerPage === 5}
                                   disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(5)}>5</Menu.Item>
                        <Menu.Item name='10' active={jobAdvertisementsPerPage === 10}
                                   disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(10)}>10</Menu.Item>
                        <Menu.Item name='20' active={jobAdvertisementsPerPage === 20}
                                   disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(20)}>20</Menu.Item>
                        <Menu.Item name='50' active={jobAdvertisementsPerPage === 50}
                                   disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(50)}>50</Menu.Item>
                        <Menu.Item name='100' active={jobAdvertisementsPerPage === 100}
                                   disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(100)}>100</Menu.Item>
                        <Menu.Item>
                            <Button animated="vertical" fluid color={"violet"} size="small"
                                    style={{borderRadius: 10}}
                                    onClick={() => window.scrollTo(0, 55)}>
                                <Button.Content visible>
                                    <Icon name='arrow up' style={{marginRight: -5, marginLeft: -5}}/>
                                </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow up' style={{marginRight: -5, marginLeft: -5}}/>
                                </Button.Content>
                            </Button></Menu.Item>
                    </Menu>
                }
                content={"Items per page"}
                style={{
                    borderRadius: 15,
                    opacity: 0.9,
                    color: "rgb(18,18,18)"
                }}
                position={"top center"}
                on={"hover"}
                mouseEnterDelay={1000}
                mouseLeaveDelay={150}
            />
        )
    }

    function paginationBar() {
        return (
            <Popup
                trigger={
                    <Pagination
                        totalPages={Math.ceil(filteredJobAdvertisements.length / jobAdvertisementsPerPage)}
                        onPageChange={handlePaginationChange}
                        activePage={currentPage}
                        secondary
                        pointing
                        firstItem={null}
                        lastItem={null}
                        siblingRange={2}
                        disabled={filteredJobAdvertisements.length === 0}
                    />
                }
                content={"Page number"}
                style={{
                    borderRadius: 15,
                    opacity: 0.9,
                    color: "rgb(18,18,18)"
                }}
                position={"top center"}
                on={"hover"}
                mouseEnterDelay={1000}
                mouseLeaveDelay={150}
            />
        )
    }

    return (
        <div>
            {itemsPerPageBar()}
            <Grid stackable padded>
                <Grid.Column width={5}>
                    <Grid padded>
                        <Grid.Row/>
                        <Grid.Row/>
                        <Grid.Row style={{marginTop: 10}} centered>
                            {filtersSegment()}
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Grid padded>
                        <Grid.Row centered style={{marginLeft: 20}}>
                            {paginationBar()}
                            {itemsPerRow === 1 ?
                                <Icon name={"th large"} onClick={() =>
                                    setItemsPerRow(2)} disabled={filteredJobAdvertisements.length === 0}
                                      style={{marginLeft: 20, marginTop: 12, color: "rgba(199,39,39,0.78)"}}/> :
                                <Icon name={"bars"} size="large" onClick={() =>
                                    setItemsPerRow(1)} disabled={filteredJobAdvertisements.length === 0}
                                      style={{marginLeft: 20, marginTop: 12, color: "rgba(20,191,103,0.87)"}}/>}
                        </Grid.Row>
                        <Grid.Row>
                            {listJobAdvertisements(currentJobAdvertisements)}
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
        </div>
    );
}