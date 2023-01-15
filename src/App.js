import logo from './logo.svg';
import './App.css';
import {useState, Component, useContext, createContext, useEffect} from "react";
import {
    Alert,
    Button,
    CircularProgress, Fade,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

const MeasuringStatusContext = createContext(null);
const UserContext = createContext(null);
const API_ADDRESS = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

function ApiForm(props) {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [status, setStatus] = useState(0);

    async function checkUserStatus(user) {
        try {
            let res = await fetch(`${API_ADDRESS}/data/get/${user}/measure_proxy`, {
                method: "POST",
            });
            res.text().then((r) => {
                setContext(r === 'true');
                setStatus(1);
            });
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <FormControl
            sx={{
                m: 1,
                display: "inline-block"
            }}
            size="small"
        >
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
                value={props.user}
                label="User"
                onChange={(e) => {
                    checkUserStatus(e.target.value).then(() => {
                        props.setUser(e.target.value)
                    })
                }}
                sx={{
                    minWidth: "200px",
                    color: "white",
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '.MuiSvgIcon-root ': {
                        fill: "white !important",
                    },
                    'input': {
                        '&::placeholder': {
                            textOverflow: 'ellipsis !important',
                            color: 'blue'
                        }
                    }
                }}
            >
                <MenuItem value={"levi"}>Levi</MenuItem>
                <MenuItem value={"kevin"}>Kevin</MenuItem>
                <MenuItem value={"geert"}>Geert</MenuItem>
            </Select>
            {props.hideTextField ? null : (
                <TextField
                    type="text"
                    value={props.label}
                    placeholder="Label"
                    onChange={(e) => props.setLabel(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: "200px",
                        maxWidth: "200px",
                        input: {
                            color: "aliceblue"
                        },
                        fieldset: {borderColor: 'rgba(228, 219, 233, 0.25)'},
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: 'rgba(228, 219, 233, 0.25)'
                            },
                        },
                    }}
                />
            )}
            <Button
                onClick={props.action}
                type="submit"
                variant="outlined"
                sx={props.type === "start" ? {
                    color: 'rgba(228, 219, 233, 0.50)',
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                    minWidth: "200px"
                } : {
                    color: '#B90E0A',
                    borderColor: '#B90E0A',
                    minWidth: "200px"
                }}
            >
                {props.type === "start" ? "Start Measurement" : "Stop Measurement"}
            </Button>
            <FormMessage message={props.message} status={props.status}/>
        </FormControl>
    )
}
function CustomFadeAlert(props) {
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

function IncomingDataView() {
    const [incomingData, setIncomingData] = useState(null);
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        let interval = setInterval(() => {
            fetch(`${API_ADDRESS}/data/last_line/${user}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }).then(r => {
                return r.json()
            }).then(r => {
                setIncomingData(r.data);
            });
        }, 5000)

        return () => {
            clearInterval(interval);
        }
    })

    return (
        <pre>
            {incomingData ? (
                <CustomFadeAlert incomingData={incomingData}/>
            ) : (
                <CircularProgress/>
            )}
        </pre>
    )
}

function FormComponent() {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [user, setUser] = useContext(UserContext);
    const [label, setLabel] = useState("");
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(`${API_ADDRESS}/data/start_measurement/${user}/${label}`, {
                method: "POST",
            });
            if (res.status === 200) {
                setLabel("");
                setStatus(1);
                setMessage(`Successfully started measurement for user ${user}`);
                setContext(true);
            } else {
                setMessage("An error has occurred");
                setStatus(0);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ApiForm
            user={user}
            setUser={setUser}
            hideTextField={false}
            label={label}
            setLabel={setLabel}
            action={handleSubmit}
            status={status}
            message={message}
            type={"start"}
        />
    )
}

function StopMeasureComponent() {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [user, setUser] = useContext(UserContext);
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    async function checkUserStatus(user) {
        try {
            let res = await fetch(`${API_ADDRESS}/data/get/${user}/measure_proxy`, {
                method: "POST",
            });
            res.text().then((r) => {
                setContext(r === 'true');
                setStatus(1);
                setMessage(`${user} is currently collecting data`);
            });
        } catch (err) {
            console.log(err)
        }
    }

    let stopMeasurement = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(`${API_ADDRESS}/data/stop_measurement/${user}`, {
                method: "POST",
            });
            if (res.status === 200) {
                setContext(false)
                setStatus(1);
                setMessage(`${user} is no longer collecting data`);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ApiForm
            user={user}
            setUser={setUser}
            hideTextField={true}
            action={stopMeasurement}
            status={status}
            message={message}
        />
    )
}

function FormMessage(props) {
    return (
        <div className="message">{
            props.message ?
                props.status === 1 ?
                    <p style={{color: "green"}}>✅ - {props.message}</p> :
                    <p style={{color: "red"}}>⚠️ - {props.message}</p>
                : null
        }
        </div>
    )
}


function App() {
    const [measuringStatus, setMeasuringStatus] = useState(false);
    const [user, setUser] = useState("");

    return (
        <div className="App">
            <header className="App-header">
                <p>⚕️️ Powerchainger HWE-SKT-proxy front-end ⚕️</p>
            </header>
            <MeasuringStatusContext.Provider value={[measuringStatus, setMeasuringStatus]}>
                <UserContext.Provider value={[user, setUser]}>
                    {!measuringStatus ? (
                        <FormComponent/>
                    ) : (
                        <>
                            <StopMeasureComponent/>
                            <IncomingDataView/>
                        </>
                    )}
                </UserContext.Provider>
            </MeasuringStatusContext.Provider>
        </div>
    );
}

export default App;
