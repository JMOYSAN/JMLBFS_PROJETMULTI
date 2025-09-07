function BulleAutre({ message }) {
  return (
    <div className="containerMessage">
      <div className="timestamp">{message.date}</div>
      <div className="bulleAutre">
        <div className="username">{message.auteur}</div>

        {message.texte && <div className="message">{message.texte}</div>}

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
