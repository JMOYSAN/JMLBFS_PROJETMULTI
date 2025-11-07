function Bulle({ message, members, onDelete = () => {} }) {
  return (
    <div className="containerMessage" style={{ position: 'relative' }}>
      <div className="timestamp">{message.created_at}</div>
      <div className="bulle" style={{ position: 'relative', paddingRight: 24 }}>
        <div className="username">{members[message.user_id] || 'Inconnu'}</div>
        {message.content && <div className="message">{message.content}</div>}

        <button
          onClick={() => {
            if (window.confirm('Supprimer ce message ?')) onDelete()
          }}
          style={{
            position: 'absolute',
            top: 4,
            right: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
          aria-label="Supprimer"
          title="Supprimer"
        >
          ✖
        </button>
      </div>
    </div>
  )
}
export default Bulle
