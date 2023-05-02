import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Hello from "../assets/hello.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
      <img src={Hello} alt="hello" />
      <h1>
        Bem-vindo, <span>{userName}</span>!
      </h1>
      <h3>Por favor, selecione uma conversa para começar.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: black;
  }
`;
