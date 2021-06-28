import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {Button, Card, Grid, Icon, Table, Header} from "semantic-ui-react";

const colors = ['red', 'orange', 'yellow', 'olive', 'green',
    'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

let color = colors[Math.floor(Math.random() * 12)]

const months = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December"]

export default function JobAdvertisementDetail() {

    let {id} = useParams()

    let history = useHistory();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
    };

    const [jobAdvertisement, setJobAdvertisement] = useState({});

    useEffect(() => {
        let jobAdvertisementService = new JobAdvertisementService();
        jobAdvertisementService.getById(id).then((result) => setJobAdvertisement(result.data.data));
    }, [id]);

    function salaryInfo() {
        if (!jobAdvertisement.minSalary && !jobAdvertisement.maxSalary) {
            return null
        } else if (!jobAdvertisement.maxSalary) {
            return `more than ${jobAdvertisement.minSalary}`
        } else if (!jobAdvertisement.minSalary) {
            return `less than ${jobAdvertisement.maxSalary}`
        }
        return `between ${jobAdvertisement.minSalary} ~ ${jobAdvertisement.maxSalary}`;
    }

    let remainedDays = Math.round((new Date(jobAdvertisement.applicationDeadline).getTime() - new Date().getTime()) / 86400000)

    return (
        <div>
            <Card color={color} fluid>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            <Card.Header>
                                <Header>{jobAdvertisement.position?.title}</Header>
                            </Card.Header>
                            <Card.Meta>{jobAdvertisement.employer?.companyName}</Card.Meta>
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={"right"}>
                            <Button color={color}>Apply</Button>
                        </Grid.Column>
                    </Grid>
                    <Card.Description>
                        <Icon name={"map marker"}/> {jobAdvertisement.city?.name}
                    </Card.Description>
                </Card.Content>

                <Card.Content>
                    <Card.Description>
                        {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel}
                    </Card.Description>
                </Card.Content>

                {salaryInfo() ?
                    <Card.Content>
                        Salary | {salaryInfo()}
                    </Card.Content> : null}

                <Card.Content>Application deadline
                    | {" " + new Date(jobAdvertisement.applicationDeadline).getDate() + " " +
                    months[new Date(jobAdvertisement.applicationDeadline).getMonth()] + " " +
                    new Date(jobAdvertisement.applicationDeadline).getFullYear()} | Remained {remainedDays} {(remainedDays>1)? "days" : "day"}
                </Card.Content>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            Number of candidates to be hired |{" " + jobAdvertisement.numberOfPeopleToBeHired}
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={"right"}>Created at
                            {" " + new Date(jobAdvertisement.createdAt).getDate() + " " +
                            months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                            new Date(jobAdvertisement.createdAt).getFullYear()}
                        </Grid.Column>
                    </Grid>
                </Card.Content>

            </Card>

            <Grid stackable>
                <Grid.Column width={10}>
                    <Card fluid color={color}>

                        <Card.Content>
                            <Card.Header>
                                Job Description
                            </Card.Header>
                        </Card.Content>

                        <Card.Content>
                            {jobAdvertisement.jobDescription}
                        </Card.Content>

                    </Card>
                </Grid.Column>

                <Grid.Column width={6}>
                    <Table compact celled>

                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    {jobAdvertisement.employer?.companyName}
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign={"right"}>
                                    <Button basic color={color} onClick={() => {
                                        handleEmployerDetailClick(jobAdvertisement.employer?.id)
                                    }}>Company Detail</Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>

                            <Table.Row>
                                <Table.Cell> <Icon name={"envelope"}/> E-mail</Table.Cell>
                                <Table.Cell>{jobAdvertisement.employer?.email}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell> <Icon name={"phone"}/> Phone</Table.Cell>
                                <Table.Cell>{jobAdvertisement.employer?.phoneNumber}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell> <Icon name={"world"}/> Website</Table.Cell>
                                <Table.Cell>
                                    <a href={"https://" + jobAdvertisement.employer?.website}>{"https://" + jobAdvertisement.employer?.website}</a>
                                </Table.Cell>
                            </Table.Row>

                        </Table.Body>

                    </Table>
                </Grid.Column>
            </Grid>
        </div>
    );
}