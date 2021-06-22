import {Tab} from "semantic-ui-react";
import React from "react";
import EmployerList from "./EmployerList";
import CandidateList from "./CandidateList";
import SystemEmployeeList from "./SystemEmployeeList";

const panes = [
    {
        menuItem: 'Employers',
        render: () =>
            <EmployerList/>
    },
    {
        menuItem: 'Candidates',
        render: () =>
            <CandidateList/>
    },
    {
        menuItem: 'System Employees',
        render: () =>
            <SystemEmployeeList/>
    },
]

const UsersTable = () => (
    <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
)

export default function UserList() {
    return (
        <UsersTable/>
    )
}