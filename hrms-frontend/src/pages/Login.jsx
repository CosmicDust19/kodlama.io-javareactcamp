import React, {useEffect, useState} from "react";
import {Segment, Grid, Form, Button, Icon, Popup, Input, Header, Message} from "semantic-ui-react";
import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../store/actions/userActions";
import EmployerService from "../services/employerService";
import CandidateService from "../services/candidateService";
import SystemEmployeeService from "../services/systemEmployeeService";
import * as Yup from "yup";
import {useFormik} from "formik";
import {toast} from "react-toastify";

export default function Login() {

    const dispatch = useDispatch();

    const handleLogin = (user, userType) => {
        dispatch(login(user, userType))
    }

    let timeout;

    const [eMState, setEMState] = useState({isEMOpen: false})
    const [pWState, setPWState] = useState({isPWOpen: false})

    const handleEMOpen = () => {
        setEMState({isEMOpen: true})
        timeout = setTimeout(() => {
            setEMState({isEMOpen: false})
        }, 3000)
    }
    const handleEMClose = () => {
        setEMState({isEMOpen: false})
        clearTimeout(timeout)
    }

    const handlePWOpen = () => {
        setPWState({isPWOpen: true})
        timeout = setTimeout(() => {
            setPWState({isPWOpen: false})
        }, 3200)
    }
    const handlePWClose = () => {
        setPWState({isPWOpen: false})
        clearTimeout(timeout)
    }

    const errorPopUpStyle = {
        borderRadius: 0,
        opacity: 0.7,
        color: "rgb(201,201,201)"
    }

    const loginValidationSchema = Yup.object().shape({
        email: Yup.string().required("Please enter your e-mail").matches(/^\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+$/, "not a valid e-mail format"),
        password: Yup.string().required("Please enter your password")
    });

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: "", password: ""
        },
        validationSchema: loginValidationSchema,
        onSubmit: (values) => {

            if (values.password.length < 6) {
                toast.warning("Please check your email and password")
                return
            }

            if (candidate && candidate !== {}  ) {
                handleLogin(candidate, "candidate")
                history.push("/")
            } else if (employer &&  employer !== {}) {
                handleLogin(employer, "employer")
                history.push("/")
            } else if (systemEmployee && systemEmployee !== {}) {
                handleLogin(systemEmployee, "systemEmployee")
                history.push("/")
            } else {
                toast.warning("Please check your email and password")
                return
            }
            toast("Welcome", {
                autoClose: 1500,
                pauseOnHover: false,
            })
        }
    });

    const [candidate, setCandidate] = useState({});

    useEffect(() => {
        let candidateService = new CandidateService();
        candidateService.getByEmailAndPassword(formik.values.email, formik.values.password).then((result) => setCandidate(result.data.data));
    }, [formik.values.email, formik.values.password]);

    const [employer, setEmployer] = useState({});

    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getByEmailAndPassword(formik.values.email, formik.values.password).then((result) => setEmployer(result.data.data));
    }, [formik.values.email, formik.values.password]);

    const [systemEmployee, setSystemEmployee] = useState({});

    useEffect(() => {
        let systemEmployeeService = new SystemEmployeeService();
        systemEmployeeService.getByEmailAndPassword(formik.values.email, formik.values.password).then((result) => setSystemEmployee(result.data.data));
    }, [formik.values.email, formik.values.password]);

    const triggerAllErrorPopUps = () => {
        if (formik.errors.email) handleEMOpen()
        if (formik.errors.password) handlePWOpen()
    }

    return (
        <div>
            <Header color="yellow" textAlign="center">
                Login
            </Header>
            <Grid textAlign="center">
                <Grid.Column width="7">
                    <Segment placeholder color={"yellow"} padded textAlign={"center"}>
                        <Form size="large" onSubmit={formik.handleSubmit} inverted>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="mail" iconPosition="left" placeholder="E-mail"
                                                   type="email"
                                                   value={formik.values.email} onChange={formik.handleChange}
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
                                                   value={formik.values.password} onChange={formik.handleChange}
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

                            <Button animated="fade" type="submit" size="big" color="yellow"
                                    onClick={() => {
                                        triggerAllErrorPopUps()
                                    }}>
                                <Button.Content hidden><Icon name='sign in alternate'/></Button.Content>
                                <Button.Content visible>Login</Button.Content>
                            </Button>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
            <Grid textAlign="center">
                <Grid.Column width={9}>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Don't you signed up yet ? Sign up as a&nbsp;
                        <Link to={"/candidateSignUp"}>candidate</Link>&nbsp;or&nbsp;
                        <Link to={"/employerSignUp"}>employer</Link>.
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    )
}