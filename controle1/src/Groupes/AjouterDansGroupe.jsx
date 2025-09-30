import { useState } from 'react'

function FormAjouter({
  utilisateurs = [],
  currentGroupe,
  currentUser,
  setShowForm,
  setCurrentGroupe,
  setGroupes,
}) {
  const [saisie, setSaisie] = useState('')

  const getNom = (u) =>
    typeof u === 'string' ? u : u?.nom || u?.username || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentGroupe?.id || !saisie.trim()) return

    try {
      const user = utilisateurs.find(
        (u) => getNom(u).toLowerCase() === saisie.trim().toLowerCase()
      )
      if (!user) {
        alert('Utilisateur introuvable')
        return
      }

      // appel API pour ajouter ce user au groupe
      const res = await fetch('http://localhost:3000/groups-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, groupId: currentGroupe.id }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Erreur ajout API:', err)
        alert(err.error || "Erreur lors de l'ajout")
        return
      }

      // recharger membres depuis API
      const updatedRes = await fetch(
        `http://localhost:3000/groups-users/group/${currentGroupe.id}`
      )
      const members = await updatedRes.json()

      const groupeMisAJour = { ...currentGroupe, participants: members }
      setCurrentGroupe(groupeMisAJour)
      setGroupes?.((prev) =>
        prev.map((g) => (g.id === currentGroupe.id ? groupeMisAJour : g))
      )
      setShowForm?.(false)
    } catch (err) {
      console.error('Erreur handleSubmit:', err)
    } finally {
      setSaisie('')
    }
  }

  return (
    <div className="form-popup">
      <form onSubmit={handleSubmit}>
        <h2>Ajouter un participant à “{currentGroupe?.nom}”</h2>

        <div>
          Membres actuels :
          <ul>
            {(currentGroupe?.participants || []).map((p) => (
              <li key={p.id || getNom(p)}>{getNom(p)}</li>
            ))}
          </ul>
        </div>

        <label>
          Nom d'utilisateur :
          <input
            type="text"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="Nom d'utilisateur"
          />
        </label>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  )
}

export default FormAjouter
