interface Props {
    message: string
    status: number
}

export default function FormMessage(props: Props) {
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