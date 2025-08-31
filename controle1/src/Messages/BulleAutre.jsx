function BulleAutre({message}) {

    return (
        <div className='containerMessage'>
            <div className="timestamp">{message.timestamp}</div>
            <div className="bulleAutre">
                <div className="username">{message.username}</div>
                <div className="message">{message.message}</div>
            </div>
        </div>
    )
}

export default BulleAutre