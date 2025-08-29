function Sidebar({onLogout}) {
    return (
        <div className="sidebar">
                <button id="deconnexion" onClick={onLogout}>Déconnexion</button>
        </div>
    );
}

export default Sidebar;