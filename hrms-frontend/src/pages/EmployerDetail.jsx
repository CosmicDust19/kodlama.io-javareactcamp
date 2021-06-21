import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import EmployerService from "../services/employerService";

export default function EmployerDetail() {
    let {id} = useParams()

    const [employer, setEmployer] = useState({});

    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getById(id).then((result) => setEmployer(result.data.data));
    }, [id]);


    return (
        <div>
            {employer.id}
        </div>
    )
}