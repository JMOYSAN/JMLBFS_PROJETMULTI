import React, { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const MessageBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 6px 12px;
`

const FileUploadWrapper = styled.div`
  position: relative;

  input[type='file'] {
    display: none;
  }

  label {
    cursor: pointer;
    font-size: 18px;
  }
`

const MessageInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
`

const SendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }
`

const Input = ({ onSend }) => {
  const [message, setMessage] = useState('')
  const [fichier, setFichier] = useState(null)

  const gererEnvoie = () => {
    if (!message.trim() && !fichier) return
    const contenu = { message, fichier }
    onSend(contenu)
    setFichier(null)
    console.log(contenu)
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
      <MessageBox>
        <FileUploadWrapper>
          <label htmlFor="file">📎</label>
          <input type="file" id="file" onChange={handleFichierChange} />
        </FileUploadWrapper>
        <MessageInput
          required
          placeholder="Message..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          id="messageInput"
        />
        <SendButton id="sendButton" onClick={gererEnvoie}>
          <svg>…</svg>
        </SendButton>
      </MessageBox>
    </StyledWrapper>
  )
}

export default Input
