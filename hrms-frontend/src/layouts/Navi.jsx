import React, {useState} from "react";
import {Menu, Container, Icon} from "semantic-ui-react";
import {Link} from "react-router-dom";
import SignedIn from "./SignedIn"
import SignedOut from "./SignedOut"

export default function Navi() {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [isEmployer, setIsEmployer] = useState(false)

    function handleSignOut() {
        setIsAuthenticated(false)
    }

    function handleSignIn(){
        setIsAuthenticated(true)
    }

    function handleIsEmployer(isEmployer){
        setIsEmployer(isEmployer)
    }

    return (
        <div className={"navi"}>
            <Menu size="huge" fixed="top">
                <Container>

                    <Menu.Item name="Main Page" as={Link} to={"/"}><Icon name="home" size="large" style={{margin: '5px'}}/></Menu.Item>

                    {isEmployer ?
                        <Menu.Item name="Post Job" as={Link} to={"/postJobAdvertisement"}>Post Job</Menu.Item> :
                        <Menu.Item name="Find Jobs" as={Link} to={"/jobAdvertisements"}>Find Jobs</Menu.Item>}

                    <Menu.Item name="Users" as={Link} to={"/users"}>Users</Menu.Item>

                    {isAuthenticated ?
                        <SignedIn signOut = {handleSignOut} isEmployer={handleIsEmployer}/> :
                        <SignedOut login={handleSignIn} isEmployer={handleIsEmployer}/>}

                </Container>
            </Menu>
        </div>
    );
}