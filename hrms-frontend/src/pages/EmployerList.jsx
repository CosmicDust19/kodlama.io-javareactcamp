import React from "react";
import EmployerService from "../services/employerService";
import {Table} from "semantic-ui-react";
import {useState, useEffect} from "react";

export default function EmployerList() {
    const [employers, setEmployer] = useState([]);
    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getEmployers().then((result) => setEmployer(result.data.data));
    }, []);

    return (
        <div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>E-mail</Table.HeaderCell>
                        <Table.HeaderCell>Company Name</Table.HeaderCell>
                        <Table.HeaderCell>Website</Table.HeaderCell>
                        <Table.HeaderCell>Phone Number</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {employers.map((employer) => (
                        <Table.Row key={employer.id}>
                            <Table.Cell>{employer.id}</Table.Cell>
                            <Table.Cell>{employer.email}</Table.Cell>
                            <Table.Cell>{employer.companyName}</Table.Cell>
                            <Table.Cell>{employer.website}</Table.Cell>
                            <Table.Cell>{employer.phoneNumber}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}