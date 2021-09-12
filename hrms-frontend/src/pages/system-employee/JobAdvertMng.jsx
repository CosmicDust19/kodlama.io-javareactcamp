import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Header, Loader} from "semantic-ui-react";
import {useSelector} from "react-redux";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import JobAdvertMngFilterSeg from "../../components/systemEmployee/JobAdvertMngFilterSeg";
import JobAdvertMngList from "../../components/systemEmployee/JobAdvertMngList";

export default function JobAdvertMng() {

    const userProps = useSelector(state => state?.user.userProps)
    const filteredJobAdvertsRedux = useSelector(state => state?.filter.filter.filteredJobAdverts)

    const [filteredJobAdverts, setFilteredJobAdverts] = useState(filteredJobAdvertsRedux);
    const [noAdvFound, setNoAdvFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertsPerPage, setJobAdvertsPerPage] = useState(10);
    const [jobAdverts, setJobAdverts] = useState();

    useEffect(() => {
        setFilteredJobAdverts(filteredJobAdvertsRedux)
    }, [filteredJobAdvertsRedux]);

    useEffect(() => {
        setCurrentPage(1)
        setNoAdvFound(filteredJobAdvertsRedux.length === 0)
    }, [filteredJobAdvertsRedux.length]);

    useEffect(() => {
        const jobAdvertService = new JobAdvertisementService();
        jobAdvertService.getAll().then((result) => {
            setJobAdverts(result.data.data)
            if (filteredJobAdverts.length === 0) setFilteredJobAdverts(result.data.data)
        });
    }, [filteredJobAdverts.length]);

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"😛🤪🤭"}/>

    if (!jobAdverts) return <Loader active inline='centered' size={"big"} style={{marginTop: 50}}/>

    const indexOfLastJobAdvert = currentPage * jobAdvertsPerPage
    const indexOfFirstJobAdvert = indexOfLastJobAdvert - jobAdvertsPerPage
    const currentJobAdverts = noAdvFound ? [] : filteredJobAdvertsRedux.slice(indexOfFirstJobAdvert, indexOfLastJobAdvert)

    const noFilteredJobAdv = filteredJobAdverts.length === 0

    const itemsPerPageClick = (number) => {
        if (number === jobAdvertsPerPage) return
        setCurrentPage(1)
        setJobAdvertsPerPage(number)
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>
                <ItemsPerPageBar itemPerPage={jobAdvertsPerPage} handleClick={itemsPerPageClick}
                                 disabled={noFilteredJobAdv || noAdvFound}/>
                <PaginationBar itemsPerPage={jobAdvertsPerPage} listedItemsLength={filteredJobAdverts.length} activePage={currentPage}
                               disabled={noFilteredJobAdv || noAdvFound} onPageChange={changePage}/>
            </div>
        )
    }

    return (
        <div>
            <JobAdvertMngFilterSeg allJobAdverts={jobAdverts}/>
            {listingOptions()}
            <JobAdvertMngList jobAdverts={currentJobAdverts} noAdvPublished={jobAdverts.length === 0}/>
        </div>
    );
}