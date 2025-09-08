function Groupe({ currentUser, groupe, setCurrentGroupe }) {
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
    if (!window.confirm(`Voulez-vous rejoindre le groupe "${groupe.nom}" ?`))
      return

    if (!groupe.participants.some((p) => getNom(p) === userNom)) {
      groupe.participants.push({ nom: userNom, isTyping: false })
    }

    setCurrentGroupe({ ...groupe })
  }

  return (
    <div onClick={handleClick} className="groupe">
      <h3>{groupe.nom}</h3>
    </div>
  )
}

export default Groupe
