import {Button, Container, Dropdown, Grid, Icon, Menu} from "semantic-ui-react";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "../store/actions/userActions";
import {Link, useHistory} from "react-router-dom";
import AreYouSureModal from "../components/common/AreYouSureModal";
import UserAvatar from "../components/common/UserAvatar";

export default function SignedIn({toggle, verticalScreen}) {

    const dropdownStyle = {marginTop: 0, backgroundColor: "rgba(250, 250, 250, 0.85)", borderRadius: 0}
    const vertDropdownStyle = {marginTop: 0, backgroundColor: "rgba(250,250,250,1)"}

    const userProps = useSelector(state => state?.user.userProps)
    const dispatch = useDispatch();
    const history = useHistory();

    const [surePopupOpen, setSurePopupOpen] = useState(false)

    const scrollToTop = () => window.scrollTo(0, 0)

    const surePopupYesAct = () => {
        dispatch(signOut())
        history.push("/")
        setSurePopupOpen(false)
        scrollToTop()
    }

    return (
        <Container>
            <AreYouSureModal open={surePopupOpen} message={"Are you sure you want to sign out ?"}
                             onYes={surePopupYesAct} onNo={() => setSurePopupOpen(false)}/>
            {String(userProps.userType) === "candidate" ?
                <Grid columns={"equal"} padded>
                    <Grid.Column>
                        <Menu.Item name="Find Jobs" as={Link} to={"/"}>Find Jobs</Menu.Item>
                    </Grid.Column>
                    <Grid.Column>
                        <Menu.Item name="Employers" as={Link} to={"/employers"} onClick={scrollToTop}/>
                    </Grid.Column>
                </Grid> : null}
            {String(userProps.userType) === "employer" ?
                <Menu.Item name="Candidates" as={Link} to={"/candidates"} onClick={scrollToTop}
                           content={"Candidates"}/> : null}
            {String(userProps.userType) === "systemEmployee" ?
                <Grid columns={"equal"} padded>
                    <Grid.Column>
                        <Menu.Item as={Link} to={"/jobAdverts"} content={"Jobs"}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Menu.Item as={Link} to={"/users"} content={"Users"}/>
                    </Grid.Column>
                </Grid> : null}

            <Menu.Menu position='right'>
                {String(userProps.userType) === "candidate" ?
                    <Menu.Item style={{marginRight: 10, marginLeft: 10}}>
                        <UserAvatar user={userProps.user} size={"mini"}/>
                        <Dropdown item simple text={userProps.user?.firstName} closeOnEscape closeOnBlur closeOnChange>
                            <Dropdown.Menu style={verticalScreen ? vertDropdownStyle : {...dropdownStyle, width: 142, marginRight: 1}}>
                                <Dropdown.Item as={Link} to={"/candidate/CVs"} onClick={scrollToTop}>
                                    <Icon name="file alternate outline" color="blue"/>My CVs
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/candidate/profile"} onClick={scrollToTop}>
                                    <Icon name="address book" color="red"/>About Me
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item as={Link} to={"/candidate/account"} onClick={scrollToTop}>
                                    <Icon name="setting" color="yellow"/>Account
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSurePopupOpen(true)}>
                                    <Icon name="sign out" color="purple"/>Sign Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item> : null}
                {String(userProps.userType) === "employer" ?
                    <Menu.Item style={{marginRight: 10, marginLeft: 10}}>
                        <UserAvatar user={userProps.user} size={"mini"}/>
                        <Dropdown simple item text={userProps.user?.companyName} closeOnEscape closeOnBlur closeOnChange>
                            <Dropdown.Menu style={verticalScreen ? vertDropdownStyle : dropdownStyle}>
                                <Dropdown.Item as={Link} to={"/employer/jobAdverts"} onClick={scrollToTop}>
                                    <Icon name="file outline" color="orange"/>Adverts
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/employers/${userProps.user?.id}`} onClick={scrollToTop}>
                                    <Icon name="building outline" color={"blue"}/>Summary
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item as={Link} to={"/employer/account"} onClick={scrollToTop}>
                                    <Icon name="setting" color="yellow"/>Account
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSurePopupOpen(true)}>
                                    <Icon name="sign out" color="purple"/>Sign Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item> : null}
                {String(userProps.userType) === "systemEmployee" ?
                    <Menu.Item style={{marginRight: 10, marginLeft: 10}}>
                        <UserAvatar user={userProps.user} size={"mini"}/>
                        <Dropdown simple item text={userProps.user?.firstName} closeOnEscape closeOnBlur closeOnChange>
                            <Dropdown.Menu style={verticalScreen ? vertDropdownStyle : dropdownStyle}>
                                <Dropdown.Header content={"Manage"}/>
                                <Dropdown.Item as={Link} to={"/"} onClick={scrollToTop}>
                                    <Icon name="file alternate" style={{color: "rgba(28,177,110,0.9)"}}/>Job Advertisements
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/systemEmployee/employerManagement"} onClick={scrollToTop}>
                                    <Icon name="building" style={{color: "rgba(21,96,184,0.9)"}}/>Employers
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item as={Link} to={"/systemEmployee/account"} onClick={scrollToTop}>
                                    <Icon name="setting" color="yellow"/>Account
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSurePopupOpen(true)}>
                                    <Icon name="sign out" color="purple"/>Sign Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item> : null}

                <Menu.Item style={{marginRight: -40, marginLeft: -40, maxWidth: 75}}>
                    <Button size="small" onClick={toggle} fluid circular icon={<Icon name='x' color={"black"}/>}
                            inverted color={"grey"}/>
                </Menu.Item>
            </Menu.Menu>

        </Container>
    )
}
