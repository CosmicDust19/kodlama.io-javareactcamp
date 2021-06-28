import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import * as Yup from "yup";
import {Button, Form, Grid, Header, Icon, Message, Segment, Popup, Input} from "semantic-ui-react";
import CandidateService from "../services/candidateService";
import EmployerService from "../services/employerService";
import SystemEmployeeService from "../services/systemEmployeeService";
import UserService from "../services/userService";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {login} from "../store/actions/userActions";
import {toast} from "react-toastify";

const userService = new UserService()
const candidateService = new CandidateService()
const employerService = new EmployerService()
const systemEmployeeService = new SystemEmployeeService()

const errorPopUpStyle = {
    borderRadius: 0,
    opacity: 0.7,
    color: "rgb(201,201,201)"
}

export function CandidateSignUp() {

    const dispatch = useDispatch();

    const handleLogin = (user) => {
        dispatch(login(user, "candidate"))
    }

    let timeout;

    const [fNState, setFNState] = useState({isFNOpen: false})
    const [lNState, setLNState] = useState({isLNOpen: false})
    const [eMState, setEMState] = useState({isEMOpen: false})
    const [pWState, setPWState] = useState({isPWOpen: false})
    const [pWRState, setPWRState] = useState({isPWROpen: false})
    const [nIDState, setNIDState] = useState({isNIDOpen: false})
    const [bYState, setBYState] = useState({isBYOpen: false})

    const handleFNOpen = () => {
        setFNState({isFNOpen: true})
        timeout = setTimeout(() => {
            setFNState({isFNOpen: false})
        }, 5000)
    }
    const handleFNClose = () => {
        setFNState({isFNOpen: false})
        clearTimeout(timeout)
    }

    const handleLNOpen = () => {
        setLNState({isLNOpen: true})
        timeout = setTimeout(() => {
            setLNState({isLNOpen: false})
        }, 5100)
    }
    const handleLNClose = () => {
        setLNState({isLNOpen: false})
        clearTimeout(timeout)
    }

    const handleEMOpen = () => {
        setEMState({isEMOpen: true})
        timeout = setTimeout(() => {
            setEMState({isEMOpen: false})
        }, 5200)
    }
    const handleEMClose = () => {
        setEMState({isEMOpen: false})
        clearTimeout(timeout)
    }

    const handlePWOpen = () => {
        setPWState({isPWOpen: true})
        timeout = setTimeout(() => {
            setPWState({isPWOpen: false})
        }, 5300)
    }
    const handlePWClose = () => {
        setPWState({isPWOpen: false})
        clearTimeout(timeout)
    }

    const handlePWROpen = () => {
        setPWRState({isPWROpen: true})
        timeout = setTimeout(() => {
            setPWRState({isPWROpen: false})
        }, 5400)
    }
    const handlePWRClose = () => {
        setPWRState({isPWROpen: false})
        clearTimeout(timeout)
    }

    const handleNIDOpen = () => {
        setNIDState({isNIDOpen: true})
        timeout = setTimeout(() => {
            setNIDState({isNIDOpen: false})
        }, 5500)
    }
    const handleNIDClose = () => {
        setNIDState({isNIDOpen: false})
        clearTimeout(timeout)
    }

    const handleBYOpen = () => {
        setBYState({isBYOpen: true})
        timeout = setTimeout(() => {
            setBYState({isBYOpen: false})
        }, 5600)
    }
    const handleBYClose = () => {
        setBYState({isBYOpen: false})
        clearTimeout(timeout)
    }

    const candidateSignUpSchema = Yup.object().shape({
        firstName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        lastName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        email: Yup.string().required("required").matches(/\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+/, "not a valid e-mail format"),
        password: Yup.string().required("required").min(6, "min 6 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "not matching").required("required"),
        nationalityId: Yup.string().required("required").matches(/\d{11}/, "not a valid nationality id").max(11, "not a valid nationality id"),
        birthYear: Yup.number().required("required").min(1900, "enter your real birth year").max(2030, "enter your real birth year"),
    });

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            birthYear: "", email: "", firstName: "", lastName: "",
            nationalityId: "", password: "", passwordRepeat: "",
        },
        validationSchema: candidateSignUpSchema,
        onSubmit: (values) => {
            let counter = 0
            if (isEmailInUse) {
                toast.warning("This email in use!")
                counter++
            }
            if (isNationalityIdInUse) {
                toast.warning("This nationality id in use!")
                counter++
            }
            if (counter === 0){
                candidateService.add(values).then((result) => console.log(result.data.data))
                toast("Welcome")
                let candidate = {...values}
                candidate.password = null
                candidate.passwordRepeat = null
                handleLogin(candidate)
                history.push("/")
            }
        }
    });

    const [isEmailInUse, setIsEmailInUse] = useState([]);

    useEffect(() => {
        userService.existsByEmail(formik.values.email).then((result) => setIsEmailInUse(result.data.data));
    }, [formik.values.email]);

    const [isNationalityIdInUse, setIsNationalityIdInUse] = useState([]);

    useEffect(() => {
        candidateService.existsByNationalityId(formik.values.nationalityId).then((result) => setIsNationalityIdInUse(result.data.data));
    }, [formik.values.nationalityId]);

    const handleChangeSemantic = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const triggerAllErrorPopUps = () => {
        if (formik.errors.firstName) handleFNOpen()
        if (formik.errors.lastName) handleLNOpen()
        if (formik.errors.email) handleEMOpen()
        if (formik.errors.password) handlePWOpen()
        if (formik.errors.passwordRepeat) handlePWROpen()
        if (formik.errors.nationalityId) handleNIDOpen()
        if (formik.errors.birthYear) handleBYOpen()
    }

    return (
        <div>
            <Header color="purple" textAlign="center">
                Sign Up
            </Header>
            <Grid centered stackable padded>
                <Grid.Column width={6}>
                    <Segment placeholder color={"purple"} padded textAlign={"center"}>
                        <Form  size="large" onSubmit={formik.handleSubmit} inverted>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="user" iconPosition="left" placeholder="First Name"
                                                   type="text"
                                                   value={formik.values.firstName} name="firstName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("firstName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.firstName) ?
                                            formik.errors.firstName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={fNState.isFNOpen}
                                        onClose={handleFNClose} onOpen={handleFNOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="user" iconPosition="left" placeholder="Last Name"
                                                   type="text"
                                                   value={formik.values.lastName} name="lastName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("lastName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.lastName) ?
                                            formik.errors.lastName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={lNState.isLNOpen}
                                        onClose={handleLNClose} onOpen={handleLNOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="mail" iconPosition="left" placeholder="E-mail"
                                                   type="email"
                                                   value={formik.values.email} onChange={(event, data) =>
                                                handleChangeSemantic("email", data.value)}
                                                   onBlur={formik.handleBlur} name="email"/>
                                        }
                                        content={(formik.errors.email) ?
                                            formik.errors.email :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={eMState.isEMOpen}
                                        onClose={handleEMClose} onOpen={handleEMOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                                   type="password"
                                                   value={formik.values.password} onChange={(event, data) =>
                                                handleChangeSemantic("password", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="password"/>
                                        }
                                        content={(formik.errors.password) ?
                                            formik.errors.password :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={pWState.isPWOpen}
                                        onClose={handlePWClose} onOpen={handlePWOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password Repeat"
                                                   type="password"
                                                   value={formik.values.passwordRepeat} onChange={(event, data) =>
                                                handleChangeSemantic("passwordRepeat", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="passwordRepeat"/>
                                        }
                                        content={(formik.errors.passwordRepeat) ?
                                            formik.errors.passwordRepeat :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={pWRState.isPWROpen}
                                        onClose={handlePWRClose} onOpen={handlePWROpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="id card" iconPosition="left" placeholder="Nationality Id"
                                                   type="text"
                                                   value={formik.values.nationalityId} name="nationalityId"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("nationalityId", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.nationalityId) ?
                                            formik.errors.nationalityId :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={nIDState.isNIDOpen}
                                        onClose={handleNIDClose} onOpen={handleNIDOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="calendar check" iconPosition="left" placeholder="Birth Year"
                                                   type="number"
                                                   error={Boolean(formik.errors.birthYear)}
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("birthYear", data.value)}
                                                   value={formik.values.birthYear}
                                                   onBlur={formik.handleBlur}
                                                   name="birthYear"/>
                                        }
                                        content={(formik.errors.birthYear) ?
                                            formik.errors.birthYear :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={bYState.isBYOpen}
                                        onClose={handleBYClose} onOpen={handleBYOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Segment textAlign="center" basic>
                                <Button animated="fade" type="submit" size="big" color="purple"
                                        onClick={() => {
                                            triggerAllErrorPopUps()
                                        }}>
                                    <Button.Content hidden><Icon name='signup'/></Button.Content>
                                    <Button.Content visible>Sign Up</Button.Content>
                                </Button>
                            </Segment>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>

            <Grid textAlign="center">
                <Grid.Column width={10}>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Already signed up?&nbsp;<Link to={"/login"}>Login Here</Link>&nbsp;instead.
                    </Message>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Are you an employer ?&nbsp;<Link to={"/EmployerSignUp"}>Click Here</Link>&nbsp;to sign up as an
                        employer.
                    </Message>
                </Grid.Column>
            </Grid>

        </div>
    );
}

export function EmployerSignUp() {

    const dispatch = useDispatch();

    const handleLogin = (user) => {
        dispatch(login(user, "employer"))
    }

    let timeout;

    const [cNState, setCNState] = useState({isCNOpen: false})
    const [eMState, setEMState] = useState({isEMOpen: false})
    const [pWState, setPWState] = useState({isPWOpen: false})
    const [pWRState, setPWRState] = useState({isPWROpen: false})
    const [wSState, setWSState] = useState({isWSOpen: false})
    const [pNState, setPNState] = useState({isPNOpen: false})

    const handleCNOpen = () => {
        setCNState({isCNOpen: true})
        timeout = setTimeout(() => {
            setCNState({isCNOpen: false})
        }, 6300)
    }
    const handleCNClose = () => {
        setCNState({isCNOpen: false})
        clearTimeout(timeout)
    }

    const handleEMOpen = () => {
        setEMState({isEMOpen: true})
        timeout = setTimeout(() => {
            setEMState({isEMOpen: false})
        }, 6400)
    }
    const handleEMClose = () => {
        setEMState({isEMOpen: false})
        clearTimeout(timeout)
    }

    const handlePWOpen = () => {
        setPWState({isPWOpen: true})
        timeout = setTimeout(() => {
            setPWState({isPWOpen: false})
        }, 6500)
    }
    const handlePWClose = () => {
        setPWState({isPWOpen: false})
        clearTimeout(timeout)
    }

    const handlePWROpen = () => {
        setPWRState({isPWROpen: true})
        timeout = setTimeout(() => {
            setPWRState({isPWROpen: false})
        }, 6600)
    }
    const handlePWRClose = () => {
        setPWRState({isPWROpen: false})
        clearTimeout(timeout)
    }

    const handleWSOpen = () => {
        setWSState({isWSOpen: true})
        timeout = setTimeout(() => {
            setWSState({isWSOpen: false})
        }, 6700)
    }
    const handleWSClose = () => {
        setWSState({isWSOpen: false})
        clearTimeout(timeout)
    }

    const handlePNOpen = () => {
        setPNState({isPNOpen: true})
        timeout = setTimeout(() => {
            setPNState({isPNOpen: false})
        }, 6800)
    }
    const handlePNClose = () => {
        setPNState({isPNOpen: false})
        clearTimeout(timeout)
    }

    const employerSignUpSchema = Yup.object().shape({
        companyName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        email: Yup.string().required("required").matches(/\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+/, "not a valid e-mail format"),
        password: Yup.string().required("required").min(6, "min 6 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "not matching").required("required"),
        website: Yup.string().required("required").matches(/[\w\d-_?%$+#!^><|`é]+(\.[\w\d-_?%$+#!^><|`é]+)+/, "not a valid web site format"),
        phoneNumber: Yup.string().required("required").matches(/((\+\d{1,3})?0?[\s-]?)?\(?0?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/, "not a valid phone number format"),
    });

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            companyName: "", email: "", password: "", passwordRepeat: "",
            website: "", phoneNumber: ""
        },
        validationSchema: employerSignUpSchema,
        onSubmit: (values) => {
            let counter = 0
            if (isEmailInUse) {
                toast.warning("This email in use!")
                counter++
            }
            if (isCompanyNameInUse) {
                toast.warning("This company name in use!")
                counter++
            }
            if (isWebsiteInUse) {
                toast.warning("This website in use!")
                counter++
            }
            if (!values.website.includes(values.email.substring(values.email.indexOf("@") + 1, values.email.length))) {
                toast.warning("Your website and email are incompatible, They should have the same domain!", {
                    autoClose: 5000,

                })
                counter++
            }
            if(counter === 0 ){
                employerService.add(values).then((result) => console.log(result.data.data))
                toast("Welcome")
                let employer = {...values}
                employer.password = null
                employer.passwordRepeat = null
                handleLogin(employer)
                history.push("/")
            }
        }
    });

    const [isEmailInUse, setIsEmailInUse] = useState([]);

    useEffect(() => {
        userService.existsByEmail(formik.values.email).then((result) => setIsEmailInUse(result.data.data));
    }, [formik.values.email]);

    const [isCompanyNameInUse, setIsCompanyNameInUse] = useState([]);

    useEffect(() => {
        employerService.existsByCompanyName(formik.values.companyName).then((result) => setIsCompanyNameInUse(result.data.data));
    }, [formik.values.companyName]);

    const [isWebsiteInUse, setIsWebsiteInUse] = useState([]);

    useEffect(() => {
        employerService.existsByWebsite(formik.values.website).then((result) => setIsWebsiteInUse(result.data.data));
    }, [formik.values.website]);

    const handleChangeSemantic = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const triggerAllErrorPopUps = () => {
        if (formik.errors.companyName) handleCNOpen()
        if (formik.errors.email) handleEMOpen()
        if (formik.errors.password) handlePWOpen()
        if (formik.errors.passwordRepeat) handlePWROpen()
        if (formik.errors.website) handleWSOpen()
        if (formik.errors.phoneNumber) handlePNOpen()
    }

    return (
        <div>
            <Header color="purple" textAlign="center">
                Sign Up
            </Header>
            <Grid centered stackable padded>
                <Grid.Column width={6}>
                    <Segment placeholder color={"purple"} padded textAlign={"center"}>
                        <Form size="large" onSubmit={formik.handleSubmit} inverted>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="building outline" iconPosition="left"
                                                   placeholder="Company Name"
                                                   type="text"
                                                   value={formik.values.companyName} name="companyName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("companyName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.companyName) ?
                                            formik.errors.companyName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={cNState.isCNOpen}
                                        onClose={handleCNClose} onOpen={handleCNOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="mail" iconPosition="left" placeholder="E-mail"
                                                   type="email"
                                                   value={formik.values.email} onChange={(event, data) =>
                                                handleChangeSemantic("email", data.value)}
                                                   onBlur={formik.handleBlur} name="email"/>
                                        }
                                        content={(formik.errors.email) ?
                                            formik.errors.email :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={eMState.isEMOpen}
                                        onClose={handleEMClose} onOpen={handleEMOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                                   type="password"
                                                   value={formik.values.password} onChange={(event, data) =>
                                                handleChangeSemantic("password", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="password"/>
                                        }
                                        content={(formik.errors.password) ?
                                            formik.errors.password :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={pWState.isPWOpen}
                                        onClose={handlePWClose} onOpen={handlePWOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password Repeat"
                                                   type="password"
                                                   value={formik.values.passwordRepeat} onChange={(event, data) =>
                                                handleChangeSemantic("passwordRepeat", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="passwordRepeat"/>
                                        }
                                        content={(formik.errors.passwordRepeat) ?
                                            formik.errors.passwordRepeat :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={pWRState.isPWROpen}
                                        onClose={handlePWRClose} onOpen={handlePWROpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="world"
                                                   iconPosition="left"
                                                   placeholder="Web Site"
                                                   type="text"
                                                   value={formik.values.website} name="website"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("website", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.website) ?
                                            formik.errors.website :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={wSState.isWSOpen}
                                        onClose={handleWSClose} onOpen={handleWSOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="phone"
                                                   iconPosition="left"
                                                   placeholder="Phone Number"
                                                   type="text"
                                                   value={formik.values.phoneNumber}
                                                   name="phoneNumber"
                                                   onChange={(event, data) => {
                                                       handleChangeSemantic("phoneNumber", data.value)
                                                   }}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.phoneNumber) ? formik.errors.phoneNumber :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle}
                                        on='hover' open={pNState.isPNOpen}
                                        onClose={handlePNClose} onOpen={handlePNOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Segment textAlign="center" basic>
                                <Button animated="fade" type="submit" size="big" color="purple"
                                        onClick={() => {
                                            triggerAllErrorPopUps()
                                        }}>
                                    <Button.Content hidden><Icon name='signup'/></Button.Content>
                                    <Button.Content visible>Sign Up</Button.Content>
                                </Button>
                            </Segment>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>

            <Grid textAlign="center">
                <Grid.Column width={10}>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Already signed up?&nbsp;<Link to={"/login"}>Login Here</Link>&nbsp;instead.
                    </Message>
                </Grid.Column>
            </Grid>

        </div>
    );
}

export function SystemEmployeeSignUp() {

    const dispatch = useDispatch();

    const handleLogin = (user) => {
        dispatch(login(user, "systemEmployee"))
    }

    let timeout;

    const [fNState, setFNState] = useState({isFNOpen: false})
    const [lNState, setLNState] = useState({isLNOpen: false})
    const [eMState, setEMState] = useState({isEMOpen: false})
    const [pWState, setPWState] = useState({isPWOpen: false})
    const [pWRState, setPWRState] = useState({isPWROpen: false})

    const handleFNOpen = () => {
        setFNState({isFNOpen: true})
        timeout = setTimeout(() => {
            setFNState({isFNOpen: false})
        }, 6000)
    }
    const handleFNClose = () => {
        setFNState({isFNOpen: false})
        clearTimeout(timeout)
    }

    const handleLNOpen = () => {
        setLNState({isLNOpen: true})
        timeout = setTimeout(() => {
            setLNState({isLNOpen: false})
        }, 6000)
    }
    const handleLNClose = () => {
        setLNState({isLNOpen: false})
        clearTimeout(timeout)
    }

    const handleEMOpen = () => {
        setEMState({isEMOpen: true})
        timeout = setTimeout(() => {
            setEMState({isEMOpen: false})
        }, 7000)
    }
    const handleEMClose = () => {
        setEMState({isEMOpen: false})
        clearTimeout(timeout)
    }

    const handlePWOpen = () => {
        setPWState({isPWOpen: true})
        timeout = setTimeout(() => {
            setPWState({isPWOpen: false})
        }, 8000)
    }
    const handlePWClose = () => {
        setPWState({isPWOpen: false})
        clearTimeout(timeout)
    }

    const handlePWROpen = () => {
        setPWRState({isPWROpen: true})
        timeout = setTimeout(() => {
            setPWRState({isPWROpen: false})
        }, 8000)
    }
    const handlePWRClose = () => {
        setPWRState({isPWROpen: false})
        clearTimeout(timeout)
    }

    const systemEmployeeValidationSchema = Yup.object().shape({
        firstName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        lastName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        email: Yup.string().required("required").matches(/\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+/, "not a valid e-mail format"),
        password: Yup.string().required("required").min(6, "min 6 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "not matching").required("required"),
    });

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: "", firstName: "", lastName: ""
            , password: "", passwordRepeat: "",
        },
        validationSchema: systemEmployeeValidationSchema,
        onSubmit: (values) => {
            if(isEmailInUse){
                toast.warning("This email in use!")
            } else {
                systemEmployeeService.add(values).then((result) => console.log(result.data.data))
                toast("Welcome")
                let systemEmployee = {...values}
                systemEmployee.password = null
                systemEmployee.passwordRepeat = null
                handleLogin(systemEmployee)
                history.push("/")
            }
        }
    });

    const [isEmailInUse, setIsEmailInUse] = useState([]);

    useEffect(() => {
        userService.existsByEmail(formik.values.email).then((result) => setIsEmailInUse(result.data.data));
    }, [formik.values.email]);

    const handleChangeSemantic = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const triggerAllErrorPopUps = () => {
        if (formik.errors.firstName) handleFNOpen()
        if (formik.errors.lastName) handleLNOpen()
        if (formik.errors.email) handleEMOpen()
        if (formik.errors.password) handlePWOpen()
        if (formik.errors.passwordRepeat) handlePWROpen()
    }

    return (
        <div>
            <Header color="purple" textAlign="center">
                Sign Up
            </Header>
            <Grid centered stackable padded>
                <Grid.Column width={6}>
                    <Segment placeholder color={"purple"} padded textAlign={"center"}>
                        <Form size="large" onSubmit={formik.handleSubmit} inverted>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="user" iconPosition="left" placeholder="First Name"
                                                   type="text"
                                                   value={formik.values.firstName} name="firstName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("firstName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.firstName) ?
                                            formik.errors.firstName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='click' open={fNState.isCNOpen}
                                        onClose={handleFNClose} onOpen={handleFNOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="user" iconPosition="left" placeholder="Last Name"
                                                   type="text"
                                                   value={formik.values.lastName} name="lastName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("lastName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.lastName) ?
                                            formik.errors.lastName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='click' open={lNState.isLNOpen}
                                        onClose={handleLNClose} onOpen={handleLNOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="mail" iconPosition="left" placeholder="E-mail"
                                                   type="email"
                                                   value={formik.values.email} onChange={(event, data) =>
                                                handleChangeSemantic("email", data.value)}
                                                   onBlur={formik.handleBlur} name="email"/>
                                        }
                                        content={(formik.errors.email) ?
                                            formik.errors.email :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='click' open={eMState.isEMOpen}
                                        onClose={handleEMClose} onOpen={handleEMOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                                   type="password"
                                                   value={formik.values.password} onChange={(event, data) =>
                                                handleChangeSemantic("password", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="password"/>
                                        }
                                        content={(formik.errors.password) ?
                                            formik.errors.password :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='click' open={pWState.isPWOpen}
                                        onClose={handlePWClose} onOpen={handlePWOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password Repeat"
                                                   type="password"
                                                   value={formik.values.passwordRepeat} onChange={(event, data) =>
                                                handleChangeSemantic("passwordRepeat", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="passwordRepeat"/>
                                        }
                                        content={(formik.errors.passwordRepeat) ?
                                            formik.errors.passwordRepeat :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='click' open={pWRState.isPWROpen}
                                        onClose={handlePWRClose} onOpen={handlePWROpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Segment textAlign="center" basic>
                                <Button animated="fade" type="submit" size="big" color="purple"
                                        onClick={() => {
                                            triggerAllErrorPopUps()
                                        }}>
                                    <Button.Content hidden><Icon name='signup'/></Button.Content>
                                    <Button.Content visible>Sign Up</Button.Content>
                                </Button>
                            </Segment>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>

            <Grid textAlign="center">
                <Grid.Column width={10}>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Already signed up?&nbsp;<Link to={"/login"}>Login Here</Link>&nbsp;instead.
                    </Message>
                </Grid.Column>
            </Grid>

        </div>
    );
}
