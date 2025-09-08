import React, { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  .messageBox {
    width: 50%;
    height: 40px;
    margin-right: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-radius: 10px;
    border: 1px solid #a27b5c;
    background-color: #2c3639;
    color: #dcd7c9;
  }
  .messageBox:focus-within {
    border: 1px solid rgb(110, 110, 110);
  }
  .fileUploadWrapper {
    width: fit-content;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
  }

  #file {
    display: none;
  }
  .fileUploadWrapper label {
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .fileUploadWrapper label svg {
    height: 18px;
  }
  .fileUploadWrapper label svg path {
    transition: all 0.3s;
  }
  .fileUploadWrapper label svg circle {
    transition: all 0.3s;
  }
  .fileUploadWrapper label:hover svg path {
    stroke: #fff;
  }
  .fileUploadWrapper label:hover svg circle {
    stroke: #fff;
    fill: #3c3c3c;
  }
  .fileUploadWrapper label:hover .tooltip {
    display: block;
    opacity: 1;
  }
  .tooltip {
    position: absolute;
    top: -40px;
    display: none;
    opacity: 0;
    color: white;
    font-size: 10px;
    text-wrap: nowrap;
    background-color: #000;
    padding: 6px 10px;
    border: 1px solid #3c3c3c;
    border-radius: 5px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.596);
    transition: all 0.3s;
  }
  #messageInput {
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    padding-left: 10px;
    color: white;
  }
  #messageInput:focus ~ #sendButton svg path,
  #messageInput:valid ~ #sendButton svg path {
    fill: #3c3c3c;
    stroke: white;
  }

  #sendButton {
    width: fit-content;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  #sendButton svg {
    height: 18px;
    transition: all 0.3s;
  }
  #sendButton svg path {
    transition: all 0.3s;
  }
  #sendButton:hover svg path {
    fill: #3c3c3c;
    stroke: white;
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
