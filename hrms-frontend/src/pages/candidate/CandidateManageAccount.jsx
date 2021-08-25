import {Button, Form, Grid, Header, Icon, Input, Item, Menu, Modal,} from "semantic-ui-react";
import React, {useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import CandidateService from "../../services/candidateService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, signOut, syncUser} from "../../store/actions/userActions";
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
    const [refresh, setRefresh] = useState(true);

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

    const refreshComp = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleCatch = (error) => {
        const resp = error.response
        console.log(error)
        console.log(resp)
        if (resp.data.data?.errors) {
            Object.entries(resp.data.data.errors).forEach((invalidProp) => {
                invalidProp[1] = invalidProp[1].toLowerCase()
                const message = `${invalidProp[1].charAt(0).toUpperCase()}${invalidProp[1].substr(1)}`
                const propName = `${invalidProp[0].charAt(0).toUpperCase()}${invalidProp[0].substr(1)}`
                toast.warning(`${message} (${propName})`)
            })
            return
        }
        if (resp.data.message) {
            toast.warning(resp.data.message)
        }
    }

    const lastUpdAct = (response, msg) => {
        dispatch(syncUser(response.data.data))
        refreshComp()
        toast(msg)
    }

    const handleEmailSubmit = () => {
        formik.values.email = formik.values.email.trim()
        userService.updateEmail(user.id, formik.values.email).then(r => {
            dispatch(changeEmail(r.data.data.email))
            refreshComp()
            toast("Saved")
        }).catch(handleCatch)
    }

    const handleCurrentPasswordSubmit = () => {
        userService.existsByEmailAndPW(user.email, formik.values.currentPassword).then(r => {
            if (r.data.data) {
                setIsAuthenticated(true)
                toast("Authentication Successful")
            } else toast.warning("Wrong password")
        }).catch(handleCatch)
    }

    const handlePasswordSubmit = () => {
        userService.updatePassword(user.id, formik.values.password, formik.values.currentPassword).then(() => {
            toast("Saved")
            formik.values.currentPassword = formik.values.password
        }).catch(handleCatch)
    }

    const handleGithubLinkSubmit = () => {
        formik.values.githubAccountLink = formik.values.githubAccountLink.trim()
        candidateService.updateGithubAccount(user.id, formik.values.githubAccountLink)
            .then(r => lastUpdAct(r, "Saved"))
            .catch(handleCatch)
    }

    const handleLinkedinLinkSubmit = () => {
        formik.values.linkedinAccountLink = formik.values.linkedinAccountLink.trim()
        candidateService.updateLinkedinAccount(user.id, formik.values.linkedinAccountLink)
            .then(r => lastUpdAct(r, "Saved"))
            .catch(handleCatch)
    }

    const handleGithubLinkRemove = () => {
        candidateService.updateGithubAccount(user.id, undefined)
            .then(r => lastUpdAct(r, "Removed"))
            .catch(handleCatch)
    }

    const handleLinkedinLinkRemove = () => {
        candidateService.updateLinkedinAccount(user.id, undefined)
            .then(r => lastUpdAct(r, "Removed"))
            .catch(handleCatch)
    }

    const handleDeleteAccount = () => setDeletePopupOpen(true)

    function areYouSurePopup() {
        return (
            <Modal basic onClose={() => setDeletePopupOpen(false)} onOpen={() => setDeletePopupOpen(true)}
                   open={deletePopupOpen} size='small'>
                <Header size={"large"} color={"yellow"}>
                    Are you sure you want to delete your account permanently ?
                </Header>
                <Modal.Actions>
                    <Button color='red' inverted size='large' onClick={() => {
                        userService.deleteById(user.id).then(() => {
                            dispatch(signOut())
                            history.push("/")
                            toast("Good Bye 👋")
                        }).catch(handleCatch).finally(() => {
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
                        <div>
                            <Form>
                                <Input icon="lock" iconPosition="left" placeholder="New Password"
                                       type="password" value={formik.values.password}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="password"/>
                            </Form>
                            <Form style={{marginTop: 10}}>
                                <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                       type="password" value={formik.values.passwordRepeat}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="passwordRepeat"/>
                            </Form>
                            <Button color="blue" style={{marginTop: 10}}
                                    onClick={handlePasswordSubmit} content={"Save"}>
                            </Button>
                        </div>
                        :
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
                            <Item.Image src={"https://freesvg.org/img/abstract-user-flat-1.png"}/>
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
                                {user?.linkedinAccount || user?.githubAccount ?
                                    <Item.Extra>
                                        {user?.githubAccount ?
                                            <a href={user.githubAccount}>
                                                <Icon name={"github"} size="big" color={"black"}/>
                                            </a> : null}
                                        {user?.linkedinAccount ?
                                            <a href={user.linkedinAccount}>
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
                            icon={"envelope"} color={"pink"} name='Email'
                            active={activeItem === 'email'}
                            onClick={() => handleItemClick("email")}
                        />
                        <Menu.Item
                            icon={"lock"} color={"blue"} name='Password'
                            active={activeItem === 'password'}
                            onClick={() => handleItemClick("password")}
                        />
                        <Menu.Item
                            icon={"linkify"} color={"yellow"} name='Account Links'
                            active={activeItem === 'links'}
                            onClick={() => handleItemClick("links")}
                        />
                        <Menu.Item
                            icon={"warning sign"} color={"red"} name='Danger Zone'
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
