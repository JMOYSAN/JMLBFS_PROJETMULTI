import { useState } from 'react'

function Groupe({ currentUser, groupe, setCurrentGroupe }) {
  const [askConfirm, setAskConfirm] = useState(false)

  const getNom = (u) => (typeof u === 'string' ? u : u?.nom || '')
  const userNom = getNom(currentUser)

  const estMembre = (groupe.participants || []).some(
    (p) => getNom(p) === userNom
  )

  const handleClick = () => {
    if (estMembre) {
      setCurrentGroupe(groupe)
      return
    }
    setAskConfirm(true)
  }

  const handleJoin = () => {
    if (!groupe.participants.some((p) => getNom(p) === userNom)) {
      groupe.participants.push({ nom: userNom, isTyping: false })
    }
    setCurrentGroupe({ ...groupe })
    setAskConfirm(false)
  }

  const handleCancel = () => {
    setAskConfirm(false)
  }

  return (
    <>
      <div onClick={handleClick} className="groupe">
        <h3>{groupe.nom}</h3>
      </div>

      {askConfirm && (
        <div className="confirm-join">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleJoin()
            }}
            className="confirm-box"
          >
            <p>Voulez-vous rejoindre ce groupe&nbsp;?</p>
            <div className="actions">
              <button type="submit" className="btn-yes">
                Oui
              </button>
              <button type="button" onClick={handleCancel} className="btn-no">
                Non
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default Groupe
