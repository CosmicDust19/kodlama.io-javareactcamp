import React, {useEffect, useState} from "react";
import {Header, Transition} from "semantic-ui-react";
import {useSelector} from "react-redux";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import EmployerMngFilterSeg from "../../components/systemEmployee/EmployerMngFilterSeg";
import EmployerMngList from "../../components/systemEmployee/EmployerMngList";
import EmployerSyncButton from "../../components/systemEmployee/EmployerSyncButton";

export default function SysEmplEmployerMng() {

    const userProps = useSelector(state => state?.user?.userProps)
    const filterProps = useSelector(state => state?.listingReducer.listingProps.employers)
    const filteredEmployersRedux = filterProps.filteredEmployers

    const [waitingResp, setWaitingResp] = useState(true);
    const [listVisible, setListVisible] = useState(false);
    const [filteredEmployers, setFilteredEmployers] = useState(filteredEmployersRedux);
    const [currentPage, setCurrentPage] = useState(1);
    const [employersPerPage, setEmployersPerPage] = useState(filteredEmployers.length <= 5 ? 5 : 10);

    useEffect(() => {
        return () => {
            setWaitingResp(undefined)
            setFilteredEmployers(undefined)
            setCurrentPage(undefined)
            setEmployersPerPage(undefined)
        };
    }, []);

    useEffect(() => {
        setListVisible(!waitingResp)
    }, [waitingResp]);

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

    const noEmployersListing = filteredEmployers.length === 0

    const itemsPerPageClick = (number) => {
        if (number === employersPerPage) return
        setCurrentPage(1)
        setEmployersPerPage(number)
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>
                <ItemsPerPageBar itemPerPage={employersPerPage} handleClick={itemsPerPageClick} compact
                                 disabled={noEmployersListing || waitingResp} listedItemsLength={filteredEmployers.length}/>
                <PaginationBar itemsPerPage={employersPerPage} listedItemsLength={filteredEmployers.length} activePage={currentPage}
                               disabled={noEmployersListing || waitingResp} onPageChange={changePage}/>
                <EmployerSyncButton/>
            </div>
        )
    }

    return (
        <div>
            <EmployerMngFilterSeg setWaitingResp={setWaitingResp}/>
            {listingOptions()}
            <Transition visible={listVisible} duration={200}>
                <div>
                    <EmployerMngList employers={currentEmployers} waitingResp={waitingResp}/>
                </div>
            </Transition>
        </div>
    );
}