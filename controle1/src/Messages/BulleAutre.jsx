function BulleAutre({ message, members }) {
  return (
    <div className="containerMessage">
      <div className="timestamp">{message.created_at}</div>
      <div className="bulleAutre">
        <div className="username">{members[message.user_id]}</div>

        {message.content && <div className="message">{message.content}</div>}

        {message.fichier?.type?.startsWith('image/') && (
          <img
            src={message.fichier.url}
            alt={message.fichier.nom}
            style={{ maxWidth: '200px', borderRadius: '8px' }}
          />
        )}

        {message.fichier && !message.fichier.type?.startsWith('image/') && (
          <a href={message.fichier.url} download>
            📎 {message.fichier.nom}
          </a>
        )}
      </div>
    </div>
  )
}

export default BulleAutre
