import {Button, Grid, Header, Icon, Input, Menu, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {checkCurrentPassword, deleteAccount, updateEmail, updatePassword} from "../../utilities/UserUtils";
import {updateGithub, updateLinkedin} from "../../utilities/CandidateUtils";
import MainInfos from "../../components/common/MainInfos";
import AreYouSureModal from "../../components/common/AreYouSureModal";

export function CandidateAccount() {

    const dispatch = useDispatch();
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)
    const user = userProps.user

    const [candidate, setCandidate] = useState(user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('email')

    useEffect(() => {
        setCandidate(user)
    }, [user])

    const formik = useFormik({
        initialValues: {
            email: "", password: "",
            passwordRepeat: "", currentPassword: "",
            githubAccount: "", linkedinAccount: ""
        }
    });

    if (String(userProps.userType) !== "candidate") return <Header content={"😛🤪🤭"}/>

    const handleItemClick = (activeItem) => setActiveItem(activeItem)
    const handleDeleteClick = () => setDeletePopupOpen(true)

    const handleEmailSubmit = () => updateEmail(dispatch, candidate, formik.values.email)
    const handleCurrentPasswordSubmit = () => checkCurrentPassword(candidate, formik, setAuthenticated)
    const handlePasswordSubmit = () => updatePassword(candidate.id, formik)
    const handleGithubLinkSubmit = () => updateGithub(dispatch, candidate, formik.values.githubAccount)
    const handleLinkedinLinkSubmit = () => updateLinkedin(dispatch, candidate, formik.values.linkedinAccount)
    const handleGithubLinkRemove = () => updateGithub(dispatch, candidate)
    const handleLinkedinLinkRemove = () => updateLinkedin(dispatch, candidate)
    const handleDeleteAccount = () => deleteAccount(dispatch, candidate.id, history, setDeletePopupOpen)

    function menuSegments() {
        switch (activeItem) {
            case "email":
                return (
                    <Segment basic>
                        <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                               value={formik.values.email} onBlur={formik.handleBlur} name="email"
                               onChange={formik.handleChange}/><br/>
                        <Button color="blue" onClick={handleEmailSubmit} content={"Save"} style={{marginTop: 10, marginBottom: 10}}/>
                    </Segment>
                )
            case "password":
                return (
                    authenticated ?
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="New Password"
                                   type="password" value={formik.values.password}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="password"/><br/>
                            <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                   type="password" value={formik.values.passwordRepeat} style={{marginTop: 10, marginBottom: 10}}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="passwordRepeat"/><br/>
                            <Button color="blue" onClick={handlePasswordSubmit} content={"Save"}/>
                        </Segment> :
                        <Segment basic>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                       type="password" value={formik.values.currentPassword}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="currentPassword"/><br/>
                            </div>
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Segment>
                )
            case "links":
                return (
                    <div>
                        <Segment basic>
                            <Input icon="world" iconPosition="left" placeholder="Your Github Link"
                                   type="text" value={formik.values.githubAccount}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="githubAccount"/><br/>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleGithubLinkSubmit} content={"Save"}/>
                            <Button color="red" style={{marginTop: 10, marginBottom: 10, marginRight: 10}}
                                    onClick={handleGithubLinkRemove} content={"Remove"}/>
                        </Segment>
                        <Segment basic>
                            <Input icon="world" iconPosition="left" placeholder="Your Linkedin Link"
                                   type="text" value={formik.values.linkedinAccount}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="linkedinAccount"/><br/>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleLinkedinLinkSubmit} content={"Save"}/>
                            <Button color="red" style={{marginTop: 10, marginBottom: 10, marginRight: 10}}
                                    onClick={handleLinkedinLinkRemove} content={"Remove"}/>
                        </Segment>
                    </div>
                )
            case "danger":
                return (
                    authenticated ?
                        <Segment basic>
                            <Button color="red" onClick={handleDeleteClick}>
                                <Icon name="x"/>Delete Account
                            </Button>
                        </Segment> :
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                   type="password" value={formik.values.oldPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/><br/>
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Segment>
                )
            default:
                return null
        }
    }

    return (
        <div>
            <AreYouSureModal open={deletePopupOpen} message={"Are you sure you want to delete your account permanently ?"}
                             yesColor={"red"} noColor={"grey"} onYes={handleDeleteAccount} onNo={() => setDeletePopupOpen(false)}/>
            <MainInfos user={candidate}/>
            <Grid stackable>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary stackable>
                        <Menu.Item icon={"envelope"} color={"purple"} name='Email' active={activeItem === 'email'}
                                   onClick={() => handleItemClick("email")}/>
                        <Menu.Item icon={"lock"} color={"teal"} name='Password' active={activeItem === 'password'}
                                   onClick={() => handleItemClick("password")}/>
                        <Menu.Item icon={"linkify"} color={"blue"} name='Account Links' active={activeItem === 'links'}
                                   onClick={() => handleItemClick("links")}/>
                        <Menu.Item icon={"warning sign"} color={"red"} name='Delete Account' active={activeItem === 'danger'}
                                   onClick={() => handleItemClick("danger")}/>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment basic content={menuSegments()}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}
