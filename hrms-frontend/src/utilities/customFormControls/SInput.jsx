import {Input} from "semantic-ui-react";
import React from "react";
import {defInputStyle} from "../Utils";

function SInput({name, formik, ...props}) {

    const meta = formik.getFieldMeta(name);

    return (
        <Input value={meta.value} name={name} onChange={formik.handleChange} style = {defInputStyle} {...props}/>
    )
}

export default SInput;
