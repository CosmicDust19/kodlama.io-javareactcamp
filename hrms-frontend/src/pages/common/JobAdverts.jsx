import React, {useEffect, useState} from "react";
import {Segment, Transition} from "semantic-ui-react";
import {useSelector} from "react-redux";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import JobAdvertListPublic from "../../components/common/JobAdvertListPublic";
import ItemsPerRowIcon from "../../components/common/ItemsPerRowIcon";
import JobAdvertSidebar from "../../components/common/JobAdvertSidebar";
import JobAdvertMngList from "../../components/systemEmployee/JobAdvertMngList";

export default function JobAdverts() {

    const userProps = useSelector(state => state?.user.userProps)
    const management = String(userProps.userType) === "systemEmployee"

    const filterProps = useSelector(state => state?.listingReducer.listingProps.jobAdverts)
    const filteredJobAdvertsRedux = filterProps.filteredJobAdverts

    const [listVisible, setListVisible] = useState(false);
    const [filteredJobAdverts, setFilteredJobAdverts] = useState(filteredJobAdvertsRedux);
    const [itemsPerRow, setItemsPerRow] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertsPerPage, setJobAdvertsPerPage] = useState(filteredJobAdverts.length <= 5 ? 5 : 10);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight)

    useEffect(() => {
        setTimeout(() => setListVisible(true), 200)
        return () => {
            setFilteredJobAdverts(undefined)
            setItemsPerRow(undefined)
            setCurrentPage(undefined)
            setJobAdvertsPerPage(undefined)
            setVerticalScreen(undefined)
        };
    }, []);

    useEffect(() => {
        setFilteredJobAdverts(filteredJobAdvertsRedux)
    }, [filteredJobAdvertsRedux]);

    useEffect(() => {
        setCurrentPage(1)
    }, [filteredJobAdvertsRedux.length]);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
        setItemsPerRow(verticalScreen ? 1 : itemsPerRow)
    }, [itemsPerRow, currentPage, verticalScreen, jobAdvertsPerPage, filteredJobAdvertsRedux]);

    const indexOfLastJobAdvert = currentPage * jobAdvertsPerPage
    const indexOfFirstJobAdvert = indexOfLastJobAdvert - jobAdvertsPerPage
    const currentJobAdverts = filteredJobAdverts.slice(indexOfFirstJobAdvert, indexOfLastJobAdvert)

    const noAdvert = currentJobAdverts.length === 0

    const itemsPerPageClick = (number) => {
        if (number === jobAdvertsPerPage) return
        setCurrentPage(1);
        setJobAdvertsPerPage(number);
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    const itemsPerRowClick = () => setItemsPerRow(itemsPerRow < 3 ? itemsPerRow + 1 : 1)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>
                <ItemsPerPageBar itemPerPage={jobAdvertsPerPage} handleClick={itemsPerPageClick} disabled={noAdvert}
                                 listedItemsLength={filteredJobAdverts.length} visible={!verticalScreen} compact/>
                <PaginationBar itemsPerPage={jobAdvertsPerPage} listedItemsLength={filteredJobAdverts.length}
                               activePage={currentPage} disabled={noAdvert} onPageChange={changePage}/>
                <ItemsPerRowIcon visible={!verticalScreen && !management} itemsPerRow={itemsPerRow}
                                 toggle={itemsPerRowClick} disabled={noAdvert}/>
            </div>
        )
    }

    return (
        <Segment padded style={{marginTop: -40}} basic vertical={verticalScreen}>
            {listingOptions()}
            <JobAdvertSidebar jobAdvertsPerPage={jobAdvertsPerPage} itemsPerPageClick={itemsPerPageClick} style={{marginRight: 10}}/>
            <Transition duration={200} visible={listVisible}>
                <div>
                    {management ?
                        <JobAdvertMngList jobAdverts={currentJobAdverts}/> :
                        <JobAdvertListPublic jobAdverts={currentJobAdverts} itemsPerRow={itemsPerRow}/>}
                </div>
            </Transition>
        </Segment>
    );
}
