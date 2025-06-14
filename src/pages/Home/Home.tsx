import React, { useEffect, useState } from "react";
import styled from 'styled-components';

import HomeStyle from '../../styles/HomeStyle.module.scss'
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

import { Navigate } from "react-router-dom";


function Home(){

    const OS = [{
      id: '1', 
      objetivo: 'Montagem de Computadores no laboratório B-03',
      setor: "TJ",
      solicitante: 'João da Silva',
      responsavel: 'Vitor de Jesus',
      data: '11/04/2025',
    }, {
      id: '1', 
      objetivo: 'Montagem de Computadores no laboratório B-03',
      setor: "TJ",
      solicitante: 'João da Silva',
      responsavel: 'Vitor de Jesus',
      data: '11/04/2025',
    }, {
      id: '1', 
      objetivo: 'Montagem de Computadores no laboratório B-03',
      setor: "TJ",
      solicitante: 'João da Silva',
      responsavel: 'Vitor de Jesus',
      data: '11/04/2025',
    }, {
      id: '1', 
      objetivo: 'Montagem de Computadores no laboratório B-03',
      setor: "TJ",
      solicitante: 'João da Silva',
      responsavel: 'Vitor de Jesus',
      data: '11/04/2025',
    }, {
      id: '1', 
      objetivo: 'Montagem de Computadores no laboratório B-03',
      setor: "TJ",
      solicitante: 'João da Silva',
      responsavel: 'Vitor de Jesus',
      data: '11/04/2025',
    }, {
      id: '1', 
      objetivo: 'Montagem de Computadores no laboratório B-03',
      setor: "TJ",
      solicitante: 'João da Silva',
      responsavel: 'Vitor de Jesus',
      data: '11/04/2025',
    }
  ]
    return (
        <div className={GlobalStyle.PageContainer}>
          <div className={GlobalStyle.Logo}></div>
          <div className={HomeStyle.OsContainer}>
            <input className={HomeStyle.Search}
            type="search" 
            name="searchOS" 
            id="searchOS"
            placeholder="Pesquisar uma OS" />
            
            <button className={HomeStyle.Button}> New OS</button>
            
            <aside className={HomeStyle.ListOS}>
              <ul>
                {OS.map((item,index) => (
                  <li key={index} className={HomeStyle.Item}>
                    <h3>{item.id}</h3>
                    <h3>{item.objetivo}</h3>
                    <h3>{item.setor}</h3>
                    <h3>{item.solicitante}</h3>
                    <h3>{item.responsavel}</h3>
                    <h3>{item.data}</h3>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
          <footer className={HomeStyle.User}>
            <h3>
                User: Vitor
            </h3>
            <h3>
                Cargo: Técnico
            </h3>
          </footer>
        </div>
        
  );
};


export default Home;