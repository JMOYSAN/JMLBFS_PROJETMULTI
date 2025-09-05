function normaliserUtilisateur(utilisateur, index) {
    if (typeof utilisateur === "string") {
        return { id: index, nom: utilisateur, statut: "hors-ligne", avatar: null }
    }
    return {
        id: utilisateur.id ?? index,
        nom: utilisateur.username ?? utilisateur.nom ?? "Utilisateur",
        statut: utilisateur.statut ?? "hors-ligne",
        avatar: utilisateur.avatar ?? null,
    }
}

function LigneUtilisateur({ utilisateur, estUtilisateurActuel }) {
    const { nom, statut, avatar } = utilisateur
    const initiale = nom?.[0]?.toUpperCase() ?? "?"

    return (
        <div className={`utilisateur-ligne ${estUtilisateurActuel ? "moi" : ""}`}>
            <span className={`statut ${statut}`} />
            {avatar ? (
                <img className="avatar" src={avatar} alt={`Avatar de ${nom}`} />
            ) : (
                <div className="avatar">{initiale}</div>
            )}
            <div className="nom">{nom}</div>
        </div>
    )
}

function Utilisateurs({
                          utilisateurs,
                          utilisateurActuel,
                      }) {
    const listeUtilisateurs = Array.isArray(utilisateurs)
        ? utilisateurs.map((utilisateur, index) =>
            normaliserUtilisateur(utilisateur, index)
        )
        : []

    return (
        <div id="sidebar_Utilisateurs">
            {listeUtilisateurs.map((utilisateur) => (
                <LigneUtilisateur
                    key={utilisateur.id}
                    utilisateur={utilisateur}
                    estUtilisateurActuel={utilisateur.nom === utilisateurActuel}
                />
            ))}
        </div>
    )
}

export default Utilisateurs
