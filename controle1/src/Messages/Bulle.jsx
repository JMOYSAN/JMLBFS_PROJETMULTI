import envoyerMessageAuto from '../Mock/MockMessage.js'

function Bulle({ message }) {
  console.log(message)
  envoyerMessageAuto(0)
  return (
    <div className="containerMessage">
      <div className="timestamp">{message.date}</div>
      <div className="bulle">
        <div className="username">{message.auteur}</div>
        <div className="message">{message.texte}</div>
      </div>
    </div>
  )
}

export default Bulle
