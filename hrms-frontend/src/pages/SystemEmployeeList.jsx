import React from "react";
import SystemEmployeeService from "../services/systemEmployeeService";
import {Table, Header, Image} from "semantic-ui-react";
import {useState, useEffect} from "react";



export default function SystemEmployeeList() {

    let placeholderImageNames = ["ade", "chris", "christian", "daniel", "elliot", "helen", "jenny",
        "joe", "justen", "laura", "matt", "nan", "steve", "stevie", "veronika"]

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
                                <Image src={`https://semantic-ui.com/images/avatar/small/${placeholderImageNames[Math.floor(Math.random() * 15)]}.jpg`}
                                    rounded size='mini'/>
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