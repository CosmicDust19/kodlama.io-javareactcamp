import React from "react";
import SystemEmployeeService from "../services/systemEmployeeService";
import {Table, Header, Image} from "semantic-ui-react";
import {useState, useEffect} from "react";

let placeholderImageUrls = ['https://semantic-ui.com/images/avatar/small/ade.jpg',
    'https://semantic-ui.com/images/avatar/small/chris.jpg', 'https://semantic-ui.com/images/avatar/small/christian.jpg',
    'https://semantic-ui.com/images/avatar/small/daniel.jpg', 'https://semantic-ui.com/images/avatar/small/elliot.jpg',
    'https://semantic-ui.com/images/avatar/small/helen.jpg', 'https://semantic-ui.com/images/avatar/small/jenny.jpg']


export default function SystemEmployeeList() {
    const [systemEmployees, setSystemEmployee] = useState([]);
    useEffect(() => {
        let systemEmployeeService = new SystemEmployeeService();
        systemEmployeeService.getSystemEmployees().then((result) => setSystemEmployee(result.data.data));
    }, []);

    return (
        <Table basic='very' celled collapsing>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Employee</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {systemEmployees.map((systemEmployee) => (
                    <Table.Row key={systemEmployee.id}>
                        <Table.Cell>
                            <Header as='h4' image>
                                <Image src={placeholderImageUrls[Math.floor(Math.random() * 7)]} rounded size='mini'/>
                                <Header.Content>{systemEmployee.firstName}
                                    <Header.Subheader>{systemEmployee.lastName}</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{systemEmployee.email}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}