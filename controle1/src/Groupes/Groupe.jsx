import { useEffect, useState } from 'react'

function Groupe({ currentUser, groupe, setCurrentGroupe }) {
  const [askConfirm, setAskConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isMember, setIsMember] = useState(false)

  const getNom = (u) =>
    typeof u === 'string' ? u : u?.nom || u?.username || ''

  // Check membership from DB when groupe or currentUser changes
  useEffect(() => {
    if (!groupe?.id || !currentUser?.id) return

    fetch(`http://localhost:3000/groups-users/group/${groupe.id}`)
      .then((res) => res.json())
      .then((members) => {
        const found = members.some((m) => m.id === currentUser.id)
        setIsMember(found)
      })
      .catch((err) =>
        console.error('Erreur vérification membre du groupe:', err)
      )
  }, [groupe, currentUser])

  const handleClick = () => {
    if (isMember) {
      setCurrentGroupe(groupe)
      return
    }
    setAskConfirm(true)
  }

  const handleJoin = async () => {
    console.log('Joining group:', {
      userId: currentUser?.id,
      groupId: groupe?.id,
    })

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

      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)

      const membersRes = await fetch(
        `http://localhost:3000/groups-users/group/${groupe.id}`
      )
      const members = await membersRes.json()

      setCurrentGroupe({ ...groupe, participants: members })
      setIsMember(true)
      setAskConfirm(false)
    } catch (err) {
      console.error('Erreur lors de la jointure au groupe:', err)
    } finally {
      setLoading(false)
    }
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
              <button
                type="button"
                onClick={() => setAskConfirm(false)}
                className="btn-no"
              >
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
