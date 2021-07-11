import React from "react";
import EmployerService from "../../services/employerService";
import {Icon, Table, Card, Header, Loader} from "semantic-ui-react";
import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

export default function EmployerList() {

    const [employers, setEmployers] = useState([]);

    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getEmployers().then((result) => setEmployers(result.data.data));
    }, []);

    let history = useHistory();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
        window.scrollTo(0,0);
    };

    if (employers.length === 0){
        return <Loader active inline='centered' size={"large"}/>
    }

    return (
        <div>
            <Card.Group itemsPerRow={2} stackable>
                {employers.map((employer) => (
                    <Card key={employer.id} onClick={() => {
                        handleEmployerDetailClick(employer.id)
                    }}>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <Header>
                                                {employer.companyName}
                                            </Header>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell textAlign={"right"}>
                                        </Table.HeaderCell>
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

                    </Card>
                ))}
            </Card.Group>
        </div>
    );
}