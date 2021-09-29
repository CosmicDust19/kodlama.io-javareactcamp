import {Input, Popup, Transition} from "semantic-ui-react";

function SPopupInput({name, formik, popupposition = "bottom center", popupsize, jiggle, ...props}) {

    const meta = formik.getFieldMeta(name);

    return (
        <Popup
            trigger={
                <Transition visible={jiggle} animation={!meta.error ? "" : "jiggle"} duration={250}>
                    <Input name={name} onChange={formik.handleChange} value={meta.value}
                           iconPosition={props.iconposition} id="wrapper" {...props}/>
                </Transition>
            }
            size={popupsize}
            position={popupposition}
            open={meta.error && meta.touched}
            content={meta.error ? meta.error : props.placeholder}
            className={meta.error ? "error-popup" : "info-popup"}
        />
    )
}

export default SPopupInput;