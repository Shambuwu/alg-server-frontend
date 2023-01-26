import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useState, Component, useContext, createContext, useEffect} from "react";
import PropTypes from "prop-types";
import {checkUserStatusRequest} from "../api/DataApi";
import MeasuringStatusContext from "../hooks/MeasuringStatusContext";
import FormMessage from "./FormMessage";

interface Props {
    user: string
    setUser: (string) => void
    label: string
    setLabel: (string) => void
    action: () => void
    type: string
    message: string
    status: number
    hideTextField: boolean
}

export default function ApiForm(props: Props) {
    const [context, setContext]: any = useContext(MeasuringStatusContext);
    const [status, setStatus] = useState(0);

    async function checkUserStatus(user: string) {
        try {
            let result = await checkUserStatusRequest(user);
            setContext(result === 'true');
            setStatus(1);
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