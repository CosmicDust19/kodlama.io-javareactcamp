import React from "react";
import EmployerService from "../services/employerService";
import {Button, Icon, Table, Card, Header} from "semantic-ui-react";
import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

export default function EmployerList() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const [employers, setEmployer] = useState([]);

    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getEmployers().then((result) => setEmployer(result.data.data));
    }, []);

    let history = useHistory();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
    };

    return (
        <div>
            <Card.Group itemsPerRow={2} stackable>
                {employers.map((employer) => (
                    <Card color={colors[Math.floor(Math.random() * 12)]} key={employer.id}>
                            <Table celled >
                                <Table.Header>
                                    <Table.HeaderCell>
                                        <Header>
                                            {employer.companyName}
                                        </Header>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell textAlign={"right"}>
                                        <Button basic color={"red"} onClick={() => {
                                            handleEmployerDetailClick(employer.id)
                                        }}>Company Detail</Button>
                                    </Table.HeaderCell>
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

                    </Card>
                ))}
            </Card.Group>
        </div>
    );
}