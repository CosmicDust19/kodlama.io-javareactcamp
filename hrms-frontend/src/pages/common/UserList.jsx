import {Menu, Tab} from "semantic-ui-react";
import EmployerList from "../employer/EmployerList";
import CandidateList from "../candidate/CandidateList";

const panes = [
    {menuItem: 'Employers', render: () => <EmployerList/>},
    {menuItem: 'Candidates', render: () => <CandidateList/>}
]

const UsersTable = () => (
    <Tab menu={<Menu secondary pointing style={{marginBottom: 25}}/>} panes={panes}/>
)

export default function UserList() {
    return <UsersTable/>
}