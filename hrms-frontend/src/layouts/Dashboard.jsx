import {Container} from 'semantic-ui-react'
import {Route} from "react-router-dom";
import JobAdverts from "../pages/common/JobAdverts";
import JobAdvertDetail from "../pages/common/JobAdvertDetail";
import EmployerDetail from "../pages/employer/EmployerDetail";
import Navi from "./Navi";
import Footer from "./Footer";
import UserList from "../pages/common/UserList";
import Login from "../pages/common/Login";
import CandidateDetail from "../pages/candidate/CandidateDetail";
import {ToastContainer} from "react-toastify";
import CandidateList from "../pages/candidate/CandidateList";
import {useSelector} from "react-redux";
import EmployerList from "../pages/employer/EmployerList";
import {CandidateAccount} from "../pages/candidate/CandidateAccount"
import {CandidateCVs} from "../pages/candidate/CandidateCVs"
import {CandidateProfile} from "../pages/candidate/CandidateProfile";
import {SystemEmployeeAccount} from "../pages/system-employee/SystemEmployeeAccount";
import JobAdvertMng from "../pages/system-employee/JobAdvertMng";
import EmployerMng from "../pages/system-employee/EmployerMng";
import {EmployerAccount} from "../pages/employer/EmployerAccount";
import {EmployerJobAdverts} from "../pages/employer/EmployerJobAdverts";
import {SignUp} from "../pages/common/SignUp";

export default function Dashboard() {

    const userType = useSelector(state => state?.user.userProps.userType)

    function mainPage() {
        switch (userType) {
            case "candidate" :      return JobAdverts
            case "employer" :       return CandidateList
            case "systemEmployee" : return JobAdvertMng
            default:                return JobAdverts
        }
    }

    return (
        <div className="dashboard">
            <Navi/>
            <ToastContainer position={"bottom-left"} pauseOnFocusLoss={false} style={{marginBottom: 10, width: "24em"}} closeButton={null}/>
            <Container className="main container">
                <Route exact path="/" component={mainPage()}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup/:userType" component={SignUp}/>
                <Route exact path="/jobAdverts" component={JobAdverts}/>
                <Route path="/jobAdverts/:id" component={JobAdvertDetail}/>
                <Route path="/users" component={UserList}/>
                <Route exact path="/candidates" component={CandidateList}/>
                <Route path="/candidates/:id" component={CandidateDetail}/>
                <Route exact path="/employers" component={EmployerList}/>
                <Route path="/employers/:id" component={EmployerDetail}/>
                <Route path="/candidate/account" component={CandidateAccount}/>
                <Route path="/candidate/CVs" component={CandidateCVs}/>
                <Route path="/candidate/profile" component={CandidateProfile}/>
                <Route path="/employer/account" component={EmployerAccount}/>
                <Route path="/employer/jobAdverts" component={EmployerJobAdverts}/>
                <Route path="/systemEmployee/account" component={SystemEmployeeAccount}/>
                <Route path="/systemEmployee/employerManagement" component={EmployerMng}/>
            </Container>
            <Footer/>
        </div>
    )
}

