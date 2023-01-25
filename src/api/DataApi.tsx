const API_ADDRESS = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

export async function getUserLastLine(user: string) {
    return await fetch(`${API_ADDRESS}/data/last_line/${user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    }).then(r => {
        return r.json();
    }).then(r => {
        return r.data;
    });
}

export async function checkUserStatusRequest(user: string) {
    return await fetch(`${API_ADDRESS}/data/get/${user}/measure_proxy`, {
        method: "POST",
    }).then(r => {
        return r.text()
    });
}

export async function stopUserMeasurement(user: string) {
    return await fetch(`${API_ADDRESS}/data/stop_measurement/${user}`, {
        method: "POST",
    });
}

export async function startUserMeasurement(user: string, label: string) {
    return await fetch(`${API_ADDRESS}/data/start_measurement/${user}/${label}`, {
        method: "POST",
    });
}