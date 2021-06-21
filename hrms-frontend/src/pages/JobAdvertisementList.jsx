import React, {useState, useEffect, Component} from "react";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {
    Card,
    CardGroup,
    Icon,
    CardDescription,
    Grid,
    GridColumn,
    Dropdown,
    Checkbox, Segment, Button
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

    const [jobAdvertisements, setJobAdvertisement] = useState([]);
    useEffect(() => {
        let jobAdvertisementService = new JobAdvertisementService();
        jobAdvertisementService.getJobAdvertisements().then((result) => setJobAdvertisement(result.data.data));
    }, []);

    let history = useHistory();

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
    };

    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);

    useEffect(() => {
        let cityService = new CityService();
        let positionService = new PositionService();
        let employerService = new EmployerService();

        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getEmployers().then((result) => setEmployers(result.data.data));
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

    class Filters extends Component {
        render() {
            return (
                <Segment>
                    <Card>
                        <Dropdown clearable item placeholder="Select cities" search multiple selection fluid={true}
                                  options={cityOption}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select positions" search multiple selection fluid={true}
                                  options={positionOption}/>
                    </Card>
                    <Card>
                        <Dropdown clearable item placeholder="Select employers" search multiple selection fluid={true}
                                  options={employerOption}/>
                    </Card>

                    <Checkbox label='Remote' className={"remoteCheckBox"}/>
                    <Checkbox label='Office' className={"officeCheckBox"}/>
                    <Checkbox label='Part Time' className={"partTimeCheckBox"}/>
                    <Checkbox label='Full Time' className={"fullTimeCheckBox"}/>
                    <Button className={"jobAdvertisementFilterButton"} compact={true}
                             attached={"bottom"} basic color={"green"}>Apply</Button>
                </Segment>
            )
        }
    }

    return (
        <div>
            <Grid>
                <GridColumn width={4}>
                    <Filters/>
                </GridColumn>
                <GridColumn width={12}>
                    <CardGroup>
                        {jobAdvertisements.map((jobAdvertisement) => (
                            <Card color={colors[Math.floor(Math.random() * 12)]} onClick={() => {
                                handleAdvertisementClick(jobAdvertisement.id);
                            }} fluid={true}>
                                <Card.Content>
                                    <Card.Header>{jobAdvertisement.position.title}</Card.Header>
                                    <Card.Meta>{jobAdvertisement.employer.companyName}</Card.Meta>
                                    <CardDescription>
                                        <div>
                                            <Icon name={"map marker"}/> {jobAdvertisement.city.name}
                                        </div>
                                    </CardDescription>
                                </Card.Content>
                                <Card.Content>
                                    <Card.Description>
                                        <Grid>
                                            <GridColumn width={8}>
                                                {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel}
                                            </GridColumn>
                                            <GridColumn width={8} textAlign={"right"}>Created at
                                                {" " + new Date(jobAdvertisement.createdAt).getDate() + " " +
                                                months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                                                new Date(jobAdvertisement.createdAt).getFullYear()}
                                            </GridColumn>
                                        </Grid>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </CardGroup>
                </GridColumn>
            </Grid>
        </div>
    );
}