import {
    Header, Grid, Menu, Input, Icon, Form, Button,
    Item, Modal,
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../services/userService";
import CandidateService from "../services/candidateService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, changeGithub, changeLinkedin, signOut} from "../store/actions/userActions";
import {useHistory} from "react-router-dom";

const colors = ['red', 'orange', 'yellow', 'olive', 'green',
    'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

let color = colors[Math.floor(Math.random() * 12)]

const userService = new UserService()
const candidateService = new CandidateService()

export function CandidateManageAccount() {

    let backendResponse;
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const history = useHistory()

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('email')
    const [isCorrectPassword, setIsCorrectPassword] = useState(false);
    const [isEmailInUse, setIsEmailInUse] = useState([]);
    const [refresh, setRefresh] = useState(0);

    const handleItemClick = (activeItem) => {
        setActiveItem(activeItem)
    }

    const formik = useFormik({
        initialValues: {
            email: "", password: "",
            passwordRepeat: "", currentPassword: "",
            githubAccountLink: "", linkedinAccountLink: ""
        }
    });

    useEffect(() => {
        userService.existsByEmail(formik.values.email).then((result) => setIsEmailInUse(result.data.data));
    }, [formik.values.email]);

    useEffect(() => {
        candidateService.existsByEmailAndPassword(user?.email, formik.values.currentPassword).then((result) => setIsCorrectPassword(result.data.data));
    }, [formik.values.currentPassword, user?.email]);

    function getAge() {
        return new Date().getFullYear() - user?.birthYear
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
        } else if (isEmailInUse) {
            toast.warning("This email in use!")
            return;
        }
        candidateService.updateEmail(user.id, formik.values.email).then((result) => backendResponse = result.data?.success)
        if (backendResponse === false) {
            toast("A problem has occurred", {
                autoClose: 1500,
                pauseOnHover: false,
            })
            return;
        }
        dispatch(changeEmail(formik.values.email))
        if (refresh === 0) setRefresh(1);
        if (refresh === 1) setRefresh(0)
        toast("Saved", {
            autoClose: 1500,
            pauseOnHover: false,
        })
    }

    const handleCurrentPasswordSubmit = () => {
        if (!formik.values.currentPassword) {
            toast.warning("Please enter your old password")
            return;
        }
        formik.values.currentPassword = formik.values.currentPassword.trim()
        if (formik.values.currentPassword.length < 6 || formik.values.currentPassword.length > 20) {
            toast.warning("Wrong password!")
            return;
        } else if (!isCorrectPassword) {
            toast.warning("Wrong password!")
            return;
        }
        setIsAuthenticated(true)
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
        candidateService.updatePassword(user.id, formik.values.password, formik.values.currentPassword).then((result) => backendResponse = result.data?.success)
        if (backendResponse === false) {
            toast("A problem has occurred", {
                autoClose: 1500,
                pauseOnHover: false,
            })
            return;
        }
        toast("Saved", {
            autoClose: 1500,
            pauseOnHover: false,
        })
    }

    const handleGithubLinkSubmit = () => {
        if (!formik.values.githubAccountLink) {
            toast.warning("Please enter your github account link")
            return;
        }
        formik.values.githubAccountLink = formik.values.githubAccountLink.trim()
        if (formik.values.githubAccountLink.length < 4) {
            toast.warning("Invalid link")
            return;
        }
        candidateService.updateGithubAccountLink(user.id, formik.values.githubAccountLink).then((result) => backendResponse = result.data?.success)
        console.log(backendResponse)
        if (backendResponse === false) {
            toast.warning("A problem has occurred", {
                autoClose: 1500,
                pauseOnHover: false,
            })
            return;
        }
        dispatch(changeGithub(formik.values.githubAccountLink))
        if (refresh === 0) setRefresh(1);
        if (refresh === 1) setRefresh(0)
        toast("Saved", {
            autoClose: 1500,
            pauseOnHover: false,
        })
    }

    const handleLinkedinLinkSubmit = () => {
        if (!formik.values.linkedinAccountLink) {
            toast.warning("Please enter your linkedin account link")
            return;
        }
        formik.values.linkedinAccountLink = formik.values.linkedinAccountLink.trim()
        if (formik.values.linkedinAccountLink.length < 4) {
            toast.warning("Invalid link")
            return;
        }
        candidateService.updateLinkedinAccount(user.id, formik.values.linkedinAccountLink).then((result) => backendResponse = result.data?.success)
        console.log(backendResponse)
        if (backendResponse === false) {
            toast.warning("A problem has occurred", {
                autoClose: 1500,
                pauseOnHover: false,
            })
            return;
        }
        dispatch(changeLinkedin(formik.values.linkedinAccountLink))
        if (refresh === 0) setRefresh(1);
        if (refresh === 1) setRefresh(0)
        toast("Saved", {
            autoClose: 1500,
            pauseOnHover: false,
        })
    }

    const handleGithubLinkRemove = () => {
        if (user.githubAccountLink == null) {
            toast.warning("Already you do not have a github link")
            return;
        }
        candidateService.updateGithubAccountLink(user.id, null).then(r => console.log(r))
        dispatch(changeGithub(null))
        if (refresh === 0) setRefresh(1);
        if (refresh === 1) setRefresh(0)
        toast("Removed", {
            autoClose: 1500,
            pauseOnHover: false,
        })
    }

    const handleLinkedinLinkRemove = () => {
        if (user.linkedinAccountLink == null) {
            toast.warning("Already you do not have a linkedin link")
            return;
        }
        candidateService.updateLinkedinAccount(user.id, null).then(r => console.log(r))
        dispatch(changeLinkedin(null))
        if (refresh === 0) setRefresh(1);
        if (refresh === 1) setRefresh(0)
        toast("Removed", {
            autoClose: 1500,
            pauseOnHover: false,
        })
    }

    const handleDeleteAccount = () => {
        setIsDeletePopupOpen(true)
    }

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value)
    }

    function areYouSurePopup() {
        return (
            <Modal basic onClose={() => setIsDeletePopupOpen(false)} onOpen={() => setIsDeletePopupOpen(true)}
                   open={isDeletePopupOpen} size='fullscreen'>
                <Grid centered padded>
                    <Grid.Row>
                        <Header size={"large"} color={"yellow"}>
                            Are you sure you want to delete your account permanently ?
                        </Header>
                    </Grid.Row>
                </Grid>
                <Grid centered padded>
                    <Grid.Row>
                        <Modal.Actions>
                            <Button color='yellow' inverted size='large' onClick={() => {
                                candidateService.deleteAccount(user.id).then(r => console.log(r)).then(r => {
                                    console.log(r)
                                    dispatch(signOut())
                                    history.push("/")
                                    toast("Good Bye 👋")
                                }).finally(() => {
                                    setIsDeletePopupOpen(false)
                                })
                            }}>
                                <Icon name='checkmark'/> Yes
                            </Button>
                            <Button basic color='red' inverted onClick={() => setIsDeletePopupOpen(false)} size='large'>
                                <Icon name='remove'/> No
                            </Button>
                        </Modal.Actions>
                    </Grid.Row>
                </Grid>
            </Modal>)
    }

    function menuSegments() {
        switch (activeItem) {
            case "email":
                return (
                    <Grid padded>
                        <Form>
                            <Grid>
                                <Grid.Column width={12}>
                                    <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                                           value={formik.values.email} onBlur={formik.handleBlur} name="email"
                                           onChange={(event, data) => {
                                               handleChange("email", data.value)
                                           }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Button color="blue"
                                            onClick={() => {
                                                handleEmailSubmit()
                                            }} content={"Save"}>
                                    </Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Grid>
                )
            case "password":
                return (
                    isAuthenticated ?
                        <Grid padded>
                            <Form>
                                <Grid>
                                    <Grid.Row>
                                        <Input icon="lock" iconPosition="left" placeholder="New Password"
                                               type="password" value={formik.values.password}
                                               onChange={(event, data) => {
                                                   handleChange("password", data.value)
                                               }} onBlur={formik.handleBlur} name="password"/>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                               type="password" value={formik.values.passwordRepeat}
                                               onChange={(event, data) => {
                                                   handleChange("passwordRepeat", data.value)
                                               }} onBlur={formik.handleBlur}
                                               name="passwordRepeat"/>
                                    </Grid.Row>
                                    <Button color="blue"
                                            onClick={() => {
                                                handlePasswordSubmit()
                                            }} content={"Save"}>
                                    </Button>
                                </Grid>
                            </Form>
                        </Grid> :
                        <Grid>
                            <Form>
                                <Grid padded>
                                    <Grid.Column width={10}>
                                        <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                               type="password" value={formik.values.currentPassword}
                                               onChange={(event, data) => {
                                                   handleChange("currentPassword", data.value)
                                               }} onBlur={formik.handleBlur}
                                               name="currentPassword"/>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button color="olive"
                                                onClick={() => {
                                                    handleCurrentPasswordSubmit()
                                                }} content={"Authenticate"}>
                                        </Button>
                                    </Grid.Column>
                                </Grid>
                            </Form>
                        </Grid>

                )
            case "links":
                return (
                    <div>
                        <Grid>
                            <Form>
                                <Grid padded>
                                    <Grid.Column width={8}>
                                        <Input icon="world" iconPosition="left" placeholder="Your Github Link"
                                               type="text" value={formik.values.githubAccountLink}
                                               onChange={(event, data) => {
                                                   handleChange("githubAccountLink", data.value)
                                               }} onBlur={formik.handleBlur}
                                               name="githubAccountLink"/>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button color="blue"
                                                onClick={() => {
                                                    handleGithubLinkSubmit()
                                                }} content={"Save"}>
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button color="red"
                                                onClick={() => {
                                                    handleGithubLinkRemove()
                                                }} content={"Remove"}>
                                        </Button>
                                    </Grid.Column>
                                </Grid>
                            </Form>
                        </Grid>
                        <Grid>
                            <Form>
                                <Grid padded>
                                    <Grid.Column width={8}>
                                        <Input icon="world" iconPosition="left" placeholder="Your Linkedin Link"
                                               type="text" value={formik.values.linkedinAccountLink}
                                               onChange={(event, data) => {
                                                   handleChange("linkedinAccountLink", data.value)
                                               }} onBlur={formik.handleBlur}
                                               name="linkedinAccountLink"/>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button color="blue"
                                                onClick={() => {
                                                    handleLinkedinLinkSubmit()
                                                }} content={"Save"}>
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button color="red"
                                                onClick={() => {
                                                    handleLinkedinLinkRemove()
                                                }} content={"Remove"}>
                                        </Button>
                                    </Grid.Column>
                                </Grid>
                            </Form>
                        </Grid>
                    </div>
                )
            case "danger":
                return (
                    isAuthenticated ?
                        <Grid>
                            <Grid.Column>
                                <Button color="red"
                                        onClick={() => {
                                            handleDeleteAccount()
                                        }} content={"Delete Account"}>
                                </Button>
                            </Grid.Column>
                        </Grid> :
                        <Grid>
                            <Form>
                                <Grid padded>
                                    <Grid.Column width={10}>
                                        <Input icon="lock" iconPosition="left" placeholder="Password"
                                               type="password" value={formik.values.oldPassword}
                                               onChange={(event, data) => {
                                                   handleChange("currentPassword", data.value)
                                               }} onBlur={formik.handleBlur}
                                               name="currentPassword"/>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button color="olive"
                                                onClick={() => {
                                                    handleCurrentPasswordSubmit()
                                                }} content={"Authenticate"}>
                                        </Button>
                                    </Grid.Column>
                                </Grid>
                            </Form>
                        </Grid>
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
                        <Item color={color}>
                            <Item.Image
                                src={"https://freesvg.org/img/abstract-user-flat-1.png"}/>
                            <Item.Content verticalAlign={"middle"}>
                                <Item.Header as='a'>
                                    <Header>
                                        {user?.firstName}
                                        <Header.Subheader>{user?.lastName}</Header.Subheader>
                                    </Header></Item.Header>
                                <Item.Meta>{getAge() + " years old"}</Item.Meta>
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

    return (
        <div>
            {areYouSurePopup()}
            {mainInfos()}
            <Grid>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary>
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
                            name='Account Links'
                            active={activeItem === 'links'}
                            onClick={() => handleItemClick("links")}
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
                    {menuSegments()}
                </Grid.Column>
            </Grid>
        </div>
    )
}


