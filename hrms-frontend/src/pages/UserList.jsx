import {Tab} from "semantic-ui-react";
import React from "react";
import EmployerList from "./EmployerList";
import CandidateList from "./CandidateList";
import SystemEmployeeList from "./SystemEmployeeList";

const panes = [
    {
        menuItem: 'Employers',
        render: () =>
            <Tab.Pane attached={false}>
                <EmployerList/>
            </Tab.Pane>,
    },
    {
        menuItem: 'Candidates',
        render: () =>
            <Tab.Pane attached={false}>
                <CandidateList/>
            </Tab.Pane>,
    },
    {
        menuItem: 'System Employees',
        render: () =>
            <Tab.Pane attached={false}>
                <SystemEmployeeList/>
            </Tab.Pane>,
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