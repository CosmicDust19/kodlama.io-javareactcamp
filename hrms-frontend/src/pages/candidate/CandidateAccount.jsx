import {Button, Grid, Header, Icon, Input, Item, Menu, Modal, Segment,} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import CandidateService from "../../services/candidateService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, signOut, syncUser} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";
import {handleCatch} from "../../utilities/Utils";

export function CandidateAccount() {

    const userService = new UserService()
    const candidateService = new CandidateService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)
    const history = useHistory()

    const [candidate, setCandidate] = useState(user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('email')

    useEffect(() => {
        setCandidate(user)
    }, [user])

    const formik = useFormik({
        initialValues: {
            email: "", password: "",
            passwordRepeat: "", currentPassword: "",
            githubAccountLink: "", linkedinAccountLink: ""
        }
    });

    const handleItemClick = (activeItem) => setActiveItem(activeItem)

    const age = new Date().getFullYear() - candidate?.birthYear

    const authenticate = (data) => {
        if (data === true) {
            setIsAuthenticated(true)
            toast("Authentication Successful")
        }
        else toast.warning("Wrong password");
    }

    const lastUpdAct = (response, msg, fieldName, fieldValue) => {
        dispatch(syncUser(response.data.data));
        formik.setFieldValue(fieldName, fieldValue);
        setCandidate(response.data.data);
        toast(msg);
    }

    const handleEmailSubmit = () => {
        userService.updateEmail(candidate.id, formik.values.email)
            .then(r => {
                dispatch(changeEmail(r.data.data.email))
                formik.setFieldValue("email", r.data.data.email)
                setCandidate({...candidate, email: r.data.data.email})
                toast("Saved")
            })
            .catch(handleCatch)
    }

    const handleCurrentPasswordSubmit = () => {
        userService.existsByEmailAndPW(candidate.email, formik.values.currentPassword)
            .then(r => authenticate(r.data.data))
            .catch(handleCatch)
    }

    const handlePasswordSubmit = () => {
        userService.updatePassword(candidate.id, formik.values.password, formik.values.currentPassword)
            .then(r => {
                toast("Saved")
                formik.values.currentPassword = r.data.data.password
                formik.setFieldValue("currentPassword", r.data.data.password)
            })
            .catch(handleCatch)
    }

    const handleGithubLinkSubmit = () => {
        candidateService.updateGithubAccount(candidate.id, formik.values.githubAccountLink)
            .then(r => lastUpdAct(r, "Saved", "githubAccountLink", r.data.data.githubAccount))
            .catch(handleCatch)
    }

    const handleLinkedinLinkSubmit = () => {
        candidateService.updateLinkedinAccount(candidate.id, formik.values.linkedinAccountLink)
            .then(r => lastUpdAct(r, "Saved", "linkedinAccountLink", r.data.data.linkedinAccount))
            .catch(handleCatch)
    }

    const handleGithubLinkRemove = () => {
        candidateService.updateGithubAccount(candidate.id, undefined)
            .then(r => lastUpdAct(r, "Removed", "githubAccountLink", ""))
            .catch(handleCatch)
    }

    const handleLinkedinLinkRemove = () => {
        candidateService.updateLinkedinAccount(candidate.id, undefined)
            .then(r => lastUpdAct(r, "Removed", "linkedinAccountLink", ""))
            .catch(handleCatch)
    }

    const handleDeleteClick = () => setDeletePopupOpen(true)

    const deleteAccount = () => {
        userService.deleteById(candidate.id)
            .then(() => {
                dispatch(signOut())
                history.push("/")
                toast("Good Bye 👋")
            })
            .catch(handleCatch)
            .finally(() => setDeletePopupOpen(false))
    }

    function deleteAccountPopup() {
        return (
            <Modal basic onClose={() => setDeletePopupOpen(false)} onOpen={() => setDeletePopupOpen(true)}
                   open={deletePopupOpen} size='small'>
                <Header size={"large"} color={"yellow"}>
                    Are you sure you want to delete your account permanently ?
                </Header>
                <Modal.Actions>
                    <Button color='red' inverted size='large' onClick={deleteAccount}>
                        <Icon name='checkmark'/> Yes
                    </Button>
                    <Button basic color='grey' inverted onClick={() => setDeletePopupOpen(false)} size='large'>
                        <Icon name='remove'/> No
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

    function menuSegments() {
        switch (activeItem) {
            case "email":
                return (
                    <Segment basic>
                        <div>
                            <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                                   value={formik.values.email} onBlur={formik.handleBlur} name="email"
                                   onChange={formik.handleChange}
                            />
                        </div>
                        <Button color="blue" onClick={handleEmailSubmit} content={"Save"} style={{marginTop: 10, marginBottom: 10}}/>
                    </Segment>
                )
            case "password":
                return (
                    isAuthenticated ?
                        <Segment basic>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="New Password"
                                       type="password" value={formik.values.password}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="password"/>
                            </div>
                            <div style={{marginTop: 10, marginBottom: 10}}>
                                <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                       type="password" value={formik.values.passwordRepeat}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="passwordRepeat"/>
                            </div>
                            <Button color="blue"
                                    onClick={handlePasswordSubmit} content={"Save"}>
                            </Button>
                        </Segment> :
                        <Segment basic>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                       type="password" value={formik.values.currentPassword}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="currentPassword"/>
                            </div>
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}>
                            </Button>
                        </Segment>

                )
            case "links":
                return (
                    <div>
                        <Segment basic>
                            <div>
                                <Input icon="world" iconPosition="left" placeholder="Your Github Link"
                                       type="text" value={formik.values.githubAccountLink}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="githubAccountLink"/>
                            </div>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleGithubLinkSubmit} content={"Save"}>
                            </Button>
                            <Button color="red" style={{marginTop: 10, marginBottom: 10, marginRight: 10}}
                                    onClick={handleGithubLinkRemove} content={"Remove"}>
                            </Button>
                        </Segment>
                        <Segment basic>
                            <div>
                                <Input icon="world" iconPosition="left" placeholder="Your Linkedin Link"
                                       type="text" value={formik.values.linkedinAccountLink}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="linkedinAccountLink"/>
                            </div>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleLinkedinLinkSubmit} content={"Save"}>
                            </Button>
                            <Button color="red" style={{marginTop: 10, marginBottom: 10, marginRight: 10}}
                                    onClick={handleLinkedinLinkRemove} content={"Remove"}>
                            </Button>
                        </Segment>
                    </div>
                )
            case "danger":
                return (
                    isAuthenticated ?
                        <Segment basic>
                            <Button color="red" onClick={handleDeleteClick}>
                                <Icon name="x"/>Delete Account
                            </Button>
                        </Segment> :
                        <Segment basic>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="Password"
                                       type="password" value={formik.values.oldPassword}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="currentPassword"/>
                            </div>
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}>
                            </Button>
                        </Segment>
                )
            default:
                return null
        }
    }

    function mainInfos() {
        return (
            <Grid stackable>
                <Grid.Column width={8}>
                    <Item.Group>
                        <Item>
                            <Item.Image src={"https://freesvg.org/img/abstract-user-flat-1.png"}/>
                            <Item.Content verticalAlign={"middle"}>
                                <Item.Header as='a'>
                                    <Header>
                                        {candidate?.firstName}
                                        <Header.Subheader content={candidate?.lastName}/>
                                    </Header>
                                </Item.Header>
                                <Item.Meta content={`${age} years old`}/>
                                <Item.Description>
                                    <Icon name={"envelope"}/>&nbsp;{candidate?.email}
                                </Item.Description>
                                {candidate?.linkedinAccount || candidate?.githubAccount ?
                                    <Item.Extra>
                                        {candidate?.githubAccount ?
                                            <a href={candidate.githubAccount}>
                                                <Icon name={"github"} size="big" color={"black"}/>
                                            </a> : null}
                                        {candidate?.linkedinAccount ?
                                            <a href={candidate.linkedinAccount}>
                                                <Icon name={"linkedin"} size="big"/>
                                            </a> : null}
                                    </Item.Extra>
                                    : null}
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
            </Grid>
        )
    }

    if (String(userProps.userType) !== "candidate") return <Header content={"Sorry You Do Not Have Access Here"}/>

    return (
        <div>
            {deleteAccountPopup()}
            {mainInfos()}
            <Grid stackable>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary stackable>
                        <Menu.Item
                            icon={"envelope"} color={"pink"} name='Email' active={activeItem === 'email'}
                            onClick={() => handleItemClick("email")}/>
                        <Menu.Item
                            icon={"lock"} color={"blue"} name='Password' active={activeItem === 'password'}
                            onClick={() => handleItemClick("password")}/>
                        <Menu.Item
                            icon={"linkify"} color={"yellow"} name='Account Links' active={activeItem === 'links'}
                            onClick={() => handleItemClick("links")}/>
                        <Menu.Item
                            icon={"warning sign"} color={"red"} name='Danger Zone' active={activeItem === 'danger'}
                            onClick={() => handleItemClick("danger")}/>
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                    <Grid padded>
                        <Grid.Column>
                            {menuSegments()}
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
            </Grid>
        </div>
    )
}
