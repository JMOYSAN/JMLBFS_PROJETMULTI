import { useState } from "react";

function FormCreerGroupe({ utilisateurs, onClose, currentUser }) {
    const [nomGroupe, setNomGroupe] = useState("");
    const [participant, setParticipant] = useState("");
    const [participantsAjoutes, setParticipantsAjoutes] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const getNom = (u) => (typeof u === "string" ? u : u.nom);
    const listeNoms = Array.isArray(utilisateurs) ? utilisateurs.map(getNom) : [];

    const handleAddParticipant = (nom) => {
        const cible = (nom || "").trim();
        if (!cible) return;
        const existe = listeNoms.some((n) => n.toLowerCase() === cible.toLowerCase());
        const dejaAjoute = participantsAjoutes.some((n) => n.toLowerCase() === cible.toLowerCase());
        const estMoi = currentUser && cible.toLowerCase() === currentUser.toLowerCase();

        if (existe && !dejaAjoute && !estMoi) {
            setParticipantsAjoutes((prev) => [...prev, cible]);
            setParticipant("");
            setSuggestions([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nomGroupe.trim()) return;
        if (onClose) onClose(nomGroupe.trim(), participantsAjoutes);
    };

    const mettreAJourSuggestions = (val) => {
        const v = val.toLowerCase();
        const res = listeNoms
            .filter((n) => n.toLowerCase().includes(v))
            .filter((n) => !participantsAjoutes.some((p) => p.toLowerCase() === n.toLowerCase()))
            .filter((n) => !(currentUser && n.toLowerCase() === currentUser.toLowerCase()))
            .slice(0, 5);
        setSuggestions(res);
    };

    return (
        <div className="form-popup">
            <form onSubmit={handleSubmit}>
                <h2>Créer un nouveau groupe</h2>

                <label>
                    Nom du groupe:
                    <input
                        type="text"
                        value={nomGroupe}
                        onChange={(e) => setNomGroupe(e.target.value)}
                        required
                    />
                </label>

                <br />

                <label>
                    Ajouter un participant:
                    <input
                        type="text"
                        value={participant}
                        onChange={(e) => {
                            setParticipant(e.target.value);
                            mettreAJourSuggestions(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddParticipant(participant);
                            }
                        }}
                        placeholder="Nom d'utilisateur"
                    />
                </label>

                {suggestions.length > 0 && (
                    <div>
                        <h3>Suggestions</h3>
                        <ul className="suggestions">
                            {suggestions.map((nom) => (
                                <li key={nom} onClick={() => handleAddParticipant(nom)}>
                                    {nom}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {participantsAjoutes.length > 0 && (
                    <div>
                        <strong>Participants ajoutés :</strong>
                        <ul>
                            {participantsAjoutes.map((nom) => (
                                <li key={nom}>{nom}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button type="submit">Créer le groupe</button>
            </form>
        </div>
    );
}

export default FormCreerGroupe;
