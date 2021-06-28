import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import EmployerService from "../services/employerService";
import {Card, Grid, Icon, Table, Header} from "semantic-ui-react";

export default function EmployerDetail() {

    let {id} = useParams()

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    const [employer, setEmployer] = useState({});

    let history = useHistory();

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
    };

    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getById(id).then((result) => setEmployer(result.data.data));
    }, [id]);

    return (
        <div>
            <Table celled size={"large"}>

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign={"right"} width={1}>
                            <Header>
                                {employer.companyName}
                            </Header>
                        </Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>

                <Table.Body>

                    <Table.Row>
                        <Table.Cell> <Icon name={"envelope"}/> E-mail</Table.Cell>
                        <Table.Cell>{employer.email}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell> <Icon name={"phone"}/> Phone</Table.Cell>
                        <Table.Cell>{employer.phoneNumber}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell> <Icon name={"world"}/> Website</Table.Cell>
                        <Table.Cell>
                            <a href={"https://" + employer.website}>{"https://" + employer.website}</a>
                        </Table.Cell>
                    </Table.Row>

                </Table.Body>
            </Table>

            <Card.Group itemsPerRow={2} stackable>
                {employer.jobAdvertisements?.map((jobAdvertisement) => (
                    <Card color={colors[Math.floor(Math.random() * 12)]}
                          onClick={() => {
                              handleAdvertisementClick(jobAdvertisement.id);
                          }}
                          key={jobAdvertisement.id}>

                        <Card.Content>
                            <Card.Header>{jobAdvertisement.position.title}</Card.Header>
                            <Card.Meta>{employer.companyName}</Card.Meta>
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
                                    <Grid.Column width={8} textAlign={"right"}>
                                        {new Date(jobAdvertisement.createdAt).getDate() + " " +
                                        months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                                        new Date(jobAdvertisement.createdAt).getFullYear()}
                                    </Grid.Column>
                                </Grid>
                            </Card.Description>
                        </Card.Content>

                    </Card>
                ))}
            </Card.Group>
        </div>
    )
}