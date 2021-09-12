import {toast} from "react-toastify";
import React from "react";
import defUserImg from "../assets/images/defUserImg.png";

export const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const placeholderImageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]

export const defErrPopupStyle = {borderRadius: 7, color: "rgb(217,8,8)", backgroundColor: "rgba(255,255,255, 0.7)", marginBottom: -1}
export const defInfoPopupStyle = {...defErrPopupStyle, color: "rgb(0,0,0)"}
export const defInputStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}
export const defDropdownStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}
export const defCheckBoxStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}

export const getCityOption = (cities) => cities.map((city, index) => ({
    key: index,
    text: city.name,
    value: city.id,
}));

export const getPositionOption = (positions) => positions.map((position, index) => ({
    key: index,
    text: position.title,
    value: position.id,
}));

export const getSchoolOption = (schools) => schools.map((school, index) => ({
    key: index,
    text: school.name,
    value: school.id,
}));

export const getDepartmentOption = (departments) => departments.map((department, index) => ({
    key: index,
    text: department.name,
    value: department.id,
}));

export const getEmployerOption = (employers) => employers.map((employer, index) => ({
    key: index,
    text: employer.companyName,
    value: employer.id,
}));

export const changePropInList = (propId, newProp, propList) => {
    const index = propList.findIndex(jobAdv => jobAdv.id === propId)
    propList[index] = newProp
    return propList
}

export const getObjectById = (id, objects) => objects[objects.findIndex(object => object.id === id)]

export const getValueByFieldName = (object, fieldName) => Object.values(object)[Object.keys(object).indexOf(fieldName)]

export const getRemainedDays = (deadline) => Math.round((new Date(deadline).getTime() - new Date().getTime()) / 86400000)

export const getRemainedDaysAsFont = (deadline) => {
    const remainedDays = getRemainedDays(deadline)
    if (remainedDays <= 0)
        return <font style={{color: "rgba(123,12,219,0.96)"}}>Expired</font>
    else if (remainedDays === 1)
        return <font style={{color: "rgba(239,9,36,0.96)"}}>Last&nbsp;&nbsp;1&nbsp;&nbsp;day</font>
    else if (remainedDays <= 3)
        return <font style={{color: "rgba(255,86,0,0.96)"}}>Last&nbsp;&nbsp;{remainedDays}&nbsp;&nbsp;days</font>
    return <font>Last&nbsp;&nbsp;{remainedDays}&nbsp;&nbsp;days</font>
}

export const getCreatedAtAsStr = (createdAt, onlyDate = false) => {
    return `${onlyDate ? "" : "Created at "}${new Date(createdAt).getDate()} ${months[new Date(createdAt).getMonth()]} ${new Date(createdAt).getFullYear()}`
}

export const getRandomColor = () => colors[Math.floor(Math.random() * 12)]

export const getRandomImg = (size) => `https://semantic-ui.com/images/avatar2/${size}/${placeholderImageNames[Math.floor(Math.random() * 9)]}.png`

export const handleCatch = (error) => {
    const resp = error.response
    console.log(error)
    console.log(resp)
    if (!resp || !resp.data) {
        toast.error("Something went wrong 🙁")
        return false;
    }
    if (resp.data.data?.errors) {
        Object.entries(resp.data.data.errors).forEach((prop) => toast.warning(String(prop[1])))
        return true;
    }
    if (resp.data.message) {
        toast.warning(resp.data.message)
        return true;
    }
    return false;
}
