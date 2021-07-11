import {Tab} from "semantic-ui-react";
import EmployerList from "./employer/EmployerList";
import CandidateList from "./candidate/CandidateList";
import SystemEmployeeList from "./system-employee/SystemEmployeeList";

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