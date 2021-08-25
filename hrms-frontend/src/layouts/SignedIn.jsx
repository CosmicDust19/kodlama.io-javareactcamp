import {Button, Container, Dropdown, Grid, Header, Icon, Image, Menu, Modal} from "semantic-ui-react";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login, signOut} from "../store/actions/userActions";
import {Link, useHistory} from "react-router-dom";
import SignedOut from "./SignedOut";
import CandidateService from "../services/candidateService";
import EmployerService from "../services/employerService";
import SystemEmployeeService from "../services/systemEmployeeService";

export default function SignedIn() {

    const [isOpen, setIsOpen] = useState(false)
    const userProps = useSelector(state => state?.user?.userProps)
    const dispatch = useDispatch();
    const history = useHistory();

    const handleScrollToTop = () => window.scrollTo(0, 0)

    function areYouSurePopup() {
        return (
            <Modal basic onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}
                   open={isOpen} size='fullscreen' dimmer={"blurring"}>
                <Grid centered padded>
                    <Grid.Row>
                        <Header size={"large"} color={"yellow"}>
                            Are you sure you want to sign out ?
                        </Header>
                    </Grid.Row>
                </Grid>
                <Grid centered padded>
                    <Grid.Row>
                        <Modal.Actions>
                            <Button color='yellow' inverted size='large' onClick={() => {
                                dispatch(signOut())
                                history.push("/")
                                setIsOpen(false)
                                handleScrollToTop()
                            }}>
                                <Icon name='checkmark'/> Yes
                            </Button>
                            <Button basic color='red' inverted onClick={() => setIsOpen(false)} size='large'>
                                <Icon name='remove'/> No
                            </Button>
                        </Modal.Actions>
                    </Grid.Row>
                </Grid>
            </Modal>)
    }

    function candidateSignedIn() {

        return (
            <Menu size="huge" fixed="top" secondary>
                {areYouSurePopup()}
                <Container>

                    <Menu.Item name="Find Jobs" as={Link} to={"/"}>Find Jobs</Menu.Item>

                    <Menu.Item name="Employers" as={Link} to={"/employers"}
                               onClick={handleScrollToTop}>Employers</Menu.Item>

                    <Menu.Item name="sync" onClick={() => {
                        const candidateService = new CandidateService();
                        candidateService.getById(userProps.user.id).then((result) => {
                            dispatch(login(result.data.data, "candidate"))
                        });
                    }}/>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Image size="mini" circular
                                   src='https://freesvg.org/img/abstract-user-flat-1.png'/>
                            <Dropdown item simple text={userProps.user?.firstName}>
                                <Dropdown.Menu style={{
                                    marginTop: 0, marginRight: -3, borderRadius: 10,
                                    backgroundColor: "rgba(250, 250, 250, 0.1)"
                                }}>
                                    <Dropdown.Item as={Link} to={"/candidateManageCVs"} onClick={handleScrollToTop}>
                                        <Icon name="file alternate outline" color="blue"/>My CVs
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/candidateManageProfile"} onClick={handleScrollToTop}>
                                        <Icon name="address book" color="red"/>About Me
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/candidateManageAccount"} onClick={handleScrollToTop}>
                                        <Icon name="setting" color="yellow"/>Account
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item onClick={() => {
                                        setIsOpen(true)
                                    }}>
                                        <Icon name="sign out" color="purple"/>Sign Out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }

    function employerSignedIn() {
        return (
            <Menu size="huge" fixed="top" secondary>
                {areYouSurePopup()}
                <Container>

                    <Menu.Item name="Candidates" as={Link} to={"/candidates"}
                               onClick={handleScrollToTop}>Candidates</Menu.Item>

                    <Menu.Item name="Job Advertisements" as={Link} to={"/jobAdvertisements"}>Job
                        Advertisements</Menu.Item>

                    <Menu.Item name="sync" onClick={() => {
                        const employerService = new EmployerService();
                        employerService.getById(userProps.user.id).then((result) => {
                            dispatch(login(result.data.data, "employer"))
                        });
                    }}/>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Image size="mini"
                                   src={"https://www.linkpicture.com/q/pngkey.com-black-building-icon-png-3232548.png"}/>
                            <Dropdown simple item text={userProps.user?.companyName}>
                                <Dropdown.Menu
                                    style={{marginTop: 0, backgroundColor: "rgba(250,250,250, 0.3)", borderRadius: 10}}>
                                    <Dropdown.Item as={Link} to={"/employerManageAccount"} onClick={() => {
                                        handleScrollToTop()
                                    }}>
                                        <Icon name="setting" color="yellow"/>Account
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/employerJobAdverts"} onClick={handleScrollToTop}>
                                        <Icon name="file outline" color="orange"/>Adverts
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item onClick={() => {
                                        setIsOpen(true)
                                    }}><Icon name="sign out" color="purple"/>Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }

    function systemEmployeeSignedIn() {
        return (
            <Menu size="large" fixed="top" secondary>
                {areYouSurePopup()}
                <Container>
                    <Menu.Item>
                        <Dropdown item text={"Manage"} simple>
                            <Dropdown.Menu
                                style={{
                                    marginTop: 0,
                                    marginLeft: -6,
                                    backgroundColor: "rgba(250,250,250, 0.1)",
                                    borderRadius: 10
                                }}>
                                <Dropdown.Item as={Link} to={"/"}>
                                    <Icon name="file alternate" style={{color: "rgba(28,177,110,0.9)"}}/>
                                    Job Advertisements
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/employersManagement"}>
                                    <Icon name="building" style={{color: "rgba(21,96,184,0.9)"}}/>
                                    Employers
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>

                    <Menu.Item>
                        <Dropdown item text={"User Sight"} simple>
                            <Dropdown.Menu
                                style={{
                                    marginTop: 0,
                                    marginLeft: -6,
                                    backgroundColor: "rgba(250,250,250, 0.1)",
                                    borderRadius: 10
                                }}>
                                <Dropdown.Item as={Link} to={"/jobAdvertisements"}>
                                    <Icon name="file alternate" style={{color: "rgba(186,20,84,0.9)"}}/> Job
                                    Advertisements
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/users"}>
                                    <Icon name="user" style={{color: "rgba(189,167,32,0.9)"}}/> Users
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>

                    <Menu.Item name="sync" onClick={() => {
                        const systemEmployeeService = new SystemEmployeeService();
                        systemEmployeeService.getById(userProps.user.id).then((result) => {
                            dispatch(login(result.data.data, "systemEmployee"))
                        });
                    }}/>

                    <Menu.Menu position='right' style={{borderRadius: 10}}>
                        <Menu.Item>
                            <Image size="mini" circular style={{opacity: 0.8}}
                                   src="https://www.linkpicture.com/q/pngkey.com-park-icon-png-3050875.png"/>
                            <Dropdown simple item text={userProps.user?.firstName}>
                                <Dropdown.Menu
                                    style={{marginTop: 0, backgroundColor: "rgba(250,250,250, 0.1)", borderRadius: 10}}>
                                    <Dropdown.Item as={Link} to={"/systemEmployeeManageAccount"}
                                                   onClick={handleScrollToTop}>
                                        <Icon name="setting" color="yellow"/>Account
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setIsOpen(true)
                                    }}><Icon name="sign out" color="purple"/>Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }

    if (String(userProps.userType) === "candidate") return candidateSignedIn()
    else if (String(userProps.userType) === "employer") return employerSignedIn()
    else if (String(userProps.userType) === "systemEmployee") return systemEmployeeSignedIn()
    else return SignedOut()
}