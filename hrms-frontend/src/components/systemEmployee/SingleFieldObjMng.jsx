import ManagementTable from "../../components/common/ManagementTable";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {Grid} from "semantic-ui-react";
import SInput from "../../utilities/customFormControls/SInput";
import {toast} from "react-toastify";
import {getValueByFieldName, handleCatch} from "../../utilities/Utils";

function SingleFieldObjMng({service, header, fieldName, color, ...props}) {

    const [objects, setObjects] = useState([]);

    useEffect(() => {
        service.getAll().then((result) => setObjects(result.data.data));
        return () => setObjects(undefined)
    }, [service]);

    const formik = useFormik({
        initialValues: {field: ""}
    });

    if (!objects) return null

    const add = () => service.add(formik.values.field)
        .then(r => {
            setObjects([...objects, r.data.data])
            formik.setFieldValue("field", "")
            toast(`Added to row ${objects.length + 1}`)
        })
        .catch(handleCatch)

    const tableData = objects.map((object, index) => ({object: object, rowNo: index + 1}))
    const renderBodyRow = ({object, rowNo}, i) => ({key: i, cells: [rowNo, getValueByFieldName(object, fieldName)]})
    const footerCells = [<SInput name="field" placeholder={"Name"} formik={formik} style={{}} key={0}/>]

    return (
        <Grid.Column width={4} textAlign={"center"} {...props}>
            <ManagementTable
                color={color} headerContent={header} unstackable pageable addDisabled={!formik.values.field}
                addCellLeft onAdd={add} tableData={tableData} renderBodyRow={renderBodyRow} defClosed
                footerCells={footerCells} definition/>
        </Grid.Column>
    )
}

export default SingleFieldObjMng
