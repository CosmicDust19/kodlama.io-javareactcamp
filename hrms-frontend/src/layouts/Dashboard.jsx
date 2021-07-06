import React from 'react'
import {Container} from 'semantic-ui-react'
import {Route} from "react-router-dom";
import JobAdvertisementList from "../pages/JobAdvertisementList";
import JobAdvertisementDetail from "../pages/JobAdvertisementDetail";
import JobAdvertisementAdd from "../pages/JobAdvertisementAdd";
import EmployerDetail from "../pages/EmployerDetail";
import Navi from "./Navi";
import Footer from "./Footer";
import UserList from "../pages/UserList";
import Login from "../pages/Login";
import CandidateDetail from "../pages/CandidateDetail";
import {ToastContainer} from "react-toastify";
import CandidateList from "../pages/CandidateList";
import {useSelector} from "react-redux";
import EmployerList from "../pages/EmployerList";
import {CandidateManageAccount} from "../pages/CandidateManageAccount"
import {CandidateManageCvs} from "../pages/CandidateManageCVs"
import {EmployerAccount, EmployerAdverts} from "../pages/EmployerOperations";
import {SignUpCandidate} from "../pages/SignUpCandidate";
import {SignUpEmployer} from "../pages/SignUpEmployer";
import {SignUpSystemEmployee} from "../pages/SignUpSystemEmployee";
import {CandidateManageMe} from "../pages/CandidateManageMe";
import {SystemEmployeeManageAccount} from "../pages/systemEmployeeManageAccount";

export default function Dashboard() {

    const userType = useSelector(state => state?.user?.userProps?.userType)

    function mainPage(){
        switch(userType){
            case "candidate" : return JobAdvertisementList
            case "employer" : return CandidateList
            case "systemEmployee" : return JobAdvertisementList
            default: return JobAdvertisementList
        }
    }

    return (
        <div className="dashboard">
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
                <Route exact path="/candidateManageMe" component={CandidateManageMe}/>
                <Route exact path="/employers" component={EmployerList}/>
                <Route path="/employers/:id" component={EmployerDetail}/>
                <Route exact path="/signUpEmployer" component={SignUpEmployer}/>
                <Route exact path="/employerAccount" component={EmployerAccount}/>
                <Route exact path="/employerJobAdverts" component={EmployerAdverts}/>
                <Route exact path="/jobAdvertisements" component={JobAdvertisementList}/>
                <Route path="/jobAdvertisements/:id" component={JobAdvertisementDetail}/>
                <Route path="/postJobAdvertisement" component={JobAdvertisementAdd}/>
                <Route exact path="/signUpSystemEmployee" component={SignUpSystemEmployee}/>
                <Route exact path="/systemEmployeeManageAccount" component={SystemEmployeeManageAccount}/>
            </Container>
            <Footer/>
        </div>
    )
}

