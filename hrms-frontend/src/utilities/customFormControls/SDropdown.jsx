import {dropdownStyle, getValueByFieldName} from "../Utils";
import {Dropdown} from "semantic-ui-react";
import React from "react";

export default function SDropdown(
    {
        name, formik, value = getValueByFieldName(formik.values, name), multiple = true, placeholder, options, onChange,
        selectOnBlur = false, onBlur, className, as, loading, icon, disabled, fluid, style = dropdownStyle,
    }
) {
    return (
        <Dropdown clearable item search selection fluid={fluid} multiple={multiple} selectOnBlur={selectOnBlur}
                  disabled={disabled} loading={loading ? loading : options === 0} placeholder={placeholder} options={options}
                  value={value} icon={icon} onBlur={onBlur} style={style} as={as} className={className}
                  onChange={onChange ? onChange : (event, data) => formik.setFieldValue(name, data.value)}
        />
    )
}
