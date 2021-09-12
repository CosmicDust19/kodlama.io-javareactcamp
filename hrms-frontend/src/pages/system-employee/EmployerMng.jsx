import React, {useEffect, useState} from "react";
import {Header, Loader} from "semantic-ui-react";
import {useSelector} from "react-redux";
import EmployerService from "../../services/employerService";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import EmployerMngFilterSeg from "../../components/systemEmployee/EmployerMngFilterSeg";
import EmployerMngList from "../../components/systemEmployee/EmployerMngList";

export default function EmployerMng() {

    const userProps = useSelector(state => state?.user?.userProps)
    const filteredEmployersRedux = useSelector(state => state?.filter.filter.filteredEmployers)

    const [filteredEmployers, setFilteredEmployers] = useState(filteredEmployersRedux);
    const [noEmplFound, setNoEmplFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [employersPerPage, setEmployersPerPage] = useState(20);
    const [employers, setEmployers] = useState();

    useEffect(() => {
        setFilteredEmployers(filteredEmployersRedux)
    }, [filteredEmployersRedux]);

    useEffect(() => {
        setCurrentPage(1)
        setNoEmplFound(filteredEmployersRedux.length === 0)
    }, [filteredEmployersRedux.length]);

    useEffect(() => {
        const employerService = new EmployerService();
        employerService.getAll().then((result) => {
            setEmployers(result.data.data)
            if (filteredEmployers.length === 0) setFilteredEmployers(result.data.data)
        });
    }, [filteredEmployers]);

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"😛🤪🤭"}/>

    if (!employers) return <Loader active inline='centered' size={"big"} style={{marginTop: 50}}/>

    const indexOfLastEmployer = currentPage * employersPerPage
    const indexOfFirstEmployer = indexOfLastEmployer - employersPerPage
    const currentEmployers = noEmplFound ? [] : filteredEmployers.slice(indexOfFirstEmployer, indexOfLastEmployer)

    const noFilteredEmpl = filteredEmployers.length === 0

    const itemsPerPageClick = (number) => {
        setCurrentPage(1)
        setEmployersPerPage(number)
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>
                <ItemsPerPageBar itemPerPage={employersPerPage} handleClick={itemsPerPageClick} disabled={noFilteredEmpl || noEmplFound}/>
                <PaginationBar itemsPerPage={employersPerPage} listedItemsLength={filteredEmployers.length} activePage={currentPage}
                               disabled={noFilteredEmpl || noEmplFound} onPageChange={changePage}/>
            </div>
        )
    }

    return (
        <div>
            <EmployerMngFilterSeg employers={employers}/>
            {listingOptions()}
            <EmployerMngList employers={currentEmployers} noEmplSignedUp={employers.length === 0}/>
        </div>
    );
}