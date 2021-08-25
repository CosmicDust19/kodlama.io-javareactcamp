import React from 'react'
import {Container, Segment} from 'semantic-ui-react'
import {Route} from "react-router-dom";
import JobAdvertisementsList from "../pages/JobAdvertisementsList";
import JobAdvertisementDetail from "../pages/JobAdvertisementDetail";
import EmployerDetail from "../pages/employer/EmployerDetail";
import Navi from "./Navi";
import Footer from "./Footer";
import UserList from "../pages/UserList";
import Login from "../pages/Login";
import CandidateDetail from "../pages/candidate/CandidateDetail";
import {ToastContainer} from "react-toastify";
import CandidateList from "../pages/candidate/CandidateList";
import {useSelector} from "react-redux";
import EmployerList from "../pages/employer/EmployerList";
import {CandidateManageAccount} from "../pages/candidate/CandidateManageAccount"
import {CandidateManageCvs} from "../pages/candidate/CandidateManageCVs"
import {SignUpCandidate} from "../pages/SignUpCandidate";
import {SignUpEmployer} from "../pages/SignUpEmployer";
import {SignUpSystemEmployee} from "../pages/SignUpSystemEmployee";
import {CandidateManageProfile} from "../pages/candidate/CandidateManageProfile";
import {SystemEmployeeManageAccount} from "../pages/system-employee/SystemEmployeeManageAccount";
import JobAdvertisementsManagement from "../pages/system-employee/JobAdvertisementsManagement";
import EmployersManagement from "../pages/system-employee/EmployersManagement";
import {EmployerManageAccount} from "../pages/employer/EmployerManageAccount";
import {EmployerAdverts} from "../pages/employer/EmployerAdverts";

export default function Dashboard() {

    const userType = useSelector(state => state?.user.userProps.userType)

    function mainPage(){
        switch(userType){
            case "candidate" : return JobAdvertisementsList
            case "employer" : return CandidateList
            case "systemEmployee" : return JobAdvertisementsManagement
            default: return JobAdvertisementsList
        }
    }

    return (
        <div className="dashboard">
            <Segment style = {{borderRadius: 0, backgroundColor: "rgb(255,255,255)"}}>
                <Navi/>
                <ToastContainer position = {"bottom-right"}/>
                <Container className="main container">
                    <Route exact path="/" component={mainPage()}/>
                    <Route path="/users" component={UserList}/>
                    <Route path="/login" component={Login}/>
                    <Route exact path="/candidates" component={CandidateList}/>
                    <Route exact path="/candidates/:id" component={CandidateDetail}/>
                    <Route exact path="/signUpCandidate" component={SignUpCandidate}/>
                    <Route exact path="/candidateManageAccount" component={CandidateManageAccount}/>
                    <Route exact path="/candidateManageCVs" component={CandidateManageCvs}/>
                    <Route exact path="/candidateManageProfile" component={CandidateManageProfile}/>
                    <Route exact path="/employers" component={EmployerList}/>
                    <Route path="/employers/:id" component={EmployerDetail}/>
                    <Route exact path="/signUpEmployer" component={SignUpEmployer}/>
                    <Route exact path="/employerManageAccount" component={EmployerManageAccount}/>
                    <Route exact path="/employerJobAdverts" component={EmployerAdverts}/>
                    <Route exact path="/employersManagement" component={EmployersManagement}/>
                    <Route exact path="/jobAdvertisements" component={JobAdvertisementsList}/>
                    <Route path="/jobAdvertisements/:id" component={JobAdvertisementDetail}/>
                    <Route exact path="/signUpSystemEmployee" component={SignUpSystemEmployee}/>
                    <Route exact path="/systemEmployeeManageAccount" component={SystemEmployeeManageAccount}/>
                </Container>
                <Footer/>
            </Segment>
        </div>
    )
}

