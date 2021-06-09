import React from "react";
import CandidateService from "../services/candidateService";
import {Table} from "semantic-ui-react";
import {useState, useEffect} from "react";

export default function CandidateList() {
    const [candidate, setCandidate] = useState([]);
    useEffect(() => {
        let candidateService = new CandidateService();
        candidateService
            .getCandidates()
            .then((result) => setCandidate(result.data.data));
    });

    return (
        <div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>E-mail</Table.HeaderCell>
                        <Table.HeaderCell>First Name</Table.HeaderCell>
                        <Table.HeaderCell>Last Name</Table.HeaderCell>
                        <Table.HeaderCell>Nationality Id</Table.HeaderCell>
                        <Table.HeaderCell>Birth Year</Table.HeaderCell>
                        <Table.HeaderCell>Github Account</Table.HeaderCell>
                        <Table.HeaderCell>Linkedin Account</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {candidate.map((candidate) => (
                        <Table.Row key={candidate.id}>
                            <Table.Cell>{candidate.id}</Table.Cell>
                            <Table.Cell>{candidate.email}</Table.Cell>
                            <Table.Cell>{candidate.firstName}</Table.Cell>
                            <Table.Cell>{candidate.lastName}</Table.Cell>
                            <Table.Cell>{candidate.nationalityId}</Table.Cell>
                            <Table.Cell>{candidate.birthYear}</Table.Cell>
                            <Table.Cell>{candidate.githubAccountLink}</Table.Cell>
                            <Table.Cell>{candidate.linkedinAccountLink}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}