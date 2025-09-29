import React, { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Input = ({ onSend }) => {
  const [message, setMessage] = useState('')
  const [fichier, setFichier] = useState(null)

  const gererEnvoie = () => {
    if (!message.trim() && !fichier) return
    const contenu = { message, fichier }
    onSend(contenu)
    setFichier(null)
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      gererEnvoie()
    }
  }
  const handleFichierChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFichier({
        nom: file.name,
        type: file.type,
        taille: file.size,
        url: URL.createObjectURL(file),
      })
    }
  }

  return (
    <StyledWrapper>
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label htmlFor="file">📎</label>
          <input type="file" id="file" onChange={handleFichierChange} />
        </div>
        <input
          required
          placeholder="Message..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          id="messageInput"
        />
        <button id="sendButton" onClick={gererEnvoie}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 664 663"
          >
            <path
              fill="none"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            />
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="33.67"
              stroke="#6c6c6c"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  )
}

export default Input
