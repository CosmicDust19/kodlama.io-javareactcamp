import {Button, Form, Grid, Header, Icon, Input, Item, Label, Menu, Modal, Popup, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import {useDispatch, useSelector} from "react-redux";
import {signOut, syncUser} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";
import EmployerService from "../../services/employerService";
import {handleCatch} from "../../utilities/Utils";

export function EmployerAccount() {

    const userService = new UserService()
    const employerService = new EmployerService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)

    const [employer, setEmployer] = useState(user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeItem, setActiveItem] = useState('email');

    useEffect(() => {
        setEmployer(user)
    }, [user])

    const formik = useFormik({
        initialValues: {
            email: "", website: "", password: "", passwordRepeat: "", currentPassword: "",
            companyName: "", phoneNumber: "",
        }
    });

    const lastUpdAct = (response, msg, fieldName1, fieldValue1, fieldName2, fieldValue2) => {
        dispatch(syncUser(response.data.data));
        formik.setFieldValue(fieldName1, fieldValue1);
        formik.setFieldValue(fieldName2, fieldValue2);
        setEmployer(response.data.data);
        toast(msg);
    }

    const handleMenuItemClick = (activeItem) => setActiveItem(activeItem)

    const authenticate = (data) => {
        if (data === true) {
            setIsAuthenticated(true)
            toast("Authentication Successful")
        } else toast.warning("Wrong password");
    }

    const handleEmailAndWebsiteSubmit = () => {
        employerService.updateEmailAndWebsite(employer.id, formik.values.email, formik.values.website)
            .then(r => lastUpdAct(r, "Sent",
                "email", r.data.data.employerUpdate.email,
                "website", r.data.data.employerUpdate.website))
            .catch(handleCatch)
    }

    const handleCurrentPasswordSubmit = () => {
        userService.existsByEmailAndPW(employer?.email, formik.values.currentPassword)
            .then((r) => authenticate(r.data.data))
            .catch(handleCatch)
    }

    const handlePasswordSubmit = () => {
        userService.updatePassword(employer.id, formik.values.password, formik.values.currentPassword)
            .then(() => {
                toast("Saved")
                formik.setFieldValue("currentPassword", formik.values.password)
            })
            .catch(handleCatch)
    }

    const handleCompanyNameSubmit = () => {
        employerService.updateCompanyName(employer.id, formik.values.companyName)
            .then(r => lastUpdAct(r, "Sent", "companyName", r.data.data.employerUpdate.companyName))
            .catch(handleCatch)
    }

    const handlePhoneNumberSubmit = () => {
        if (formik.values.phoneNumber.includes("+")) formik.values.phoneNumber = formik.values.phoneNumber.substr(1)
        employerService.updatePhoneNumber(employer.id, formik.values.phoneNumber)
            .then(r => lastUpdAct(r, "Sent", "phoneNumber", r.data.data.employerUpdate.phoneNumber))
            .catch(handleCatch)
    }

    const handleDeleteClick = () => setDeletePopupOpen(true)

    const deleteAccount = () => {
        userService.deleteById(employer.id)
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
            case "emailAndWebsite":
                return (
                    <Segment basic>
                        <div>
                            <Form onSubmit={handleEmailAndWebsiteSubmit}>
                                <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                                       value={formik.values.email} onBlur={formik.handleBlur} name="email"
                                       onChange={formik.handleChange}/>
                            </Form>
                        </div>
                        <div>
                            <Form onSubmit={handleEmailAndWebsiteSubmit}>
                                <Input icon="world" iconPosition="left" placeholder="Website" type="website"
                                       value={formik.values.website} onBlur={formik.handleBlur} name="website"
                                       onChange={formik.handleChange} style={{marginTop: 10}}/>
                            </Form>
                        </div>
                        <Button color="blue" onClick={handleEmailAndWebsiteSubmit} style={{marginTop: 10, marginBottom: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </Segment>
                )
            case "password":
                return (
                    isAuthenticated ?
                        <Segment basic>
                            <div>
                                <Form onSubmit={handlePasswordSubmit}>
                                    <Input icon="lock" iconPosition="left" placeholder="New Password"
                                           type="password" value={formik.values.password}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           name="password"/>
                                </Form>
                            </div>
                            <div>
                                <Form style={{marginTop: 10}} onSubmit={handlePasswordSubmit}>
                                    <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                           type="password" value={formik.values.passwordRepeat}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           name="passwordRepeat"/>
                                </Form>
                            </div>
                            <Button color="blue" style={{marginTop: 10, marginBottom: 10}} icon={"save"}
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
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}} icon={"id card outline"}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Segment>

                )
            case "compName":
                return (
                    <Segment basic>
                        <div>
                            <Input icon="building" iconPosition="left" placeholder="Company Name"
                                   type="text" value={formik.values.companyName}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="companyName"/>
                        </div>
                        <Button color="blue" onClick={handleCompanyNameSubmit} style={{marginTop: 10, marginBottom: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </Segment>
                )
            case "phone":
                return (
                    <Segment basic>
                        <div>
                            <Input icon="phone" iconPosition="left" placeholder="Phone Number"
                                   type="phone" value={formik.values.phoneNumber}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="phoneNumber"/>
                        </div>
                        <Button color="blue" onClick={handlePhoneNumberSubmit} style={{marginTop: 10, marginBottom: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
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
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}} icon={"id card outline"}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Segment>
                )
            default:
                return null
        }
    }

    function mainInfos() {
        return (
            <Grid stackable>
                <Grid.Column width={7}>
                    <Popup
                        trigger={
                            employer.updateVerified !== null && !employer.updateVerified ?
                                <Label attached={"top right"} circular>
                                    <Icon name={"wait"} style={{marginRight: 2}} color={"orange"}/> Pending
                                </Label> : null
                        }
                        content={"Updates are being checked"}
                        style={{borderRadius: 15, opacity: 0.8, color: "rgb(17,17,17)"}}
                        position={"bottom center"} on={"hover"}
                        mouseEnterDelay={300} mouseLeaveDelay={150}
                    />

                    <Item.Group>
                        <Item>
                            <Item.Image
                                src={"https://www.linkpicture.com/q/pngkey.com-black-building-icon-png-3232548.png"}
                                size={"small"}/>
                            <Item.Content verticalAlign={"middle"}>
                                <Item.Header as='a' content={<Header content={employer?.companyName}/>}/>
                                <Item.Meta><Icon name={"phone"}/> {employer.phoneNumber}</Item.Meta>
                                <Item.Description><Icon name={"envelope"}/> {employer?.email}</Item.Description>
                                <Item.Description><Icon name={"world"}/> {employer?.website}</Item.Description>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
            </Grid>
        )
    }

    if (String(userProps.userType) !== "employer") return <Header content={"Sorry, You Do Not Have Access Here"}/>

    return (
        <div>
            {areYouSurePopup()}
            {mainInfos()}
            <Grid stackable>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary>
                        <Menu.Item
                            color={"blue"} name='emailAndWebsite' content={"Email & Website"} icon={"connectdevelop"}
                            active={activeItem === 'emailAndWebsite'}
                            onClick={() => handleMenuItemClick("emailAndWebsite")}
                        />
                        <Menu.Item
                            color={"teal"} name='Password' icon={"lock"}
                            active={activeItem === 'password'}
                            onClick={() => handleMenuItemClick("password")}
                        />
                        <Menu.Item
                            color={"purple"} name='Company Name' icon={"building"}
                            active={activeItem === 'compName'}
                            onClick={() => handleMenuItemClick("compName")}
                        />
                        <Menu.Item
                            color={"yellow"} name='Phone Number' icon={"phone"}
                            active={activeItem === 'phone'}
                            onClick={() => handleMenuItemClick("phone")}
                        />
                        <Menu.Item
                            color={"red"} icon={"warning sign"} name='Danger Zone'
                            active={activeItem === 'danger'}
                            onClick={() => handleMenuItemClick("danger")}
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
