import {SignUp} from "../../components/common/SignUp";
import EmployerService from "../../services/employerService";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import {useFormik} from "formik";
import {login} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {handleCatch} from "../../utilities/Utils";

export function SignUpEmployer() {

    const employerService = new EmployerService()

    const dispatch = useDispatch();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [jiggle, setJiggle] = useState(true);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight);

    useEffect(() => {
        return () => {
            setLoading(undefined)
            setJiggle(undefined)
            setVerticalScreen(undefined)
        };
    }, []);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
    }, [jiggle]);

    const initial = {email: "", password: "", passwordRepeat: "", companyName: "", website: "", phoneNumber: ""}

    const shape = {
        companyName: Yup.string().required("Required").min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
        website: Yup.string().required("Required").matches(/^(w{3}\.)?[^.]+(\.[a-z]{2,12})$/, "Not a valid web site format"),
        phoneNumber: Yup.string().required("Required").matches(/^((\+?\d{1,3})?0?[\s-]?)?\(?0?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, "Not a valid phone number format"),
        email: Yup.string().required("Required").matches(/^\w+(\.\w+)*@([a-z]{2,12})(\.[a-z]{2,6})$/, "Not a valid e-mail format"),
        password: Yup.string().required("Required").min(6, "Minimum 6 characters").max(20, "Maximum 20 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "Not matching").required("Required")
    }

    const formik = useFormik({
        initialValues: initial,
        validationSchema: Yup.object().shape(shape),
        onSubmit: (values) => {
            setLoading(true)
            employerService.add(values)
                .then((r) => {
                    dispatch(login(r.data.data, "employer"));
                    toast("Welcome");
                    history.push("/");
                })
                .catch(handleCatch)
                .finally(() => setLoading(false))
        }
    });

    const popupSize = !verticalScreen ? undefined : "small"
    const popupPosition = !verticalScreen ? "right center" : "top center"
    const iconPosition = "left"
    const inputComponents = [
        <SPopupInput icon="building outline" placeholder="Company Name" name="companyName" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={1} jiggle={jiggle}
                     className={"padded"} id={"wrapper"}/>,
        <SPopupInput icon="world" placeholder="Website" name="website" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={2} jiggle={jiggle}
                     className={"padded"} id={"wrapper"}/>,
        <SPopupInput icon="phone" placeholder="Phone Number" name="phoneNumber" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={3} jiggle={jiggle}
                     className={"padded"} id={"wrapper"}/>,
        <SPopupInput icon="at" placeholder="Email" name="email" type={"email"} popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={4} jiggle={jiggle}
                     className={"padded"} id={"wrapper"}/>,
        <SPopupInput icon="lock" placeholder="Password" name="password" type={"password"} popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={5} jiggle={jiggle}
                     className={"padded"} id={"wrapper"}/>,
        <SPopupInput icon="lock" placeholder="Password Repeat" name="passwordRepeat" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"password"} formik={formik} key={6}
                     className={"padded"} id={"wrapper"} jiggle={jiggle}/>
    ]

    return <SignUp service={employerService} formik={formik} inputComponents={inputComponents}
                   toggleJiggle={() => setJiggle(!jiggle)} loading={loading}/>
}