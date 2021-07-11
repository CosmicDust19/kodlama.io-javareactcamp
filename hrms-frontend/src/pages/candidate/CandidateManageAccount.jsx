import {
    Header, Grid, Menu, Input, Icon, Form, Button,
    Item, Modal, Image, Placeholder,
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import CandidateService from "../../services/candidateService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, changeGithub, changeLinkedin, signOut} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";

export function CandidateManageAccount() {

    const userService = new UserService()
    const candidateService = new CandidateService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)

    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('email')
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
            email: "", password: "",
            passwordRepeat: "", currentPassword: "",
            githubAccountLink: "", linkedinAccountLink: ""
        }
    });

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
        }
        userService.existsByEmail(formik.values.email).then(r => {
            console.log(r)
            if (r.data.success) {
                if (!r.data.data) {
                    candidateService.updateEmail(user.id, formik.values.email).then(r => {
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
        candidateService.existsByEmailAndPassword(user?.email, formik.values.currentPassword).then((r) => {
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
        candidateService.updatePassword(user.id, formik.values.password, formik.values.currentPassword).then(r => {
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
        if (formik.values.githubAccountLink === user.githubAccountLink) {
            toast.warning("You are already using this link")
            return;
        }
        candidateService.updateGithubAccountLink(user.id, formik.values.githubAccountLink).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeGithub(formik.values.githubAccountLink))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Saved")
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
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
        if (formik.values.linkedinAccountLink === user.linkedinAccountLink) {
            toast.warning("You are already using this link")
            return;
        }
        candidateService.updateLinkedinAccount(user.id, formik.values.linkedinAccountLink).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeLinkedin(formik.values.linkedinAccountLink))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Saved")
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleGithubLinkRemove = () => {
        if (user.githubAccountLink == null) {
            toast.warning("Already you do not have a github link")
            return;
        }
        candidateService.updateGithubAccountLink(user.id, null).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeGithub(null))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Removed")
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleLinkedinLinkRemove = () => {
        if (user.linkedinAccountLink == null) {
            toast.warning("Already you do not have a linkedin link")
            return;
        }
        candidateService.updateLinkedinAccount(user.id, null).then(r => {
            console.log(r)
            if (r.data.success) {
                dispatch(changeLinkedin(null))
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
                toast("Removed")
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
                        candidateService.deleteAccount(user.id).then(r => {
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
            case "email":
                return (
                    <Form>
                        <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                               value={formik.values.email} onBlur={formik.handleBlur} name="email"
                               onChange={formik.handleChange}
                        />
                        <Button color="blue" onClick={handleEmailSubmit} content={"Save"} style={{marginLeft: 10}}/>
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
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           name="password"/>
                                </Grid.Row>
                                <Grid.Row>
                                    <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                           type="password" value={formik.values.passwordRepeat}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           name="passwordRepeat"/>
                                </Grid.Row>
                                <Button color="blue" style={{marginLeft: 10}}
                                        onClick={handlePasswordSubmit} content={"Save"}>
                                </Button>
                            </Grid>
                        </Form> :
                        <Form>
                            <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/>
                            <Button color="olive" style={{marginLeft: 10}}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}>
                            </Button>
                        </Form>

                )
            case "links":
                return (
                    <div>
                        <Form>
                            <Input icon="world" iconPosition="left" placeholder="Your Github Link"
                                   type="text" value={formik.values.githubAccountLink}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="githubAccountLink"/>
                            <Button color="blue" style={{marginLeft: 10}}
                                    onClick={handleGithubLinkSubmit} content={"Save"}>
                            </Button>
                            <Button color="red" style={{marginLeft: 10}}
                                    onClick={handleGithubLinkRemove} content={"Remove"}>
                            </Button>
                        </Form>
                        <Form style={{marginTop: 10}}>
                            <Input icon="world" iconPosition="left" placeholder="Your Linkedin Link"
                                   type="text" value={formik.values.linkedinAccountLink}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="linkedinAccountLink"/>
                            <Button color="blue" style={{marginLeft: 10}}
                                    onClick={handleLinkedinLinkSubmit} content={"Save"}>
                            </Button>
                            <Button color="red" style={{marginLeft: 10}}
                                    onClick={handleLinkedinLinkRemove} content={"Remove"}>
                            </Button>
                        </Form>
                    </div>
                )
            case "danger":
                return (
                    isAuthenticated ?
                        <Button color="red" onClick={handleDeleteAccount}>
                            <Icon name="x"/>Delete Account
                        </Button> :
                        <Form>
                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                   type="password" value={formik.values.oldPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/>
                            <Button color="olive" style={{marginLeft: 10}}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}>
                            </Button>
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

    if (String(userProps.userType) !== "candidate") {
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
