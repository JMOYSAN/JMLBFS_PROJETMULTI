function Groupe({ groupe, setCurrentGroupe }) {
  return (
    <div onClick={() => setCurrentGroupe(groupe)} className="groupe">
      <h3 >{groupe.nom}</h3>
    </div>
  )
}

export default Groupe
