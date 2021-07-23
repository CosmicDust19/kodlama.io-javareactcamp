import {
    Header, Grid, Menu, Input, Icon, Form, Button,
    Item, Modal, Image, Label, Popup
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmail, changeEmployerUpdate, signOut} from "../../store/actions/userActions";
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

    const refreshPage = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleCatch = (error) => {
        toast.warning("An error has occurred")
        console.log(error.response)
        refreshPage()
    }

    const editPhone = () => {
        formik.values.phoneNumber = formik.values.phoneNumber.replace(/[-\s()]/g, "")
        let right = formik.values.phoneNumber.substr(formik.values.phoneNumber.length - 10)
        right = ` ${right.substr(0, 3)} ${right.substr(3, 3)} ${right.substr(6, 2)} ${right.substr(8, 2)}`
        let left = formik.values.phoneNumber.substr(0, formik.values.phoneNumber.length - 10)
        if (left.length === 2 && left.charAt(0) === "+") left = left.substr(1)
        if (left.length > 1 && left.charAt(0) !== "+") left = `+${left}`
        if (left.length === 0) left = "0"
        formik.values.phoneNumber = left.concat(right)
        formik.setFieldValue("phoneNumber", formik.values.phoneNumber)
    }

    const handleItemClick = (activeItem) => {
        setActiveItem(activeItem)
    }

    const handleEmailAndWebsiteSubmit = () => {
        if (!formik.values.email || !formik.values.website) {
            toast.warning("Please enter an email and a website")
            return;
        }
        formik.values.email = formik.values.email.trim()
        formik.values.website = formik.values.website.trim()
        if (user.email === formik.values.email && user.website === formik.values.website) {
            toast.warning("You are already using this email and website")
            return;
        }
        if (user.employerUpdate && user.employerUpdate.email === formik.values.email && user.employerUpdate.website === formik.values.website) {
            toast.warning("We are already checking this email and website")
            return;
        }
        if (formik.values.email.length < 4 || formik.values.email.length > 100 ||
            !/^\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+$/.test(formik.values.email)) {
            toast.warning("Invalid email format")
            return;
        }
        if (formik.values.website.length > 200 || !/[\w\d-_?%$+#!^><|`é]+(\.[\w\d-_?%$+#!^><|`é]+)+/.test(formik.values.website)) {
            toast.warning("Invalid website format")
            return;
        }
        const emailDomain = formik.values.email.substr(formik.values.email.indexOf("@") + 1)
        if (!formik.values.website.includes(emailDomain)) {
            toast.warning("E-mail and website should have the same domain")
            return;
        }
        userService.existsByEmail(formik.values.email).then(r => {
            if (!r.data.data) {
                employerService.existsByWebsite(formik.values.website).then(r => {
                    if (!r.data.data) {
                        employerService.updateEmailAndWebsite(formik.values.email, formik.values.website).then(() => {
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
                        }).catch(handleCatch)
                    } else toast.warning("This website in use")
                }).catch(handleCatch)
            } else toast.warning("This email in use")
        }).catch(handleCatch)
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
        employerService.existsByEmailAndPassword(user?.email, formik.values.currentPassword).then((r) => {
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
            toast.warning("Password should be between 6 - 20 long")
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
        employerService.updatePassword(user.id, formik.values.password, formik.values.currentPassword).then(r => {
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

    const handleCompanyNameSubmit = () => {
        if (!formik.values.companyName) {
            toast.warning("Please enter a company name")
            return;
        }
        formik.values.companyName = formik.values.companyName.trim()
        if (formik.values.companyName.length > 100) {
            toast.warning("Company name cannot be longer than 100 character")
            return;
        }
        if (formik.values.companyName === user.companyName) {
            toast.warning("You are already using this company name")
            return;
        }
        if (user.employerUpdate && formik.values.companyName === user.employerUpdate.companyName) {
            toast.warning("Already we are checking this company name")
            return;
        }
        employerService.existsByCompanyName(formik.values.companyName).then(r => {
            console.log(r)
            if (r.data.success) {
                if (!r.data.data) {
                    employerService.updateCompanyName(user.id, formik.values.companyName).then(r => {
                        console.log(r)
                        if (r.data.success) {
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
                        } else toast.warning("A problem has occurred while sending update request")
                    }).catch(reason => {
                        console.log(reason)
                        toast.warning("A problem has occurred while sending update request")
                    })
                } else toast.warning("This company name in use")
            } else toast.warning("A problem has occurred while checking if the company name is in use")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred while checking if the company name is in use")
        })

    }

    const handlePhoneNumberSubmit = () => {
        if (!formik.values.phoneNumber) {
            toast.warning("Please enter a phone number")
            return;
        }
        formik.values.phoneNumber = formik.values.phoneNumber.trim()
        if (formik.values.phoneNumber === user.phoneNumber) {
            toast.warning("You are already using this phone number")
            return;
        }
        if (user.employerUpdate && formik.values.phoneNumber === user.employerUpdate.phoneNumber) {
            toast.warning("We are already checking this phone number")
            return;
        }
        if (formik.values.phoneNumber.length < 10 || formik.values.phoneNumber.length > 22 ||
            !/^((\+?\d{1,3})?0?[\s-]?)?\(?0?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(formik.values.phoneNumber)) {
            toast.warning("We are accepting only turkey phone number format for now 😓")
            return;
        }
        editPhone()
        employerService.updatePhoneNumber(user.id, formik.values.phoneNumber).then(r => {
            console.log(r)
            if (r.data.success) {
                if (user.employerUpdate === null) {
                    dispatch(changeEmployerUpdate(
                        {
                            updateId: r.data.data, email: user.email, companyName: user.companyName,
                            website: user.website, phoneNumber: formik.values.phoneNumber
                        }))
                } else {
                    const oldEmpUpd = user.employerUpdate
                    dispatch(changeEmployerUpdate(
                        {
                            updateId: oldEmpUpd.updateId, email: oldEmpUpd.email, companyName: oldEmpUpd.companyName,
                            website: oldEmpUpd.website, phoneNumber: formik.values.phoneNumber
                        }))
                }
                toast("Sent")
            } else toast.warning("A problem has occurred while sending update request")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred while sending update request")
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
                        /*employerService.deleteAccount(user.id).then(r => {
                            console.log(r)
                            dispatch(signOut())
                            history.push("/")
                            toast("Good Bye 👋")
                        }).finally(() => {
                            setDeletePopupOpen(false)
                        })*/
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
                            !user.updateVerified ?
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
                            name='emailAndWebsite' content={"Email & Website"} icon={"connectdevelop"}
                            active={activeItem === 'emailAndWebsite'}
                            onClick={() => handleItemClick("emailAndWebsite")}
                        />
                        <Menu.Item
                            name='Password' icon={"lock"}
                            active={activeItem === 'password'}
                            onClick={() => handleItemClick("password")}
                        />
                        <Menu.Item
                            name='Company Name' icon={"building"}
                            active={activeItem === 'compName'}
                            onClick={() => handleItemClick("compName")}
                        />
                        <Menu.Item
                            name='Phone Number' icon={"phone"}
                            active={activeItem === 'phone'}
                            onClick={() => handleItemClick("phone")}
                        />
                        <Menu.Item
                            color={"red"} icon={"warning sign"}
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
