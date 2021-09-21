import {Button, Container, Dropdown, Grid, Icon, Menu} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {signOut, syncUser} from "../store/actions/userActions";
import {Link, useHistory} from "react-router-dom";
import AreYouSureModal from "../components/common/AreYouSureModal";
import Avatar from "../components/common/Avatar";
import EmployerLogo from "../components/employer/EmployerLogo";
import defSysEmplImg from "../assets/images/defSysEmplImg.png"
import {toast} from "react-toastify";
import CandidateService from "../services/candidateService";
import EmployerService from "../services/employerService";
import SystemEmployeeService from "../services/systemEmployeeService";

export default function SignedIn({toggle, verticalScreen}) {

    const dropdownStyle = {marginTop: 0, backgroundColor: "rgba(250, 250, 250, 0.9)", borderRadius: 0}
    const vertDropdownStyle = {marginTop: 0, backgroundColor: "rgba(250,250,250,1)"}

    const userProps = useSelector(state => state?.user.userProps)
    const user = userProps.user
    const lastLogin = userProps.lastLogin
    const lastSynced = userProps.lastSynced
    const userType = String(userProps.userType)
    const now = new Date().getTime()

    const dispatch = useDispatch();
    const history = useHistory();

    const [surePopupOpen, setSurePopupOpen] = useState(false)

    useEffect(() => {
        return () => setSurePopupOpen(undefined)
    }, []);

    useEffect(() => {
        if (now - lastLogin > 86400000 * 5) {
            dispatch(signOut())
            history.push("/")
            if (lastLogin) toast.warning("Your session has expired. Please login again.")
        }
    }, [dispatch, history, lastLogin, now]);

    useEffect(() => {
        if (now - lastSynced > 300000 && user) {
            const service = userType === "candidate" ? new CandidateService() :
                userType === "employer" ? new EmployerService() : userType === "systemEmployee" ? new SystemEmployeeService() : null
            service.getById(user.id).then(r => dispatch(syncUser(r.data.data, true)))
        }
    }, [dispatch, lastSynced, now, user, userType]);

    const scrollToTop = () => window.scrollTo(0, 0)

    const handleSignOut = () => {
        dispatch(signOut())
        history.push("/")
        setSurePopupOpen(false)
        scrollToTop()
    }

    const accountItem =
        <Dropdown.Item as={Link} to={"/account"} onClick={scrollToTop}>
            <Icon name="setting" color="yellow"/>Account
        </Dropdown.Item>

    const signOutItem =
        <Dropdown.Item onClick={() => setSurePopupOpen(true)}>
            <Icon name="sign out" color="purple"/>Sign Out
        </Dropdown.Item>

    return (
        <Container>
            <AreYouSureModal open={surePopupOpen} message={"Are you sure you want to sign out ?"}
                             onYes={handleSignOut} onNo={() => setSurePopupOpen(false)}/>
            {userType === "candidate" ?
                <Grid columns={"equal"} padded>
                    <Grid.Column>
                        <Menu.Item name="Find Jobs" as={Link} to={"/"}>Find Jobs</Menu.Item>
                    </Grid.Column>
                    <Grid.Column>
                        <Menu.Item name="Employers" as={Link} to={"/employers"} onClick={scrollToTop}/>
                    </Grid.Column>
                </Grid> : null}
            {userType === "employer" ?
                <Menu.Item name="Candidates" as={Link} to={"/candidates"} onClick={scrollToTop}
                           content={"Candidates"}/> : null}
            {userType === "systemEmployee" ?
                <Menu.Item as={Link} to={"/users"} content={"Users"}/> : null}

            <Menu.Menu position='right'>
                {userType === "candidate" ?
                    <Menu.Item style={{marginRight: 10, marginLeft: 10}}>
                        <Avatar image={user.profileImg} size={"mini"}/>
                        <Dropdown item simple text={user?.firstName} closeOnEscape closeOnBlur closeOnChange>
                            <Dropdown.Menu style={verticalScreen ? vertDropdownStyle : {...dropdownStyle, width: 142, marginRight: 1}}>
                                <Dropdown.Item as={Link} to={"/candidate/CVs"} onClick={scrollToTop}>
                                    <Icon name="file alternate outline" color="blue"/>My CVs
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/candidate/profile"} onClick={scrollToTop}>
                                    <Icon name="address book" color="red"/>About Me
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                {accountItem}{signOutItem}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item> : null}
                {userType === "employer" ?
                    <Menu.Item style={{marginRight: 10, marginLeft: 10}}>
                        <EmployerLogo user={user} size={"mini"} defImgSize={37}/>
                        <Dropdown simple item text={user?.companyName} closeOnEscape closeOnBlur closeOnChange>
                            <Dropdown.Menu style={verticalScreen ? vertDropdownStyle : dropdownStyle}>
                                <Dropdown.Item as={Link} to={"/employer/jobAdverts"} onClick={scrollToTop}>
                                    <Icon name="bullhorn" color="red"/>Adverts
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/employers/${user?.id}`} onClick={scrollToTop}>
                                    <Icon name="file alternate outline" color={"blue"}/>Summary
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                {accountItem}{signOutItem}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item> : null}
                {userType === "systemEmployee" ?
                    <Menu.Item style={{marginRight: 10, marginLeft: 10}}>
                        <Avatar image={user.profileImg} size={"mini"} defImgSrc={defSysEmplImg}/>
                        <Dropdown simple item text={user?.firstName} closeOnEscape closeOnBlur closeOnChange>
                            <Dropdown.Menu style={verticalScreen ? vertDropdownStyle : dropdownStyle}>
                                <Dropdown.Header content={"Manage"}/>
                                <Dropdown.Item as={Link} to={"/"} onClick={scrollToTop}>
                                    <Icon name="bullhorn" color={"blue"}/>Job Adverts
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/systemEmployee/employerMng"} onClick={scrollToTop}>
                                    <Icon name="building" color={"green"}/>Employers
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/systemEmployee/otherMng"} onClick={scrollToTop}>
                                    <Icon name="table" color={"red"}/>Other
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                {accountItem}{signOutItem}
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
