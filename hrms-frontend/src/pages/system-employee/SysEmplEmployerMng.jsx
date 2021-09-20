import React, {useEffect, useState} from "react";
import {Header, Transition} from "semantic-ui-react";
import {useSelector} from "react-redux";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import EmployerMngFilterSeg from "../../components/systemEmployee/EmployerMngFilterSeg";
import EmployerMngList from "../../components/systemEmployee/EmployerMngList";

export default function SysEmplEmployerMng() {

    const userProps = useSelector(state => state?.user?.userProps)
    const filterProps = useSelector(state => state?.listingReducer.listingProps.employers)
    const filteredEmployersRedux = filterProps.filteredEmployers

    const [listVisible, setListVisible] = useState(false);
    const [filteredEmployers, setFilteredEmployers] = useState(filteredEmployersRedux);
    const [currentPage, setCurrentPage] = useState(1);
    const [employersPerPage, setEmployersPerPage] = useState(filteredEmployers.length <= 5 ? 5 : 10);

    useEffect(() => {
        setTimeout(() => setListVisible(true), 200)
        return () => {
            setFilteredEmployers(undefined)
            setCurrentPage(undefined)
            setEmployersPerPage(undefined)
        };
    }, []);

    useEffect(() => {
        setFilteredEmployers(filteredEmployersRedux)
    }, [filteredEmployersRedux]);

    useEffect(() => {
        setCurrentPage(1)
    }, [filteredEmployersRedux.length]);

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"😛🤪🤭"}/>

    const indexOfLastEmployer = currentPage * employersPerPage
    const indexOfFirstEmployer = indexOfLastEmployer - employersPerPage
    const currentEmployers = filteredEmployers.slice(indexOfFirstEmployer, indexOfLastEmployer)

    const noEmployer = filteredEmployers.length === 0

    const itemsPerPageClick = (number) => {
        if (number === employersPerPage) return
        setCurrentPage(1)
        setEmployersPerPage(number)
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>
                <ItemsPerPageBar itemPerPage={employersPerPage} handleClick={itemsPerPageClick} compact style={{marginTop: 15}}
                                 disabled={noEmployer} listedItemsLength={filteredEmployers.length}/>
                <PaginationBar itemsPerPage={employersPerPage} listedItemsLength={filteredEmployers.length} activePage={currentPage}
                               disabled={noEmployer} onPageChange={changePage} style={{marginTop: 15}}/>
            </div>
        )
    }

    return (
        <div>
            <EmployerMngFilterSeg/>
            {listingOptions()}
            <Transition visible={listVisible} duration={200}>
                <div>
                    <EmployerMngList employers={currentEmployers}/>
                </div>
            </Transition>
        </div>
    );
}