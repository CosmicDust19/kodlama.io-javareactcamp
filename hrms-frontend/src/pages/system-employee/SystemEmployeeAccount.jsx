import {
    Header, Grid, Menu, Input, Icon, Button,
    Item, Modal, Segment
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, signOut, syncUser} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";
import SystemEmployeeService from "../../services/systemEmployeeService";
import {handleCatch} from "../../utilities/Utils";

const userService = new UserService()
const systemEmployeeService = new SystemEmployeeService()

export function SystemEmployeeAccount() {

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)
    const history = useHistory()

    const [sysEmpl, setSysEmpl] = useState(user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('name')

    useEffect(() => {
        setSysEmpl(user)
    }, [user])

    const handleItemClick = (activeItem) => setActiveItem(activeItem)

    const formik = useFormik({
        initialValues: {
            firstName: "", lastName: "", email: "", password: "",
            passwordRepeat: "", currentPassword: ""
        }
    });

    const authenticate = (data) => {
        if (data === true) {
            setIsAuthenticated(true);
            toast("Authentication Successful");
        } else toast.warning("Wrong password");
    }

    const lastUpdAct = (response, msg, fieldName, fieldValue) => {
        dispatch(syncUser(response.data.data));
        formik.setFieldValue(fieldName, fieldValue);
        setSysEmpl(response.data.data);
        toast(msg);
    }

    const handleFirstNameSubmit = () => {
        systemEmployeeService.updateFirstName(user.id, formik.values.firstName)
            .then(r => lastUpdAct(r, "Saved", "firstName", r.data.data.firstName))
            .catch(handleCatch)
    }

    const handleLastNameSubmit = () => {
        systemEmployeeService.updateLastName(user.id, formik.values.lastName)
            .then(r => lastUpdAct(r, "Saved", "firstName", r.data.data.firstName))
            .catch(handleCatch)
    }

    const handleEmailSubmit = () => {
        userService.updateEmail(user.id, formik.values.email).then(r => {
            dispatch(changeEmail(r.data.data.email));
            formik.setFieldValue("email", r.data.data.email);
            setSysEmpl({...sysEmpl, email: r.data.data.email});
            toast("Saved");
        }).catch(handleCatch)
    }

    const handleCurrentPasswordSubmit = () => {
        userService.existsByEmailAndPW(user.email, formik.values.currentPassword)
            .then((r) => authenticate(r.data.data))
            .catch(handleCatch)
    }

    const handlePasswordSubmit = () => {
        userService.updatePassword(user.id, formik.values.password, formik.values.currentPassword)
            .then(r => {
                toast("Saved");
                formik.values.currentPassword = r.data.data.password;
                formik.setFieldValue("currentPassword", r.data.data.password);
            })
            .catch(handleCatch)
    }

    const handleDeleteClick = () => setDeletePopupOpen(true)

    const deleteAccount = () => {
        userService.deleteById(sysEmpl.id)
            .then(() => {
                dispatch(signOut())
                history.push("/")
                toast("Good Bye 👋")
            })
            .catch(handleCatch)
            .finally(() => setDeletePopupOpen(false))
    }

    function areYouSurePopup() {
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
            </Modal>)
    }

    function menuSegments() {
        switch (activeItem) {
            case "name":
                return (
                    <div>
                        <Segment basic>
                            <div>
                                <Input icon="user" iconPosition="left" placeholder="First Name"
                                       type="text" value={formik.values.firstName}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="firstName"/>
                            </div>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleFirstNameSubmit} content={"Save"}/>
                        </Segment>
                        <Segment basic>
                            <div>
                                <Input icon="user" iconPosition="left" placeholder="Last Name"
                                       type="text" value={formik.values.lastName}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="lastName"/>
                            </div>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}}
                                    onClick={handleLastNameSubmit} content={"Save"}/>
                        </Segment>
                    </div>
                )
            case "email":
                return (
                    <Segment basic>
                        <div>
                            <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                                   value={formik.values.email} onBlur={formik.handleBlur} name="email"
                                   onChange={formik.handleChange}
                            />
                        </div>
                        <Button color="blue" onClick={handleEmailSubmit} content={"Save"}
                                style={{marginTop: 10, marginBottom: 10}}/>
                    </Segment>
                )
            case "password":
                return (
                    isAuthenticated ?
                        <Segment basic>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="New Password"
                                       type="password" value={formik.values.password}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur} name="password"/>
                            </div>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                       type="password" value={formik.values.passwordRepeat}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="passwordRepeat" style={{marginTop: 10, marginBottom: 10}}/>
                            </div>
                            <Button color="blue" onClick={handlePasswordSubmit} content={"Save"}/>
                        </Segment> :
                        <Segment basic>
                            <div>
                                <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                       type="password" value={formik.values.currentPassword}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="currentPassword"/>
                            </div>
                            <Button color="olive" onClick={handleCurrentPasswordSubmit} content={"Authenticate"}
                                    style={{marginTop: 10, marginBottom: 10}}/>
                        </Segment>
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
                                       type="password" value={formik.values.currentPassword}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="currentPassword"/>
                            </div>
                            <Button color="olive" onClick={handleCurrentPasswordSubmit} content={"Authenticate"}
                                    style={{marginTop: 10, marginBottom: 10}}/>
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
                                        {user?.firstName}
                                        <Header.Subheader>{user?.lastName}</Header.Subheader>
                                    </Header></Item.Header>
                                <Item.Description>
                                    <Icon name={"envelope"}/>{"  " + user?.email}
                                </Item.Description>
                                {user?.linkedinAccountLink || user?.githubAccountLink ?
                                    <Item.Extra>
                                        {user?.githubAccountLink ?
                                            <a href={user.githubAccountLink}>
                                                <Icon name={"github"} size="big" color={"black"}/>
                                            </a> : null}
                                        {user?.linkedinAccountLink ?
                                            <a href={user.linkedinAccountLink}>
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

    if (String(userProps.userType) !== "systemEmployee") {
        return (
            <Header>
                Sorry You Do Not Have Access Here
            </Header>
        )
    }

    return (
        <div>
            {areYouSurePopup()}
            {mainInfos()}
            <Grid stackable>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary>
                        <Menu.Item
                            color={"yellow"} icon={"user"} name='Name'
                            active={activeItem === 'name'}
                            onClick={() => handleItemClick("name")}
                        />
                        <Menu.Item
                            color={"orange"} icon={"envelope"} name='Email'
                            active={activeItem === 'email'}
                            onClick={() => handleItemClick("email")}
                        />
                        <Menu.Item
                            color={"blue"} icon={"lock"} name='Password'
                            active={activeItem === 'password'}
                            onClick={() => handleItemClick("password")}
                        />
                        <Menu.Item
                            icon={"warning sign"} color={"red"}
                            name='Danger Zone'
                            active={activeItem === 'danger'}
                            onClick={() => handleItemClick("danger")}
                        />
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


