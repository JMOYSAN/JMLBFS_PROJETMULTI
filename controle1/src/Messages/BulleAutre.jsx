function BulleAutre({ message }) {
  return (
    <div className="containerMessage">
      <div className="timestamp">{message.date}</div>
      <div className="bulleAutre">
        <div className="username">{message.auteur}</div>
        <div className="message">{message.texte}</div>
      </div>
    </div>
  )
}

export default BulleAutre
