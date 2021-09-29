import React, {useEffect, useState} from "react";
import {Segment, Transition} from "semantic-ui-react";
import {useSelector} from "react-redux";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import JobAdvertListPublic from "../../components/common/JobAdvertListPublic";
import ItemsPerRowIcon from "../../components/common/ItemsPerRowIcon";
import JobAdvertSidebar from "../../components/common/JobAdvertSidebar";
import JobAdvertMngList from "../../components/systemEmployee/JobAdvertMngList";
import JobAdvertSyncButton from "../../components/systemEmployee/JobAdvertSyncButton";

export default function JobAdverts() {

    const userProps = useSelector(state => state?.user.userProps)
    const management = String(userProps.userType) === "systemEmployee"

    const filterProps = useSelector(state => state?.listingReducer.listingProps.jobAdverts)
    const filteredJobAdvertsRedux = filterProps.filteredJobAdverts

    const [waitingResp, setWaitingResp] = useState(true);
    const [listVisible, setListVisible] = useState(false);
    const [filteredJobAdverts, setFilteredJobAdverts] = useState(filteredJobAdvertsRedux);
    const [itemsPerRow, setItemsPerRow] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(filteredJobAdverts.length <= 5 ? 5 : 10);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight)

    useEffect(() => {
        return () => {
            setWaitingResp(undefined)
            setFilteredJobAdverts(undefined)
            setItemsPerRow(undefined)
            setCurrentPage(undefined)
            setItemsPerPage(undefined)
            setVerticalScreen(undefined)
        };
    }, []);

    useEffect(() => {
        setListVisible(!waitingResp)
    }, [waitingResp]);

    useEffect(() => {
        setFilteredJobAdverts(filteredJobAdvertsRedux)
    }, [filteredJobAdvertsRedux]);

    useEffect(() => {
        setCurrentPage(1)
    }, [filteredJobAdvertsRedux.length]);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
        setItemsPerRow(verticalScreen ? 1 : itemsPerRow)
    }, [itemsPerRow, currentPage, verticalScreen, itemsPerPage, filteredJobAdvertsRedux]);

    const indexOfLastJobAdvert = currentPage * itemsPerPage
    const indexOfFirstJobAdvert = indexOfLastJobAdvert - itemsPerPage
    const currentJobAdverts = filteredJobAdverts.slice(indexOfFirstJobAdvert, indexOfLastJobAdvert)

    const noJobAdvertsListing = currentJobAdverts.length === 0

    const itemsPerPageClick = (number) => {
        if (number === itemsPerPage) return
        setCurrentPage(1);
        setItemsPerPage(number);
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    const itemsPerRowClick = () => setItemsPerRow(itemsPerRow < 3 ? itemsPerRow + 1 : 1)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>
                <ItemsPerPageBar itemPerPage={itemsPerPage} handleClick={itemsPerPageClick} disabled={noJobAdvertsListing || waitingResp}
                                 listedItemsLength={filteredJobAdverts.length} visible={!verticalScreen} compact/>
                <PaginationBar itemsPerPage={itemsPerPage} listedItemsLength={filteredJobAdverts.length}
                               activePage={currentPage} disabled={noJobAdvertsListing || waitingResp} onPageChange={changePage}/>
                <ItemsPerRowIcon visible={!verticalScreen && !management} itemsPerRow={itemsPerRow}
                                 onClick={itemsPerRowClick} disabled={noJobAdvertsListing || waitingResp}/>
                <JobAdvertSyncButton visible={management}/>
            </div>
        )
    }

    return (
        <Segment padded style={{marginTop: -40}} basic vertical={verticalScreen}>
            {listingOptions()}
            <JobAdvertSidebar itemsPerPage={itemsPerPage} itemsPerPageClick={itemsPerPageClick}
                              setWaitingResp={setWaitingResp} style={{marginRight: 10}}/>
            <Transition visible={listVisible} duration={400}>
                <div>
                    {management ?
                        <JobAdvertMngList jobAdverts={currentJobAdverts} waitingResp={waitingResp}/> :
                        <JobAdvertListPublic jobAdverts={currentJobAdverts} waitingResp={waitingResp} itemsPerRow={itemsPerRow}/>}
                </div>
            </Transition>
        </Segment>
    );
}
