import { useState } from 'react'

function FormCreerGroupe({
  utilisateurs,
  currentUser,
  setShowForm,
  setGroupes,
}) {
  const [nomGroupe, setNomGroupe] = useState('')
  const [participant, setParticipant] = useState('')
  const [participantsAjoutes, setParticipantsAjoutes] = useState([])
  const [groupeVisibility, setGroupeVisibility] = useState('public')

  const getNom = (u) =>
    typeof u === 'string' ? u : u?.nom || u?.username || ''

  const handleAddParticipant = (nom) => {
    const cible = (nom || '').trim()
    if (!cible) return
    if (
      participantsAjoutes.some((n) => n.toLowerCase() === cible.toLowerCase())
    )
      return
    setParticipantsAjoutes((prev) => [...prev, cible])
    setParticipant('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nomGroupe.trim()) return
    try {
      const res = await fetch('http://localhost:3000/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nomGroupe.trim(),
          is_private: groupeVisibility === 'private' ? 1 : 0,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erreur création groupe')
      }
      const group = await res.json()
      await fetch('http://localhost:3000/groups-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, groupId: group.id }),
      })
      for (const nom of participantsAjoutes) {
        const user = utilisateurs.find((u) => getNom(u) === nom)
        if (!user) continue
        await fetch('http://localhost:3000/groups-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, groupId: group.id }),
        })
      }
      setGroupes?.((prev) => [...prev, { ...group, participants: [] }])

      setShowForm(false)
    } catch (err) {
      console.error('Erreur handleSubmit:', err)
      alert(err.message)
    } finally {
      setShowForm(false)
    }
  }

  return (
    <div className="form-popup">
      <form onSubmit={handleSubmit}>
        <h2>Créer un nouveau groupe</h2>
        <label>
          Nom du groupe :
          <input
            type="text"
            value={nomGroupe}
            onChange={(e) => setNomGroupe(e.target.value)}
            required
          />
        </label>
        <label>
          Choisir la visibilité :
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="public"
                checked={groupeVisibility === 'public'}
                onChange={(e) => setGroupeVisibility(e.target.value)}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                value="private"
                checked={groupeVisibility === 'private'}
                onChange={(e) => setGroupeVisibility(e.target.value)}
              />
              Privé
            </label>
          </div>
        </label>
        <label>
          Ajouter un participant :
          <input
            type="text"
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddParticipant(participant)
              }
            }}
            placeholder="Nom d'utilisateur"
          />
        </label>
        {participantsAjoutes.length > 0 && (
          <div>
            <strong>Participants ajoutés :</strong>
            <ul className="participants-list">
              {participantsAjoutes.map((nom) => (
                <li key={nom}>{nom}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit">Créer le groupe</button>
      </form>
    </div>
  )
}

export default FormCreerGroupe
