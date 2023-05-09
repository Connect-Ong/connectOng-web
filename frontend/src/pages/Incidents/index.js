import React, { useEffect, useState } from 'react';
import './styles.css';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { useHistory } from 'react-router-dom';

export default function Profile() {

  const [incidents, setIncidents] = useState([]);

  useHistory();
  useEffect(() => {
    localStorage.clear();
    api.get('/incidents', {
      headers: {}
    }).then(response => {
      setIncidents(response.data);
    });

  }, [])

  return (
    <div className="profile-container">
      <header>
        <h1>Casos Cadastrados</h1>
        <img src={logoImg} alt="Connect ONG"/>
      </header>

      <ul>
        {
          incidents.length !== 0 ?
          incidents.map(incident => (
            <li key={incident.id}>

              <img className = { 
                incident.sensible_content ? 'blurred-img' : '' } 
                src={incident.img_url} alt={incident.img_url} 
                onError={(e) => e.target.src='https://i.imgur.com/oLLacJa.png'}
                onClick={() => { 
                  setIncidents(
                    incidents.map(i => i.id === incident.id ? {...incident, sensible_content: !incident.sensible_content} : i)
                  ) 
                } 
              }/> 

              <strong>CASO: </strong>
              <p>{incident.title}</p>

              <strong>DESCRIÇÃO: </strong>
              <p>{incident.description}</p>

              <strong>VALOR: </strong>
              <p>{incident.value === 0 ? "GRÁTIS" : Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

              <strong>ONG </strong>
              <p>{incident.name}</p>

              <strong>CONTATO </strong>
              <p>Email: {incident.email}</p>
              <p>Whatsapp: {incident.whatsapp}</p>
              
            </li>
          ))
          :
          ( <p className="profile-empty"> Nenhum caso cadastrado. </p> )
        }


      </ul>
    </div>
  )
}