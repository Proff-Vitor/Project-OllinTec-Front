import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { fetchOrdensSevico } from "../../actions/osActions";
import { OrdemServico } from "../../types/OrdemServico";

import HomeStyle from '../../styles/HomeStyle.module.scss'
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

function Home(){
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { ordens, loading } = useSelector((state: RootState) => state.os);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchOrdensSevico());
  }, [dispatch]);

  const filteredOS = ordens.filter((item: OrdemServico) =>
    (item.statusId !== 3) && (
      item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numeroOs?.toString().includes(searchTerm)
    )
  );

  return (
    <div className={GlobalStyle.PageContainer}>
      <div className={GlobalStyle.Logo}></div>
      <div className={HomeStyle.OsContainer}>
        <input 
          className={HomeStyle.Search}
          type="search" 
          name="searchOS" 
          id="searchOS"
          placeholder="Pesquisar uma OS" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <button className={HomeStyle.Button} onClick={() => navigate("/createOs")}>
          Nova OS
        </button>
        
        <aside className={HomeStyle.ListOS}>
          {loading ? (
            <p className={HomeStyle.LoadingText}>Carregando...</p>
          ) : filteredOS.length > 0 ? (
            <ul>
              {filteredOS.map((item: OrdemServico, index: number) => (
                <li 
                  key={index} 
                  className={HomeStyle.Item}
                  onClick={() => navigate(`/viewOs?id=${item.numeroOs}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={HomeStyle.ItemHeader}>
                    <h3 className={HomeStyle.OSNumber}>OS #{item.numeroOs}</h3>
                    <span className={HomeStyle.Status}>{item.status || "Não iniciado"}</span>
                  </div>
                  <h3 className={HomeStyle.OSTitle}>{item.titulo}</h3>
                  <p className={HomeStyle.OSDescription}>{item.descricao}</p>
                  <div className={HomeStyle.ItemFooter}>
                    <span className={HomeStyle.Setor}>{item.setor || "Setor não informado"}</span>
                    <span className={HomeStyle.Date}>
                      {item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString() : "Data não informada"}
                    </span>
                    <span className={HomeStyle.Tecnico}>{item.nomeTecnico || "Técnico não atribuído"}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={HomeStyle.NoData}>Nenhuma OS encontrada</p>
          )}
        </aside>
      </div>
      <footer className={HomeStyle.User}>
        <h3>Sistema de Gestão de Manutenção</h3>
      </footer>
    </div>
  );
}

export default Home;