import React from "react"; 
import { useNavigate } from 'react-router-dom';

import style from '../../styles/RelatorioStyle.module.scss'

function Relatorio () {
    const navigate = useNavigate()


    return (
            <div className={style.ContainerPrincipal} >
            <div className={style.Title}>
                        <h2>Relatório</h2>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="descricao">Serviço Realizado</label>
                            <textarea className={style.InputField} name="servico" id="servico" />
                        </div>
                    </div>
                    <div className={style.ContainerLine}>

                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="dataExecucao">Data de Execução</label>
                            <input
                            type="date"
                            className={style.InputField}
                            name="dataExecucao"
                            id="dataExecucao"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="horaInicio">Hora de Inicio</label>
                            <input type='time' className={style.InputField} name="horaTermino " id="horaInicio" />
                        </div>

                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="horaTermino">Hora de Termino</label>
                            <input type='time' className={style.InputField} name="horaTermino" id="horaTermino" />
                        </div>

                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="dataEncerramento">Data de Encerramento</label>
                            <input className={style.InputField} name="dataEncerramento" id="dataEncerramento" />
                        </div>


                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="tecnicoResponsavel">Técnico Responsável</label>
                            <input className={style.InputField} name="tecnicoResponsavel" id="tecnicoResponsavel" />
                        </div>

                    </div>

                    <div className={style.ContainerButtons}>
                        <button className={style.BackButton} type="button" onClick={() => navigate("/home")}>
                            Voltar
                        </button>
                        <button className={style.SaveButton}  type="submit">
                            Save
                        </button>
                        <button className={style.RelatorioButton}  type="submit">
                            Encerrar
                        </button>
                    </div>

            </div>

    );
}

export default Relatorio