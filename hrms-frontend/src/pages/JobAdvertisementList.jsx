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

let jobAdvertisementService = new JobAdvertisementService();
export default function JobAdvertisementList() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    let history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const candidateService = new CandidateService();

    const [loading, setLoading] = useState(false);
    const [favoritesMode, setFavoritesMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertisementsPerPage, setJobAdvertisementsPerPage] = useState(5);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [workTimes] = useState(["Part Time", "Full Time"]);
    const [workModels] = useState(["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]);
    const [jobAdvertisements, setJobAdvertisements] = useState([]);
    const [filteredJobAdvertisements, setFilteredJobAdvertisements] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        let cityService = new CityService();
        let positionService = new PositionService();
        let employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getEmployers().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getJobAdvertisements().then((result) => {
            setJobAdvertisements(result.data.data)
            setFilteredJobAdvertisements(result.data.data)
        });
    }, []);

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
            positionIds: [], cityIds: [], employerIds: [], workTimes: [], workModels: [],
            salaryLessThan: "", salaryMoreThan: "", today: false, thisWeek: false,
        }
    });

    const handleChangeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
    };

    const handlePagePerJobAdvMenuClick = (number) => {
        setCurrentPage(1)
        setJobAdvertisementsPerPage(number)
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const handleAddToFavorite = (jobAdvId) => {
        candidateService.addJobAdvertisementToFavorites(user.id, jobAdvId).then(r => {
            console.log(r)
            if (r.data.success) {
                let index = jobAdvertisements.findIndex((jobAdvertisement) => {
                    return jobAdvertisement.id === jobAdvId
                })
                user.favoriteJobAdvertisements.push(jobAdvertisements[index])
                dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
                toast.error("Added To Favorites  😍")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleDeleteFromFavorites = (jobAdvId) => {
        candidateService.deleteJobAdvertisementToFavorites(user.id, jobAdvId).then(r => {
            console.log(r)
            if (r.data.success) {
                let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement) => {
                    return jobAdvertisement.id === jobAdvId
                })
                user.favoriteJobAdvertisements.splice(index, 1)
                dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
                toast("Deleted From Favorites")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const setFavoriteJobAdverts = () => {
        setCurrentPage(1)
        setFilteredJobAdvertisements(user.favoriteJobAdvertisements)
        setFavoritesMode(true)
    }

    const setAllJobAdverts = () => {
        setCurrentPage(1)
        setFilteredJobAdvertisements([...jobAdvertisements])
        setFavoritesMode(false)
    }

    const isJobAdvInFavorites = (jobAdvId) => {
        let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement) => jobAdvertisement.id === jobAdvId)
        return index !== -1;
    }

    const handleResetFilters = () => {
        formik.values = formik.initialValues
        handleFilter()
    }

    const handleFilter = () => {
        let newJobAdvertisements
        if (!favoritesMode) newJobAdvertisements = [...jobAdvertisements]
        if (favoritesMode) newJobAdvertisements = [...user.favoriteJobAdvertisements]
        let cityFiltered, positionFiltered, employerFiltered, workModelFiltered,
            workTimeFiltered, salaryLessThanFiltered = [], salaryMoreThanFiltered = [], publishTimeFiltered = [], temp
        if (formik.values.cityIds.length <= 0 || formik.values.cityIds.length >= cities.length) cityFiltered = newJobAdvertisements
        else {
            temp = []
            formik.values.cityIds.forEach((cityId) => {
                let filtered = newJobAdvertisements.filter((jobAdvertisement) => jobAdvertisement.city.id === cityId)
                temp = temp.concat(filtered)
            })
            cityFiltered = temp
        }
        if (formik.values.positionIds.length <= 0 || formik.values.positionIds.length >= positions.length) positionFiltered = cityFiltered
        else {
            temp = []
            formik.values.positionIds.forEach((positionId) => {
                let filtered = cityFiltered.filter((jobAdvertisement) => jobAdvertisement.position.id === positionId)
                temp = temp.concat(filtered)
            })
            positionFiltered = temp
        }

        if (formik.values.employerIds.length <= 0 || formik.values.employerIds.length >= employers.length) employerFiltered = positionFiltered
        else {
            temp = []
            formik.values.employerIds.forEach((employerId) => {
                let filtered = positionFiltered.filter((jobAdvertisement) => jobAdvertisement.employer.id === employerId)
                temp = temp.concat(filtered)
            })
            employerFiltered = temp
        }
        if (formik.values.workModels.length <= 0 || formik.values.workModels.length >= workModels.length) workModelFiltered = employerFiltered
        else {
            temp = []
            formik.values.workModels.forEach((workModel) => {
                let filtered = employerFiltered.filter((jobAdvertisement) => jobAdvertisement.workModel === workModel)
                temp = temp.concat(filtered)
            })
            workModelFiltered = temp
        }
        if (formik.values.workTimes.length <= 0 || formik.values.workTimes.length >= workTimes.length) workTimeFiltered = workModelFiltered
        else {
            temp = []
            formik.values.workTimes.forEach((workTime) => {
                let filtered = workModelFiltered.filter((jobAdvertisement) => jobAdvertisement.workTime === workTime)
                temp = temp.concat(filtered)
            })
            workTimeFiltered = temp
        }
        if (!formik.values.today && !formik.values.thisWeek) publishTimeFiltered = workTimeFiltered
        else {
            if (formik.values.today) publishTimeFiltered = workTimeFiltered.filter((jobAdvertisement) => {
                const today = new Date()
                const creationDate = new Date(jobAdvertisement.createdAt)
                return (today.getTime() - creationDate.getTime() < 86500000) && (today.getDay() === creationDate.getDay())
            })
            else publishTimeFiltered = workTimeFiltered.filter((jobAdvertisement) => new Date().getTime() - new Date(jobAdvertisement.createdAt).getTime() < 605000000)
        }
        if (!formik.values.salaryLessThan || formik.values.salaryLessThan === 0) salaryLessThanFiltered = publishTimeFiltered
        else {
            salaryLessThanFiltered = workTimeFiltered.filter((jobAdvertisement) => {
                if (jobAdvertisement.minSalary) return jobAdvertisement.minSalary <= formik.values.salaryLessThan
                else if (jobAdvertisement.maxSalary) return jobAdvertisement.maxSalary <= formik.values.salaryLessThan
                else return true
            })
        }
        if (!formik.values.salaryMoreThan || formik.values.salaryMoreThan === 0) salaryMoreThanFiltered = salaryLessThanFiltered
        else {
            salaryMoreThanFiltered = salaryLessThanFiltered.filter((jobAdvertisement) => {
                if (jobAdvertisement.maxSalary) return jobAdvertisement.maxSalary >= formik.values.salaryMoreThan
                else if (jobAdvertisement.minSalary) return jobAdvertisement.minSalary >= formik.values.salaryMoreThan
                else return true
            })
        }
        let filteredArray = cityFiltered.filter(jobAd => positionFiltered.includes(jobAd) && employerFiltered.includes(jobAd) &&
            workModelFiltered.includes(jobAd) && workTimeFiltered.includes(jobAd) && publishTimeFiltered.includes(jobAd) &&
            salaryLessThanFiltered.includes(jobAd) && salaryMoreThanFiltered.includes(jobAd));
        setFilteredJobAdvertisements(filteredArray)
        setCurrentPage(1)
        if (refresh === 0) setRefresh(1);
        else setRefresh(0)
    }

    function filters() {
        return (
            <Segment style={{borderRadius: 10}}>
                <Header dividing disabled={jobAdvertisements.length === 0}>
                    <Header.Content>
                        <Icon name="filter"/>
                        Filter
                    </Header.Content>
                    <Header.Content style={{marginLeft: "4em"}}>
                        <Icon name="refresh" disabled={jobAdvertisements.length === 0} onClick={() => {
                            handleResetFilters()
                            setLoading(true);
                            setTimeout(() => {
                                setLoading(false);
                            }, 1000)
                        }} loading={loading}/>Reset Filters
                    </Header.Content>
                </Header>
                <Card.Group>
                    <Card>
                        <Dropdown clearable item placeholder="Select cities" search multiple selection fluid
                                  options={cityOption} value={formik.values.cityIds}
                                  disabled={jobAdvertisements.length === 0}
                                  onChange={(event, data) => {
                                      handleChangeFilter("cityIds", data.value)
                                  }}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select positions" search multiple selection fluid
                                  options={positionOption} value={formik.values.positionIds}
                                  disabled={jobAdvertisements.length === 0}
                                  onChange={(event, data) => {
                                      handleChangeFilter("positionIds", data.value)
                                  }}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select employers" search multiple selection fluid
                                  options={employerOption} value={formik.values.employerIds}
                                  disabled={jobAdvertisements.length === 0}
                                  onChange={(event, data) => {
                                      handleChangeFilter("employerIds", data.value)
                                  }}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select work model" search multiple selection fluid
                                  options={workModelOption} value={formik.values.workModels}
                                  disabled={jobAdvertisements.length === 0}
                                  onChange={(event, data) => {
                                      handleChangeFilter("workModels", data.value)
                                  }}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select work time" search multiple selection
                                  options={workTimeOption} value={formik.values.workTimes}
                                  disabled={jobAdvertisements.length === 0}
                                  onChange={(event, data) => {
                                      handleChangeFilter("workTimes", data.value)
                                  }}/>
                    </Card>

                    <Grid celled={"internally"} textAlign={"center"}>
                        <Grid.Column>
                            <Checkbox label='Today' checked={formik.values.today} style={{marginRight: 20}}
                                      disabled={jobAdvertisements.length === 0} onChange={() => {
                                handleChangeFilter("today", !formik.values.today)
                            }}/>
                            <Checkbox label='This Week' checked={formik.values.thisWeek} style={{marginLeft: 20}}
                                      disabled={jobAdvertisements.length === 0} onChange={() => {
                                handleChangeFilter("thisWeek", !formik.values.thisWeek)
                            }}/>
                        </Grid.Column>
                    </Grid>

                    <Segment basic compact style={{marginTop: -15}}>
                        <Header size="small" disabled={jobAdvertisements.length === 0}>
                            Salary
                        </Header>
                        <Grid columns="equal">
                            <Grid.Column>
                                <Card>
                                    <Input placeholder="More than" value={formik.values.salaryMoreThan}
                                           name="salaryMoreThan" type="number" disabled={jobAdvertisements.length === 0}
                                           onChange={formik.handleChange}/>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card style={{marginLeft: -10}}>
                                    <Input placeholder="Less than" value={formik.values.salaryLessThan}
                                           name="salaryLessThan" type="number" disabled={jobAdvertisements.length === 0}
                                           onChange={formik.handleChange}/>
                                </Card>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Card.Group>

                <Grid><Grid.Row/></Grid>
                <Card>
                    <Button basic animated="fade" fluid color={"green"} style={{borderRadius: 10}}
                            disabled={jobAdvertisements.length === 0} onClick={() => {
                        handleFilter()
                    }}>
                        <Button.Content visible>Apply</Button.Content>
                        <Button.Content hidden><Icon name='filter'/></Button.Content>
                    </Button>
                </Card>
            </Segment>
        )
    }

    function listJobAdvertisements(currentJobAdvertisements) {
        if (jobAdvertisements.length === 0 && (!currentJobAdvertisements || currentJobAdvertisements.length === 0)) {
            let placeHolders = []
            for (let i = 0; i < jobAdvertisementsPerPage && i < 10; i++) {
                placeHolders.push(
                    <Card color={colors[Math.floor(Math.random() * 12)]}
                          fluid key={i} style={{borderRadius: 10, marginRight: -20}}>
                        <Card.Content>
                            <Card.Header>
                                <Grid><Grid.Column width={8}>
                                    <Placeholder><Placeholder.Line length={"medium"}/></Placeholder>
                                </Grid.Column>
                                    <Grid.Column width={8} textAlign={"right"}>{user?.favoriteJobAdvertisements ?
                                        <Icon name={"heart outline"} disabled/> : null}</Grid.Column></Grid>
                            </Card.Header>
                            <Card.Description>
                                <Grid style={{marginTop: -20}}><Grid.Column width={8}>
                                    <Placeholder><Placeholder.Line length={"very short"}/></Placeholder></Grid.Column>
                                    <Grid.Column width={8} textAlign="right">
                                        <Button compact icon labelPosition='right' style={{marginTop: -7}} disabled>
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
                    <Card.Group style={{marginTop: -30, marginLeft: -24}}>
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
            <Card.Group>
                {currentJobAdvertisements.map((jobAdvertisement) => (
                    <Card color={colors[Math.floor(Math.random() * 12)]}
                          fluid key={jobAdvertisement.id} style={{borderRadius: 10}}>
                        <Card.Content>
                            <Card.Header>
                                <Grid>
                                    <Grid.Column width={8}>
                                        {jobAdvertisement.position.title}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign={"right"}>
                                        {user?.favoriteJobAdvertisements ?
                                            (isJobAdvInFavorites(jobAdvertisement.id) ?
                                                <Icon name={"heart"} color={"red"} onClick={() => {
                                                    handleDeleteFromFavorites(jobAdvertisement.id)
                                                }}/> :
                                                <Icon name={"heart outline"} onClick={() => {
                                                    handleAddToFavorite(jobAdvertisement.id)
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
                                        <Button compact icon labelPosition='right' onClick={() => {
                                            handleAdvertisementClick(jobAdvertisement.id);
                                        }} style={{marginTop: -7, borderRadius: 10}}><Icon name='right arrow'/>See detail</Button>
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
            </Card.Group>
        )
    }

    function itemsPerPageBar() {
        return (
            <Popup
                trigger={
                    <Menu secondary  vertical pagination style={{marginLeft: "-7em"}}>
                        <Menu.Item name='5' active={jobAdvertisementsPerPage === 5}
                                   disabled={filteredJobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(5)}>5</Menu.Item>
                        <Menu.Item name='10' active={jobAdvertisementsPerPage === 10}
                                   disabled={filteredJobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(10)}>10</Menu.Item>
                        <Menu.Item name='20' active={jobAdvertisementsPerPage === 20}
                                   disabled={filteredJobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(20)}>20</Menu.Item>
                        <Menu.Item name='50' active={jobAdvertisementsPerPage === 50}
                                   disabled={filteredJobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(50)}>50</Menu.Item>
                        <Menu.Item name='100' active={jobAdvertisementsPerPage === 100}
                                   disabled={filteredJobAdvertisements.length === 0}
                                   onClick={() => handlePagePerJobAdvMenuClick(100)}>100</Menu.Item>
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
            <Grid stackable padded>
                <Grid.Column width={5}>
                    <Grid padded>
                        <Grid.Row/>
                        <Grid.Row>
                            {user?.favoriteJobAdvertisements ?
                                <Header disabled={jobAdvertisements.length === 0}
                                        style={{marginTop: -48, marginLeft: "7em"}}>
                                    {!favoritesMode ?
                                        <Header.Content>
                                            <Button compact icon labelPosition='right' color="red" size="large"
                                                    disabled={jobAdvertisements.length === 0} onClick={setFavoriteJobAdverts}
                                                    style={{borderRadius: 10}}><Icon name='heart'/>See Favorites</Button>
                                        </Header.Content> :
                                        <Header.Content style={{marginLeft: 47}}>
                                            <Button compact icon labelPosition='right' color="violet" size="large"
                                                    disabled={jobAdvertisements.length === 0} onClick={setAllJobAdverts}
                                                    style={{borderRadius: 10}}><Icon name='arrow left'/>See All</Button>
                                        </Header.Content>}
                                </Header> : null}
                        </Grid.Row>
                        <Grid.Row style={{marginTop: 10}}>
                            {filters()}
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Grid padded>
                        <Grid.Row centered style={{marginLeft: -25}}>
                            {paginationBar("top")}
                        </Grid.Row>
                        <Grid.Row>
                            <Grid>
                                <Grid.Column width={15}>
                                    {listJobAdvertisements(currentJobAdvertisements)}
                                    {currentJobAdvertisements.length > 6 ?
                                        <Button animated="fade" fluid color={"violet"} size="large"
                                                style={{marginTop: 25, borderRadius: 10}}
                                                onClick={() => {
                                                    window.scrollTo(0, 0);
                                                }}>
                                            <Button.Content visible>Scroll To Top</Button.Content>
                                            <Button.Content hidden><Icon name='arrow up'/></Button.Content>
                                        </Button> : null}
                                    <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png'
                                           style={{opacity: 0}}/>
                                </Grid.Column>
                                <Grid.Column width={1}>
                                    {itemsPerPageBar()}
                                </Grid.Column>
                            </Grid>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
        </div>
    );
}