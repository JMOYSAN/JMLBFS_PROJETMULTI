function Sidebar({onLogout}) {
    return (
        <div className="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
                <button id="deconnexion" onClick={onLogout}>Déconnexion</button>
            </ul>
        </div>
    );
}

export default Sidebar;