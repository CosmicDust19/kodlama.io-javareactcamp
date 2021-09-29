import {Input} from "semantic-ui-react";
import React from "react";

function SInput({name, formik, ...props}) {

    const meta = formik.getFieldMeta(name);

    return (
        <Input value={meta.value} name={name} onChange={formik.handleChange} id="wrapper" {...props}/>
    )
}

export default SInput;
