import {Container, Segment, Transition} from 'semantic-ui-react'
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
import {CandidateCVs} from "../pages/candidate/CandidateCVs"
import {CandidateProfile} from "../pages/candidate/CandidateProfile";
import SysEmplEmployerMng from "../pages/system-employee/SysEmplEmployerMng";
import {EmployerJobAdverts} from "../pages/employer/EmployerJobAdverts";
import Account from "../pages/common/Account";
import SysEmplOtherMng from "../pages/system-employee/SysEmplOtherMng";
import {useEffect, useState} from "react";
import {SignUpCandidate} from "../pages/common/SignUpCandidate";
import {SignUpEmployer} from "../pages/common/SignUpEmployer";
import {SignUpSystemEmployee} from "../pages/common/SignUpSystemEmployee";

export default function Dashboard() {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true)
        return () => setVisible(undefined)
    }, []);

    const userType = useSelector(state => state?.user.userProps.userType)

    function mainPage() {
        switch (userType) {
            case "employer" :
                return CandidateList
            default:
                return JobAdverts
        }
    }

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    return (
        <Segment className="dashboard" vertical>
            <Navi/>
            <ToastContainer position={"bottom-left"} pauseOnFocusLoss={false} style={{width: "24em"}} closeButton={null}/>
            <Transition visible={visible}>
                <Container className="main container">
                    <Route exact path="/" component={mainPage()}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/signup/candidate" component={SignUpCandidate}/>
                    <Route path="/signup/employer" component={SignUpEmployer}/>
                    <Route path="/signup/systemEmployee" component={SignUpSystemEmployee}/>
                    <Route exact path="/jobAdverts" component={JobAdverts}/>
                    <Route path="/jobAdverts/:id" component={JobAdvertDetail}/>
                    <Route path="/users" component={UserList}/>
                    <Route exact path="/candidates" component={CandidateList}/>
                    <Route path="/candidates/:id" component={CandidateDetail}/>
                    <Route exact path="/employers" component={EmployerList}/>
                    <Route path="/employers/:id" component={EmployerDetail}/>
                    <Route path="/account" component={Account}/>
                    <Route path="/candidate/CVs" component={CandidateCVs}/>
                    <Route path="/candidate/profile" component={CandidateProfile}/>
                    <Route path="/employer/jobAdverts" component={EmployerJobAdverts}/>
                    <Route path="/systemEmployee/employerMng" component={SysEmplEmployerMng}/>
                    <Route path="/systemEmployee/otherMng" component={SysEmplOtherMng}/>
                </Container>
            </Transition>
            <Footer/>
        </Segment>
    )
}

