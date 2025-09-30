import { useEffect, useState } from 'react'

function Groupe({ currentUser, groupe, setCurrentGroupe }) {
  const [askConfirm, setAskConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [estMembre, setEstMembre] = useState(false)

  useEffect(() => {
    if (currentUser?.id && groupe?.id) {
      isMember(currentUser.id, groupe.id).then(setEstMembre)
    }
  }, [currentUser, groupe])

  const handleClick = () => {
    if (estMembre) {
      setCurrentGroupe(groupe)
      return
    }
    setAskConfirm(true)
  }
  async function isMember(userId, groupId) {
    try {
      const res = await fetch(
        `http://localhost:3000/groups-users/group/${groupId}`
      )
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
      const members = await res.json()
      return members.some((m) => m.id === userId)
    } catch (err) {
      console.error('Erreur vérification membre:', err)
      return false
    }
  }

  const handleJoin = async () => {
    try {
      setLoading(true)

      const res = await fetch('http://localhost:3000/groups-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          groupId: groupe.id,
        }),
      })

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`)
      }

      // Mets à jour l’état local
      setCurrentGroupe(groupe)
      console.log(groupe)
      setAskConfirm(false)
    } catch (err) {
      console.error('Erreur lors de la jointure au groupe:', err)
    } finally {
      setLoading(false)
    }
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
              <button type="submit" className="btn-yes" disabled={loading}>
                {loading ? '...' : 'Oui'}
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
