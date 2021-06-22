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
import SignUp from "../pages/SignUp";
import CandidateDetail from "../pages/CandidateDetail";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <Navi/>
            <Container className="main container">
                <Route exact path="/" component={JobAdvertisementList}/>
                <Route exact path="/jobAdvertisements" component={JobAdvertisementList}/>
                <Route exact path="/jobAdvertisements/:id" component={JobAdvertisementDetail}/>
                <Route exact path="/postJobAdvertisement" component={JobAdvertisementAdd}/>
                <Route exact path="/employers/:id" component={EmployerDetail}/>
                <Route exact path="/candidates/:id" component={CandidateDetail}/>
                <Route exact path="/users" component={UserList}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/signUp" component={SignUp}/>
            </Container>
            <Footer/>
        </div>
    )
}

