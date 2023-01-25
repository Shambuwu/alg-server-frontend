import {useState, useContext, useEffect} from "react";
import UserContext from "../hooks/UserContext";
import FadeAlert from "./FadeAlert";
import {CircularProgress} from "@mui/material";
import {getUserLastLine} from "../api/DataApi";

export default function IncomingDataView() {
    const [incomingData, setIncomingData] = useState(null);
    const [user, setUser]: any = useContext(UserContext);

    useEffect(() => {
        let interval = setInterval(async () => {
            let result = await getUserLastLine(user);
            setIncomingData(result);
        }, 5000)

        return () => {
            clearInterval(interval);
        }
    })

    return (
        <pre>
            {incomingData ? (
                <FadeAlert incomingData={incomingData}/>
            ) : (
                <CircularProgress/>
            )}
        </pre>
    )
}