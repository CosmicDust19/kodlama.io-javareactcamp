import React, {useState, useEffect, Component} from "react";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {Card, Icon, Grid, Dropdown, Checkbox, Segment, Button, Header} from "semantic-ui-react";
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
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobAdvertisements, setJobAdvertisement] = useState([]);

    useEffect(() => {
        let jobAdvertisementService = new JobAdvertisementService();
        let cityService = new CityService();
        let positionService = new PositionService();
        let employerService = new EmployerService();

        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getEmployers().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getJobAdvertisements().then((result) => setJobAdvertisement(result.data.data));
    }, []);

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

    let history = useHistory();

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
    };

    class Filters extends Component {
        render() {
            return (
                <Segment>
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
                        <Grid.Column>
                            <Checkbox label='Remote' className={"remoteCheckBox"}/>
                            <Checkbox label='Office' className={"officeCheckBox"}/>
                        </Grid.Column>
                        <Grid.Column>
                            <Checkbox label='Part Time' className={"partTimeCheckBox"}/>
                            <Checkbox label='Full Time' className={"fullTimeCheckBox"}/>
                        </Grid.Column>
                    </Grid>
                    <Button compact={true} attached={"bottom"} basic color={"green"}>Apply</Button>
                </Segment>
            )
        }
    }

    return (
        <div>
            <Grid stackable>
                <Grid.Column width={4}>
                    <Filters/>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Card.Group>
                        {jobAdvertisements.map((jobAdvertisement) => (
                            <Card color={colors[Math.floor(Math.random() * 12)]} onClick={() => {
                                handleAdvertisementClick(jobAdvertisement.id);
                            }} fluid={true} key={jobAdvertisement.id}>
                                <Card.Content>
                                    <Card.Header>{jobAdvertisement.position.title}</Card.Header>
                                    <Card.Meta>{jobAdvertisement.employer.companyName}</Card.Meta>
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
                </Grid.Column>
            </Grid>
        </div>
    );
}