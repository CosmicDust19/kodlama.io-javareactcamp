import {Button, Form, Grid, Header, Icon, Input, Item, Label, Menu, Modal, Popup} from "semantic-ui-react";
import React, {useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmployerUpdate, signOut} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";
import EmployerService from "../../services/employerService";

export function EmployerManageAccount() {

    const userService = new UserService()
    const employerService = new EmployerService()

    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)

    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState('email')
    const [refresh, setRefresh] = useState(true);

    const formik = useFormik({
        initialValues: {
            email: "", website: "", password: "", passwordRepeat: "", currentPassword: "",
            companyName: "", phoneNumber: "",
        }
    });

    const refreshComponent = () => {
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

    const getEditedPhone = (phoneNumber) => {
        phoneNumber = phoneNumber.replace(/[-\s()]/g, "")
        let body = phoneNumber.substr(phoneNumber.length - 10)
        body = ` ${body.substr(0, 3)} ${body.substr(3, 3)} ${body.substr(6, 2)} ${body.substr(8, 2)}`
        let countryCode = phoneNumber.substr(0, phoneNumber.length - 10)
        if (countryCode.length > 0 && countryCode.charAt(0) !== "+") countryCode = `+${countryCode}`
        if (countryCode.length === 2 && countryCode.charAt(0) === "+" && countryCode.charAt(1) === "0") countryCode = countryCode.substr(1)
        if (countryCode.length === 0) countryCode = "0"
        phoneNumber = countryCode.concat(body)
        return phoneNumber
    }

    const handleMenuItemClick = (activeItem) => {
        setActiveItem(activeItem)
    }

    const handleEmailAndWebsiteSubmit = () => {
        formik.values.email = formik.values.email.trim()
        formik.values.website = formik.values.website.trim()
        if (!formik.values.email || !formik.values.website) {
            toast.warning("Please enter an email and a website")
            return;
        }
        employerService.updateEmailAndWebsite(user.id, formik.values.email, formik.values.website).then(r => {
            if (user.employerUpdate === null) {
                dispatch(changeEmployerUpdate(
                    {
                        updateId: r.data.data,
                        email: formik.values.email,
                        companyName: user.companyName,
                        website: formik.values.website,
                        phoneNumber: user.phoneNumber
                    }))
            } else {
                const oldEmpUpd = user.employerUpdate
                dispatch(changeEmployerUpdate(
                    {
                        updateId: oldEmpUpd.updateId,
                        email: formik.values.email,
                        companyName: oldEmpUpd.companyName,
                        website: formik.values.website,
                        phoneNumber: oldEmpUpd.phoneNumber
                    }))
            }
            toast("Sent")
            refreshComponent()
        }).catch(handleCatch)
    }

    const handleCurrentPasswordSubmit = () => {
        if (!formik.values.currentPassword) return;
        userService.existsByEmailAndPW(user?.email, formik.values.currentPassword).then((r) => {
            console.log(r)
            if (r.data.data) {
                setIsAuthenticated(true)
                toast("Authentication Successful")
            } else toast.warning("Wrong password!")
        }).catch(handleCatch)
    }

    const handlePasswordSubmit = () => {
        if (formik.values.password !== formik.values.passwordRepeat) {
            toast.warning("Passwords are not matching")
            return;
        }
        userService.updatePassword(user.id, formik.values.password, formik.values.currentPassword).then(r => {
            console.log(r)
            toast("Saved")
            formik.values.currentPassword = formik.values.password
            formik.setFieldValue("currentPassword", formik.values.password)
        }).catch(handleCatch)
    }

    const handleCompanyNameSubmit = () => {
        formik.values.companyName = formik.values.companyName.trim()
        if (!formik.values.companyName) {
            toast.warning("Please enter a company name")
            return;
        }
        employerService.updateCompanyName(user.id, formik.values.companyName).then(r => {
            console.log(r)
            if (user.employerUpdate === null) {
                dispatch(changeEmployerUpdate(
                    {
                        updateId: r.data.data,
                        email: user.email,
                        companyName: formik.values.companyName,
                        website: user.website,
                        phoneNumber: user.phoneNumber
                    }))
            } else {
                const oldEmpUpd = user.employerUpdate
                dispatch(changeEmployerUpdate(
                    {
                        updateId: oldEmpUpd.updateId,
                        email: oldEmpUpd.email,
                        companyName: formik.values.companyName,
                        website: oldEmpUpd.website,
                        phoneNumber: oldEmpUpd.phoneNumber
                    }))
            }
            toast("Sent")
            refreshComponent()
        }).catch(handleCatch)
    }

    const handlePhoneNumberSubmit = () => {
        formik.values.phoneNumber = formik.values.phoneNumber.trim()
        if (!formik.values.phoneNumber) {
            toast.warning("Please enter a phone number")
            return;
        }
        const editedPhoneNumber = getEditedPhone(formik.values.phoneNumber)
        formik.setFieldValue("phoneNumber", editedPhoneNumber)
        formik.values.phoneNumber = editedPhoneNumber
        employerService.updatePhoneNumber(user.id, formik.values.phoneNumber).then(r => {
            console.log(r)
            if (user.employerUpdate === null) {
                dispatch(changeEmployerUpdate(
                    {
                        updateId: r.data.data,
                        email: user.email,
                        companyName: user.companyName,
                        website: user.website,
                        phoneNumber: formik.values.phoneNumber
                    }))
            } else {
                const oldEmpUpd = user.employerUpdate
                dispatch(changeEmployerUpdate(
                    {
                        updateId: oldEmpUpd.updateId,
                        email: oldEmpUpd.email,
                        companyName: oldEmpUpd.companyName,
                        website: oldEmpUpd.website,
                        phoneNumber: formik.values.phoneNumber
                    }))
            }
            toast("Sent")
            refreshComponent()
        }).catch(handleCatch)
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
                        userService.deleteById(user.id).then(r => {
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
            case "emailAndWebsite":
                return (
                    <div>
                        <Form onSubmit={handleEmailAndWebsiteSubmit}>
                            <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                                   value={formik.values.email} onBlur={formik.handleBlur} name="email"
                                   onChange={formik.handleChange}/>
                        </Form>
                        <Form onSubmit={handleEmailAndWebsiteSubmit}>
                            <Input icon="world" iconPosition="left" placeholder="Website" type="website"
                                   value={formik.values.website} onBlur={formik.handleBlur} name="website"
                                   onChange={formik.handleChange} style={{marginTop: 10}}/>
                        </Form>
                        <Button color="blue" onClick={handleEmailAndWebsiteSubmit} style={{marginTop: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </div>
                )
            case "password":
                return (
                    isAuthenticated ?
                        <div>
                            <Form onSubmit={handlePasswordSubmit}>
                                <Input icon="lock" iconPosition="left" placeholder="New Password"
                                       type="password" value={formik.values.password}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="password"/>
                            </Form>
                            <Form style={{marginTop: 10}} onSubmit={handlePasswordSubmit}>
                                <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                       type="password" value={formik.values.passwordRepeat}
                                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                                       name="passwordRepeat"/>
                            </Form>
                            <Button color="blue" style={{marginTop: 10}} icon={"save"}
                                    onClick={handlePasswordSubmit} content={"Save"}>
                            </Button>
                        </div> :
                        <Form>
                            <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/>
                            <Button color="olive" style={{marginLeft: 10}} icon={"id card outline"}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}>
                            </Button>
                        </Form>

                )
            case "compName":
                return (
                    <Form>
                        <Input icon="building" iconPosition="left" placeholder="Company Name"
                               type="text" value={formik.values.companyName}
                               onChange={formik.handleChange} onBlur={formik.handleBlur}
                               name="companyName"/>
                        <Button color="blue" onClick={handleCompanyNameSubmit} style={{marginLeft: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </Form>
                )
            case "phone":
                return (
                    <Form>
                        <Input icon="phone" iconPosition="left" placeholder="Phone Number"
                               type="phone" value={formik.values.phoneNumber}
                               onChange={formik.handleChange} onBlur={formik.handleBlur}
                               name="phoneNumber"/>
                        <Button color="blue" onClick={handlePhoneNumberSubmit} style={{marginLeft: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
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
                            <Button color="olive" style={{marginLeft: 10}} icon={"id card outline"}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Form>
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
                            user.updateVerified !== null && !user.updateVerified ?
                                <Label attached={"top right"} circular>
                                    <Icon name={"wait"} style={{marginRight: 2}} color={"orange"}/> Pending
                                </Label> : null
                        }
                        content={"Updates are being checked"}
                        style={{
                            borderRadius: 15,
                            opacity: 0.8,
                            color: "rgb(17,17,17)"
                        }}
                        position={"bottom center"}
                        on={"hover"}

                        mouseEnterDelay={300}
                        mouseLeaveDelay={150}
                    />

                    <Item.Group unstackable>
                        <Item>
                            <Item.Image
                                src={"https://www.linkpicture.com/q/pngkey.com-black-building-icon-png-3232548.png"}
                                size={"small"}/>
                            <Item.Content verticalAlign={"middle"}>
                                <Item.Header as='a'>
                                    <Header>
                                        {user?.companyName}
                                    </Header></Item.Header>
                                <Item.Meta><Icon name={"phone"}/> {user.phoneNumber}</Item.Meta>
                                <Item.Description>
                                    <Icon name={"envelope"}/> {user?.email}
                                </Item.Description>
                                <Item.Description>
                                    <Icon name={"world"}/> {user?.website}
                                </Item.Description>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
            </Grid>
        )
    }

    if (String(userProps.userType) !== "employer") {
        return (
            <Header>
                Sorry, You Do Not Have Access Here
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
                            color={"red"} icon={"warning sign"}
                            name='Danger Zone'
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
