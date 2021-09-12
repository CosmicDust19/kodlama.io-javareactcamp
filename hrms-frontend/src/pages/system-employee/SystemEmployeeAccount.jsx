import {Button, Grid, Header, Icon, Input, Menu, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {checkCurrentPassword, deleteAccount, updateEmail, updatePassword} from "../../utilities/UserUtils";
import {updateFirstName, updateLastName} from "../../utilities/SysEmplUtils";
import MainInfos from "../../components/common/MainInfos";
import AreYouSureModal from "../../components/common/AreYouSureModal";

export function SystemEmployeeAccount() {

    const dispatch = useDispatch();
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)

    const [sysEmpl, setSysEmpl] = useState(userProps.user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('name')

    useEffect(() => {
        setSysEmpl(userProps.user)
    }, [userProps.user])

    const formik = useFormik({
        initialValues: {
            firstName: "", lastName: "", email: "", password: "",
            passwordRepeat: "", currentPassword: ""
        }
    });

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"😛🤪🤭"}/>

    const handleItemClick = (activeItem) => setActiveItem(activeItem)
    const handleDeleteClick = () => setDeletePopupOpen(true)

    const handleEmailSubmit = () => updateEmail(dispatch, sysEmpl, formik.values.email)
    const handleCurrentPasswordSubmit = () => checkCurrentPassword(sysEmpl, formik, setAuthenticated)
    const handlePasswordSubmit = () => updatePassword(sysEmpl.id, formik)
    const handleFirstNameSubmit = () => updateFirstName(dispatch, sysEmpl, formik.values.firstName)
    const handleLastNameSubmit = () => updateLastName(dispatch, sysEmpl, formik.values.lastName)
    const handleDeleteAccount = () => deleteAccount(dispatch, sysEmpl.id, history, setDeletePopupOpen)

    function menuSegments() {
        switch (activeItem) {
            case "name":
                return (
                    <div>
                        <Segment basic>
                            <Input icon="user" iconPosition="left" placeholder="First Name"
                                   type="text" value={formik.values.firstName}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="firstName"/><br/>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleFirstNameSubmit} content={"Save"}/>
                        </Segment>
                        <Segment basic>
                            <Input icon="user" iconPosition="left" placeholder="Last Name"
                                   type="text" value={formik.values.lastName}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="lastName"/><br/>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleLastNameSubmit} content={"Save"}/>
                        </Segment>
                    </div>
                )
            case "email":
                return (
                    <Segment basic>
                        <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                               value={formik.values.email} onBlur={formik.handleBlur} name="email"
                               onChange={formik.handleChange}/><br/>
                        <Button color="blue" onClick={handleEmailSubmit} content={"Save"}
                                style={{marginTop: 10, marginBottom: 10}}/>
                    </Segment>
                )
            case "password":
                return (
                    authenticated ?
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="New Password"
                                   type="password" value={formik.values.password}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur} name="password"/><br/>
                            <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                   type="password" value={formik.values.passwordRepeat}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="passwordRepeat" style={{marginTop: 10, marginBottom: 10}}/><br/>
                            <Button color="blue" onClick={handlePasswordSubmit} content={"Save"}/>
                        </Segment> :
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/><br/>
                            <Button color="olive" onClick={handleCurrentPasswordSubmit} content={"Authenticate"}
                                    style={{marginTop: 10, marginBottom: 10}}/>
                        </Segment>
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
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/><br/>
                            <Button color="olive" onClick={handleCurrentPasswordSubmit} content={"Authenticate"}
                                    style={{marginTop: 10, marginBottom: 10}}/>
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
            <MainInfos user={sysEmpl}/>
            <Grid stackable>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary>
                        <Menu.Item color={"yellow"} icon={"user"} name='Name' active={activeItem === 'name'}
                                   onClick={() => handleItemClick("name")}/>
                        <Menu.Item color={"purple"} icon={"envelope"} name='Email' active={activeItem === 'email'}
                                   onClick={() => handleItemClick("email")}/>
                        <Menu.Item color={"teal"} icon={"lock"} name='Password' active={activeItem === 'password'}
                                   onClick={() => handleItemClick("password")}/>
                        <Menu.Item icon={"warning sign"} color={"red"} name='Delete Account' active={activeItem === 'danger'}
                                   onClick={() => handleItemClick("danger")}/>
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                    <Segment basic content={menuSegments()}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}


