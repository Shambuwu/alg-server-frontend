import {Alert, Fade} from "@mui/material";
import {useState, useEffect} from "react";


export default function FadeAlert(props) {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        setFade(true);

        setTimeout(() => {
            setFade(false);
        }, 2000)

    }, [props.incomingData])

    return (
        <Fade unmountOnExit={true} in={fade} timeout={{
            appear: 200,
            enter: 300,
            exit: 600,
        }}>
            <Alert severity="success">Successfully inserted data: {props.incomingData}</Alert>
        </Fade>
    )
}