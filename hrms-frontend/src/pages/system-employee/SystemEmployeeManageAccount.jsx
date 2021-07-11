import {
    Header, Grid, Menu, Input, Icon, Form, Button,
    Item, Modal, Image, Placeholder,
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, changeFirstName, changeLastName, signOut} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";
import SystemEmployeeService from "../../services/systemEmployeeService";

const userService = new UserService()
const systemEmployeeService = new SystemEmployeeService()

export function SystemEmployeeManageAccount() {

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)
    const history = useHistory()

    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('name')
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    const handleItemClick = (activeItem) => {
        setActiveItem(activeItem)
    }

    const formik = useFormik({
        initialValues: {
            firstName: "", lastName: "",
            email: "", password: "",
            passwordRepeat: "", currentPassword: ""
        }
    });

    const handleFirstNameSubmit = () => {
        if (!formik.values.firstName) {
            toast.warning("Please enter your first name")
            return;
        }
        formik.values.firstName = formik.values.firstName.trim()
        if (formik.values.firstName.length < 2 || formik.values.firstName.length > 50) {
            toast.warning("First name should be between 2 - 50 characters long")
            return;
        }
        if (formik.values.firstName === user.firstName) {
            toast.warning("You are already using this first name")
            return;
        }
        systemEmployeeService.updateFirstName(user.id, formik.values.firstName).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeFirstName(formik.values.firstName))
                toast("Saved")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleLastNameSubmit = () => {
        if (!formik.values.lastName) {
            toast.warning("Please enter your last name")
            return;
        }
        formik.values.lastName = formik.values.lastName.trim()
        if (formik.values.lastName.length < 2 || formik.values.lastName.length > 50) {
            toast.warning("Last name should be between 2 - 50 characters long")
            return;
        }
        if (formik.values.lastName === user.lastName) {
            toast.warning("You are already using this last name")
            return;
        }
        systemEmployeeService.updateLastName(user.id, formik.values.lastName).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeLastName(formik.values.lastName))
                toast("Saved")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleEmailSubmit = () => {
        if (!formik.values.email) {
            toast.warning("Please enter an email!")
            return;
        }
        formik.values.email = formik.values.email.trim()
        if (user.email === formik.values.email) {
            toast.warning("You are already using this email!")
            return;
        } else if (formik.values.email < 4 || formik.values.email > 100 ||
            !/^\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+$/.test(formik.values.email)) {
            toast.warning("Invalid email format!")
            return;
        }
        userService.existsByEmail(formik.values.email).then(r => {
            console.log(r)
            if (r.data.success) {
                if (!r.data.data) {
                    systemEmployeeService.updateEmail(user.id, formik.values.email).then(r => {
                        console.log(r)
                        if (r.data.success) {
                            dispatch(changeEmail(formik.values.email))
                            if (refresh === 0) setRefresh(1);
                            else setRefresh(0)
                            toast("Saved")
                        } else toast.warning("A problem has occurred")
                    }).catch(reason => {
                        console.log(reason)
                        toast.warning("A problem has occurred while updating email")
                    })
                } else toast.warning("This email in use")
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleCurrentPasswordSubmit = () => {
        if (!formik.values.currentPassword) {
            toast.warning("Please enter your old password")
            return;
        }
        if (formik.values.currentPassword.length < 6 || formik.values.currentPassword.length > 20) {
            toast.warning("Wrong password!")
            return;
        }
        systemEmployeeService.existsByEmailAndPassword(user.email, formik.values.currentPassword).then((r) => {
            console.log(r)
            if (r.data.success) {
                if (r.data.data) {
                    setIsAuthenticated(true)
                    toast("Authentication Successful")
                } else toast.warning("Wrong password!")
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handlePasswordSubmit = () => {
        if (!formik.values.password) {
            toast.warning("Please enter a new password")
            return;
        }
        formik.values.password = formik.values.password.trim()
        if (formik.values.password.length < 6 || formik.values.password.length > 20) {
            toast.warning("Password should be a text between 6 - 20 long")
            return;
        }
        if (formik.values.password !== formik.values.passwordRepeat) {
            toast.warning("Passwords are not matching")
            return;
        }
        if (formik.values.password === formik.values.currentPassword) {
            toast.warning("You are already using this password")
            return;
        }
        systemEmployeeService.updatePassword(user.id, formik.values.password, formik.values.currentPassword).then(r => {
            console.log(r)
            if (r.data.success) {
                toast("Saved")
                formik.values.currentPassword = formik.values.password
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleDeleteAccount = () => {
        setDeletePopupOpen(true)
    }

    function areYouSurePopup() {
        return (
            <Modal basic onClose={() => setDeletePopupOpen(false)} onOpen={() => setDeletePopupOpen(true)}
                   open={deletePopupOpen} size='small'>
                <Header size={"large"} color={"yellow"}>
                    Are you sure you want to delete your account permanently ?
                </Header>
                <Modal.Actions>
                    <Button color='red' inverted size='large' onClick={() => {
                        systemEmployeeService.deleteAccount(user.id).then(r => {
                            console.log(r)
                            dispatch(signOut())
                            history.push("/")
                            toast("Good Bye 👋")
                        }).finally(() => {
                            setDeletePopupOpen(false)
                        })
                    }}>
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
                    <Grid>
                        <Grid.Row>
                            <Form>
                                <Input icon="user" iconPosition="left" placeholder="First Name"
                                       type="text" value={formik.values.firstName}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="firstName"/>
                                <Button color="blue" style={{marginLeft: 10}}
                                        onClick={handleFirstNameSubmit} content={"Save"}>
                                </Button>
                            </Form>
                        </Grid.Row>
                        <Grid.Row>
                            <Form>
                                <Input icon="user" iconPosition="left" placeholder="Last Name"
                                       type="text" value={formik.values.lastName}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="lastName"/>
                                <Button color="blue" style={{marginLeft: 10}}
                                        onClick={handleLastNameSubmit} content={"Save"}>
                                </Button>
                            </Form>
                        </Grid.Row>
                    </Grid>
                )
            case "email":
                return (
                    <Form>
                        <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                               value={formik.values.email} onBlur={formik.handleBlur} name="email"
                               onChange={formik.handleChange}
                        />
                        <Button color="blue" onClick={handleEmailSubmit} content={"Save"}
                                style={{marginLeft: 10}}/>
                    </Form>
                )
            case "password":
                return (
                    isAuthenticated ?
                        <Form>
                            <Grid>
                                <Grid.Row>
                                    <Input icon="lock" iconPosition="left" placeholder="New Password"
                                           type="password" value={formik.values.password}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur} name="password"/>
                                </Grid.Row>
                                <Grid.Row>
                                    <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                           type="password" value={formik.values.passwordRepeat}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           name="passwordRepeat"/>
                                </Grid.Row>
                                <Button color="blue" onClick={handlePasswordSubmit} content={"Save"}/>
                            </Grid>
                        </Form> :
                        <Form>
                            <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/>
                            <Button color="olive" onClick={handleCurrentPasswordSubmit} content={"Authenticate"}
                                    style={{marginLeft: 10}}/>
                        </Form>
                )
            case "danger":
                return (
                    isAuthenticated ?
                        <Button color="red" onClick={handleDeleteAccount}>
                            <Icon name="x"/>Delete Account
                        </Button> :
                        <Form>
                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/>
                            <Button color="olive" onClick={handleCurrentPasswordSubmit} content={"Authenticate"}
                                    style={{marginLeft: 10}}/>
                        </Form>
                )
            default:
                return null
        }
    }

    function mainInfos() {
        return (
            <Grid stackable>
                <Grid.Column width={8}>
                    <Item.Group unstackable>
                        <Item>
                            {loading ?
                                <Item.Image>
                                    <Image circular>
                                        <Placeholder style={{height: 175, width: 175}}>
                                            <Placeholder.Image/>
                                        </Placeholder>
                                    </Image>
                                </Item.Image> :
                                <Item.Image src={"https://freesvg.org/img/abstract-user-flat-1.png"}/>
                            }
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

    if (String(userProps.userType) !== "systemEmployee"){
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
            <Grid>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary>
                        <Menu.Item
                            name='Name'
                            active={activeItem === 'name'}
                            onClick={() => handleItemClick("name")}
                        />
                        <Menu.Item
                            name='Email'
                            active={activeItem === 'email'}
                            onClick={() => handleItemClick("email")}
                        />
                        <Menu.Item
                            name='Password'
                            active={activeItem === 'password'}
                            onClick={() => handleItemClick("password")}
                        />
                        <Menu.Item
                            color={"red"}
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
            {loading ? <Image src={"https://freesvg.org/img/abstract-user-flat-1.png"} style={{opacity: 0}}/> : null}
        </div>
    )
}


