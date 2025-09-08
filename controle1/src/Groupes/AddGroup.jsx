import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px;

  button {
    max-width: 160px;
    width: 100%;
    border: none;
    background-color: #a27b5c;
    color: #dcd7c9;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
  }

  button:hover {
    background-color: #916a4e;
    color: #fff;
  }

  .c-main {
    text-align: center;
  }
`

const Button = ({ modifer = true, showFormCreerGroupe }) => {
  return (
    <StyledWrapper>
      {modifer ? (
        <button className="c-button" onClick={showFormCreerGroupe}>
          <span className="c-main">Créer un groupe</span>
        </button>
      ) : (
        <button className="c-button" onClick={showFormCreerGroupe}>
          <span className="c-main">Ajouter des membres</span>
        </button>
      )}
    </StyledWrapper>
  )
}

export default Button
