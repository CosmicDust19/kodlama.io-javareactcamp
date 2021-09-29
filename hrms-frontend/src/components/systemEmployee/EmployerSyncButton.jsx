import {useDispatch, useSelector} from "react-redux";
import {Button} from "semantic-ui-react";
import {useEffect, useState} from "react";
import {changeFilteredEmployers} from "../../store/actions/listingActions";
import EmployerService from "../../services/employerService";
import {getFilteredEmployers} from "../../utilities/EmployerUtils";

export default function EmployerSyncButton() {

    const employerService = new EmployerService()

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.listingReducer.listingProps.employers.filters);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        return () => setLoading(undefined)
    }, []);

    const sync = () => {
        setLoading(true)
        employerService.getAll().then(r => {
            const filteredEmployers = getFilteredEmployers(r.data.data, filters)
            dispatch(changeFilteredEmployers(filteredEmployers))
        }).finally(() => setLoading(false))
    }

    return (
        <Button circular loading={loading} onClick={sync} icon={"sync"} compact floated={"right"} disabled={loading}
                style={{marginTop: 10, marginLeft: -30, backgroundColor: "rgba(238,238,238,0.2)"}}/>
    )
}