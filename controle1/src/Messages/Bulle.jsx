function Bulle({message}) {

    return (
        <div className="bulle">
            <div className="username">{message.username}</div>
            <div className="message">{message.message}</div>
            <div className="timestamp">{message.timestamp}</div>
        </div>
    )
}

export default Bulle