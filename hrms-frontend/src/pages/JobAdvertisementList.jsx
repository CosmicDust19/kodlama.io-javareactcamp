import React, {useState, useEffect} from "react";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {
    Card, Icon, Grid, Dropdown, Checkbox, Segment, Button, Header,
    Pagination, Loader, Image, Menu, Popup
} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import CityService from "../services/cityService";
import PositionService from "../services/positionService";
import EmployerService from "../services/employerService";

export default function JobAdvertisementList() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    //const [sortingOpts] = useState(["Creation Date + ", "Creation Date - "]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertisementsPerPage, setJobAdvertisementsPerPage] = useState(5);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobAdvertisements, setJobAdvertisement] = useState([]);

    useEffect(() => {
        let cityService = new CityService();
        let positionService = new PositionService();
        let employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getEmployers().then((result) => setEmployers(result.data.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        let jobAdvertisementService = new JobAdvertisementService();
        jobAdvertisementService.getJobAdvertisements().then((result) => setJobAdvertisement(result.data.data));
        setLoading(false);
    }, [])

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

    const indexOfLastJobAdvertisement = currentPage * jobAdvertisementsPerPage
    const indexOfFirstJobAdvertisement = indexOfLastJobAdvertisement - jobAdvertisementsPerPage
    const currentJobAdvertisements = jobAdvertisements.slice(indexOfFirstJobAdvertisement, indexOfLastJobAdvertisement)

    let history = useHistory();

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
    };

    const handlePagePerJobAdvMenuClick = (number) => {
        setCurrentPage(1)
        setJobAdvertisementsPerPage(number)
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    function filters() {
        return (
            <Segment style={{marginTop:11}}>
                <Header dividing>
                    <Header.Content>
                        <Icon name="filter"/>
                        Filter
                    </Header.Content>
                </Header>
                <Card.Group>
                    <Card>
                        <Dropdown clearable item placeholder="Select cities" search multiple selection fluid
                                  options={cityOption}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select positions" search multiple selection fluid
                                  options={positionOption}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select employers" search multiple selection fluid
                                  options={employerOption}/>
                    </Card>
                </Card.Group>

                <Grid columns={2} padded>
                    <Grid.Row>
                        <Grid.Column textAlign="left">
                            <Checkbox label='Remote' className={"remoteCheckBox"}/>
                        </Grid.Column>
                        <Grid.Column textAlign="left">
                            <Checkbox label='Office' className={"officeCheckBox"}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign="left">
                            <Checkbox label='Part Time' className={"partTimeCheckBox"}/>
                        </Grid.Column>
                        <Grid.Column textAlign="left">
                            <Checkbox label='Full Time' className={"fullTimeCheckBox"}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Button compact={true} attached={"bottom"} basic color={"green"}>Apply</Button>
            </Segment>
        )
    }

    function listJobAdvertisements(currentJobAdvertisements) {
        if (loading) {
            return (
                <Segment>
                    <Loader active/>
                    <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png'/>
                </Segment>
            )
        }

        return (
            <Card.Group>
                {currentJobAdvertisements.map((jobAdvertisement) => (
                    <Card color={colors[Math.floor(Math.random() * 12)]} onClick={() => {
                        handleAdvertisementClick(jobAdvertisement.id);
                    }} fluid={true} key={jobAdvertisement.id}>
                        <Card.Content>
                            <Card.Header>{jobAdvertisement.position.title}</Card.Header>
                            <Card.Meta>{jobAdvertisement.employer?.companyName}</Card.Meta>
                            <Card.Description>
                                <div>
                                    <Icon name={"map marker"}/> {jobAdvertisement.city.name}
                                </div>
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

    function itemsPerPageBar(){
        return (
            <Popup
                trigger={
                    <Menu secondary stackable>
                        <Grid relaxed>
                            <Grid.Row>
                                <Menu.Item name='5' active={jobAdvertisementsPerPage === 5}
                                           onClick={() => handlePagePerJobAdvMenuClick(5)}>5</Menu.Item>
                            </Grid.Row>
                            <Grid.Row>
                                <Menu.Item name='10' active={jobAdvertisementsPerPage === 10}
                                           onClick={() => handlePagePerJobAdvMenuClick(10)}>10</Menu.Item>
                            </Grid.Row>
                            <Grid.Row>
                                <Menu.Item name='20' active={jobAdvertisementsPerPage === 20}
                                           onClick={() => handlePagePerJobAdvMenuClick(20)}>20</Menu.Item>
                            </Grid.Row>
                            <Grid.Row>
                                <Menu.Item name='50' active={jobAdvertisementsPerPage === 50}
                                           onClick={() => handlePagePerJobAdvMenuClick(50)}>50</Menu.Item>
                            </Grid.Row>
                            <Grid.Row>
                                <Menu.Item name='100' active={jobAdvertisementsPerPage === 100}
                                           onClick={() => handlePagePerJobAdvMenuClick(100)}>100</Menu.Item>
                            </Grid.Row>
                        </Grid>
                    </Menu>
                }
                content={"Items per page"}
                style={{
                    borderRadius: 15,
                    opacity: 0.9,
                    color: "rgb(18,18,18)"
                }}
                position = {"top right"}
                on={"hover"}
                mouseEnterDelay={1000}
                mouseLeaveDelay={150}
            />
        )
    }

    function paginationBar(){
        return (
            <Popup
                trigger={
                    <Pagination
                        totalPages={Math.ceil(jobAdvertisements.length / jobAdvertisementsPerPage)}
                        onPageChange={handlePaginationChange}
                        activePage={currentPage}
                        secondary
                        pointing
                        firstItem={null}
                        lastItem={null}
                    />
                }
                content={"Page number"}
                style={{
                    borderRadius: 15,
                    opacity: 0.9,
                    color: "rgb(18,18,18)"
                }}
                position = {"top center"}
                on={"hover"}
                mouseEnterDelay={1000}
                mouseLeaveDelay={150}
            />
        )
    }

    return (
        <div>
            <Grid stackable padded>
                <Grid.Column width={5} >
                    <Grid padded>
                        <Grid.Row/>
                        <Grid.Row/>
                        <Grid.Row>
                            {filters()}
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Grid padded>
                        <Grid.Row centered>
                            {paginationBar()}
                        </Grid.Row>
                        <Grid.Row>
                            <Grid>
                                <Grid.Column width={15}>
                                    {listJobAdvertisements(currentJobAdvertisements)}
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