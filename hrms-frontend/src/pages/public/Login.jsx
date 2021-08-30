import {Segment, Grid, Form, Button, Icon, Header, Message} from "semantic-ui-react";
import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../store/actions/userActions";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import React, {useState} from "react";
import {handleCatch} from "../../utilities/Utils";
import * as Yup from "yup";

export default function Login() {

    const userService = new UserService();

    const dispatch = useDispatch();
    const history = useHistory();

    const [verticalScreen] = useState(window.innerWidth < window.innerHeight);
    const [loginMsgOpen, setLoginMsgOpen] = useState(true);

    const formik = useFormik({
        initialValues: {
            email: "", password: ""
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required("Required"),
            password: Yup.string().required("Required")
        }),
        onSubmit: (values) => {
            userService.login(values.email, values.password)
                .then(result => {
                    dispatch(login(result.data.data, result.data.message.substr(0, result.data.message.indexOf(" "))))
                    history.push("/")
                    toast("Welcome", {autoClose: 1500})
                }).catch(handleCatch)
        }
    });

    const popupPosition = verticalScreen ? undefined : "right center"
    const popupSize = !verticalScreen ? undefined : "small"

    return (
        <div>
            <Header color="yellow" textAlign="center" content={"Login"}/>
            <Grid centered stackable padded>
                <Grid.Column mobile={6}>
                    <Segment placeholder color={"yellow"} padded textAlign={"center"} raised style={{borderRadius: 15}}>
                        <Form size="large" onSubmit={formik.handleSubmit}>

                            <Grid padded>
                                <Grid.Column>
                                    <SPopupInput icon="mail" iconPosition={"left"} placeholder="Email" name="email"
                                                 formik={formik} popupPosition={popupPosition} popupSize={popupSize}/>
                                    <SPopupInput icon="lock" iconPosition={"left"} placeholder="Password" name="password"
                                                 type={"password"} formik={formik} popupPosition={popupPosition} popupSize={popupSize}/>
                                </Grid.Column>
                            </Grid>

                            <Button animated="fade" type="submit" size="big" color="yellow">
                                <Button.Content hidden><Icon name='sign in alternate'/></Button.Content>
                                <Button.Content visible>Login</Button.Content>
                            </Button>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
            <Grid textAlign="center" stackable>
                <Grid.Column width={9}>
                    <Message warning onDismiss={() => setLoginMsgOpen(false)} hidden={!loginMsgOpen}>
                        <Icon name='help'/>
                        Didn't you signed up yet ? Sign up as a
                        <Link to={"/signup/candidate"} onClick={() => window.scrollTo(0, 100)}> candidate </Link>
                        or an
                        <Link to={"/signup/employer"} onClick={() => window.scrollTo(0, 50)}> employer</Link>.
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    )
}