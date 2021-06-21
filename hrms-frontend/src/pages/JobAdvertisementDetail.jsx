import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {Button, Card, CardContent, CardDescription, Grid, GridColumn, Icon, Table, TableBody} from "semantic-ui-react";

export default function JobAdvertisementDetail() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    let {id} = useParams()

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


    function findRemainedDays(){
        let now = new Date()
        let deadline = new Date(jobAdvertisement.applicationDeadline)
        let remainedDays = now.getDate() - deadline.getDate()
        return remainedDays.toString()
    }

    let history = useHistory();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
    };

    let color = colors[Math.floor(Math.random() * 12)]

    return (
        <div>
            <Card color={color} fluid>

                <Card.Content>
                    <Grid>
                        <GridColumn width={8}>
                            <Card.Header>{jobAdvertisement.position?.title}</Card.Header>
                            <Card.Meta>{jobAdvertisement.employer?.companyName}</Card.Meta>
                        </GridColumn>
                        <GridColumn width={8} textAlign={"right"}>
                            <Button color={color}>Apply</Button>
                        </GridColumn>
                    </Grid>
                    <CardDescription>
                        <Icon name={"map marker"}/> {jobAdvertisement.city?.name}
                    </CardDescription>
                </Card.Content>

                <Card.Content>
                    <Card.Description>
                        {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel}
                    </Card.Description>
                </Card.Content>

                {salaryInfo() ?
                    <CardContent>
                        Salary | {salaryInfo()}
                    </CardContent> : null}

                <CardContent>Application deadline
                    | {" " + new Date(jobAdvertisement.applicationDeadline).getDate() + " " +
                    months[new Date(jobAdvertisement.applicationDeadline).getMonth()] + " " +
                    new Date(jobAdvertisement.applicationDeadline).getFullYear()} | Remained {findRemainedDays} days
                </CardContent>

                <Card.Content>
                    <Grid>
                        <GridColumn width={8}>
                            Number of candidates to be hired |{" " + jobAdvertisement.numberOfPeopleToBeHired}
                        </GridColumn>
                        <GridColumn width={8} textAlign={"right"}>Created at
                            {" " + new Date(jobAdvertisement.createdAt).getDate() + " " +
                            months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                            new Date(jobAdvertisement.createdAt).getFullYear()}
                        </GridColumn>
                    </Grid>
                </Card.Content>

            </Card>

            <Grid>
                <GridColumn width={10}>
                    <Card fluid color={color}>

                        <CardContent>
                            <Card.Header>
                                Job Description
                            </Card.Header>
                        </CardContent>

                        <CardContent>
                            {jobAdvertisement.jobDescription}
                        </CardContent>

                    </Card>
                </GridColumn>

                <GridColumn width={6}>
                    <Table compact celled>

                        <Table.Header>
                            <Table.HeaderCell textAlign={"right"} width={1}>
                                {jobAdvertisement.employer?.companyName}
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={"right"}>
                                <Button basic color={color} onClick={() => {
                                    handleEmployerDetailClick(jobAdvertisement.employer?.id)
                                }}>Company Detail</Button>
                            </Table.HeaderCell>
                        </Table.Header>

                        <TableBody>

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

                        </TableBody>
                    </Table>
                </GridColumn>
            </Grid>
        </div>
    );
}