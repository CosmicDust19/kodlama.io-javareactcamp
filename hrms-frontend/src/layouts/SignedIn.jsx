import {Container, Dropdown, Icon, Image, Menu, Modal, Header, Button, Grid} from "semantic-ui-react";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "../store/actions/userActions";
import {Link} from "react-router-dom";


export default function SignedIn() {

    const [isOpen, setIsOpen] = useState(false)

    const userProps = useSelector(state => state?.user?.userProps)

    const dispatch = useDispatch();

    const handleSignOut = () => {
        setIsOpen(true)
    }

    function areYouSurePopup(){
        return(
            <Modal basic onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}
                open={isOpen} size='fullscreen' dimmer={"blurring"}>
                <Grid centered padded>
                    <Grid.Row>
                        <Header size={"large"} color={"yellow"}>
                            Are you sure you want to sign out?
                        </Header>
                    </Grid.Row>
                </Grid>
                <Grid centered padded>
                    <Grid.Row>
                        <Modal.Actions>
                            <Button color='yellow' inverted  size='large' onClick={() => {
                                dispatch(signOut())
                                setIsOpen(false)
                            }}>
                                <Icon name='checkmark' /> Yes
                            </Button>
                            <Button basic color='red' inverted onClick={() => setIsOpen(false)} size='large'>
                                <Icon name='remove' /> No
                            </Button>
                        </Modal.Actions>
                    </Grid.Row>
                </Grid>
            </Modal>)
    }

    function candidateSignedIn(){

        return (
            <Menu size="huge" fixed="top" secondary>
                {areYouSurePopup()}
                <Container>
                    <Menu.Item name="Main Page" as={Link} to={"/"}>
                        <Icon name="home" size="large" style={{margin: '5px'}}/>
                    </Menu.Item>

                    <Menu.Item name="Find Jobs" as={Link} to={"/jobAdvertisements"}>Find Jobs</Menu.Item>

                    <Menu.Item name="Users" as={Link} to={"/users"}>Users</Menu.Item>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Image size="mini" circular
                                   src='https://user-images.githubusercontent.com/74824916/122045900-edc1b800-cde6-11eb-8d51-e44fe3c3daba.png'/>
                            <Dropdown item text={userProps.user?.firstName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={"/candidateAccount"}>
                                        <Icon name="edit"/>Account
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/candidateCVs"}>
                                        <Icon name="file alternate outline"/>My CVs
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        handleSignOut()
                                    }}>
                                        <Icon name="sign out"/>Sign Out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }

    function employerSignedIn(){
        return (
            <Menu size="huge" fixed="top" secondary>
                {areYouSurePopup()}
                <Container>

                    <Menu.Item name="Main Page" as={Link} to={"/"}><Icon name="home" size="large"
                                                                         style={{margin: '5px'}}/></Menu.Item>

                    <Menu.Item name="Post Job" as={Link} to={"/postJobAdvertisement"}>Post Job</Menu.Item>

                    <Menu.Item name="Users" as={Link} to={"/users"}>Users</Menu.Item>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Image size="mini" circular
                                   src='https://user-images.githubusercontent.com/74824916/122045900-edc1b800-cde6-11eb-8d51-e44fe3c3daba.png'/>
                            <Dropdown item text={userProps.user?.companyName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={"/employerAccount"}>
                                        <Icon name="edit"/>Account
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/employerJobAdverts"}>
                                        <Icon name="file outline"/>My Adverts
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        handleSignOut()
                                    }}><Icon name="sign out"/>Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }

    function systemEmployeeSignedIn(){
        return (
            <Menu size="huge" fixed="top" secondary>
                {areYouSurePopup()}
                <Container>

                    <Menu.Item name="Main Page" as={Link} to={"/"}>
                        <Icon name="home" size="large" style={{margin: '5px'}}/>
                    </Menu.Item>

                    {String(userProps.userType) === "employer" ?
                        <Menu.Item name="Post Job" as={Link} to={"/postJobAdvertisement"}>Post Job</Menu.Item> :
                        <Menu.Item name="Find Jobs" as={Link} to={"/jobAdvertisements"}>Find Jobs</Menu.Item>}

                    <Menu.Item name="Users" as={Link} to={"/users"}>Users</Menu.Item>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Image size="mini" circular
                                   src='https://user-images.githubusercontent.com/74824916/122045900-edc1b800-cde6-11eb-8d51-e44fe3c3daba.png'/>
                            <Dropdown item text={userProps.user?.firstName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item><Icon name="info"/>Account</Dropdown.Item>
                                    <Dropdown.Item><Icon name="settings"/>Settings</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        handleSignOut()
                                    }}><Icon name="sign out"/>Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }

    if(String(userProps.userType) === "candidate") return candidateSignedIn()
    else if (String(userProps.userType) === "employer") return employerSignedIn()
    else if (String(userProps.userType) === "systemEmployee") return systemEmployeeSignedIn()
    else return ""
}