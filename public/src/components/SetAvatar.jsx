import React, { useEffect, useState } from "react";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import mysql from "mysql";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 6000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Por favor, escolha um avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));

      // Conecte-se ao banco de dados MySQL
      const connection = mysql.createConnection({
        host: 'zero-waste.mysql.database.azure.com',
        user: 'zerowaste',
        password: '@amell2023',
        database: 'db_zerowaste',
      });

      // Execute uma consulta para obter a foto do usuário
      const query = `SELECT foto FROM tbl_usuario_teste WHERE id = '${tbl_usuario_teste._id}';`; // Substitua "users" pelo nome da tabela onde as informações dos usuários estão armazenadas

      connection.query(query, (error, results) => {
        if (error) {
          toast.error("Erro ao configurar o avatar. Por favor, tente novamente.", toastOptions);
        } else {
          const foto = results[0].foto; // Supondo que a coluna da foto seja chamada de "photo", ajuste o nome da coluna conforme necessário

          user.isAvatarImageSet = true;
          user.avatarImage = foto;
          localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
          navigate("/");
        }

        connection.end(); // Encerre a conexão com o banco de dados
      });
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 6; i++) {
        const response = await fetch(`${api}${Math.round(Math.random() * 1000)}`);
        const svg = await response.text();
        data.push(svg);
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Escolha um Avatar para sua foto de perfil</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${btoa(avatar)}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Definir como imagem de perfil
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #DEF6D8;
    color: black;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #8ebe94;
    }
  }
`;
