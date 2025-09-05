function genererUtilisateurs(nombre = 10) {
    const tousLesNoms = [
        "Alice", "Bob", "Charlie", "Diana", "Eve",
        "Frank", "Grace", "William", "Ivan", "Judy",
        "Karl", "Laura", "Oliver Fortin", "Lyam", "Olivia",
        "Simon", "Quentin", "Rupert", "Mathurin", "Joaquim"
    ]

    const tousLesStatuts = ["en-ligne", "hors-ligne", "absent", "occupe"]

    const utilisateurs = []

    for (let i = 0; i < nombre; i++) {
        const nomAleatoire = tousLesNoms[Math.floor(Math.random() * tousLesNoms.length)]
        const statutAleatoire = tousLesStatuts[Math.floor(Math.random() * tousLesStatuts.length)]

        const utilisateur = {
            id: i + 1,
            nom: nomAleatoire,
            statut: statutAleatoire,
        }

        utilisateurs.push(utilisateur)
    }

    return utilisateurs
}

export default genererUtilisateurs
