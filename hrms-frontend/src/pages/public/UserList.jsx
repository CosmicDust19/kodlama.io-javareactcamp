import {Menu, Tab} from "semantic-ui-react";
import EmployerList from "./EmployerList";
import CandidateList from "./CandidateList";

const panes = [
    {menuItem: 'Employers', render: () => <EmployerList/>},
    {menuItem: 'Candidates', render: () => <CandidateList/>}
]

const UsersTable = () => (
    <Tab menu={<Menu secondary pointing style={{marginBottom: 25}}/>} panes={panes}/>
)

export default function UserList() {
    return (
        <UsersTable/>
    )
}