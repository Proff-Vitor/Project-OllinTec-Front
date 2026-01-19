import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { useForm } from "react-hook-form";
import { OrdemServico } from "../../types/OrdemServico";
import { addOrdemServico } from "../../actions/osActions";
import { fetchSetores } from "../../actions/setorActions";
import { fetchEquipamentos } from "../../actions/equipamentoActions";
import TecnicoService, { Tecnico } from "../../services/TecnicoService";
import ExecucaoOsTecnicoService from "../../services/ExecucaoOsTecnicoService";
import OrdemServicoEquipamentoService from "../../services/OrdemServicoEquipamentoService";

import style from '../../styles/CreateOsStyle.module.scss';
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

interface CreateOSForm extends OrdemServico {
    tecnicoId?: number;
    equipamentoId?: number;
}

function CreateOs () {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { setores } = useSelector((state: RootState) => state.setor);
    const { equipamentos } = useSelector((state: RootState) => state.equipamento);
    const [loading, setLoading] = useState(false);
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);

    const os = useForm<CreateOSForm>({
        defaultValues: {
          numeroOs: 0,
          dataCriacao: "",
          usuarioCadastroId: 1,
          titulo: "",
          descricao: "",
          statusId: 1,
          dataEncerramento: null,
          setorId: undefined,
          tecnicoId: undefined,
          equipamentoId: undefined
        }
    });

    useEffect(() => {
        dispatch(fetchSetores());
        dispatch(fetchEquipamentos());
        
        const fetchTecnicos = async () => {
            try {
                const data = await TecnicoService.listarTecnicos();
                setTecnicos(data);
            } catch (error) {
                console.error("Erro ao buscar técnicos:", error);
            }
        };
        
        fetchTecnicos();
    }, [dispatch]);

    const registerOs = async (data: CreateOSForm) => {
        if (!data.titulo || !data.descricao) {
            toast.error("Preencha título e descrição", { theme: "dark" });
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                titulo: data.titulo,
                descricao: data.descricao,
                dataCriacao: new Date().toISOString(),
                usuarioCadastroId: 1,
                statusId: 1,
                dataEncerramento: null,
                setorId: data.setorId ? parseInt(data.setorId.toString()) : undefined,
                tecnicoId: data.tecnicoId ? parseInt(data.tecnicoId.toString()) : undefined
            };
            
            const osData = await dispatch(addOrdemServico(payload));
            
            // Se um técnico foi selecionado, criar a execução
            if (data.tecnicoId && osData?.numeroOs) {
                try {
                    await ExecucaoOsTecnicoService.criarExecucao({
                        numeroOs: osData.numeroOs,
                        tecnicoId: data.tecnicoId,
                        dataExecucao: new Date().toISOString().split('T')[0]
                    });
                } catch (error) {
                    console.error("Erro ao atribuir técnico:", error);
                }
            }

            // Se um equipamento foi selecionado, associar à OS
            if (data.equipamentoId && osData?.numeroOs) {
                try {
                    await OrdemServicoEquipamentoService.associarEquipamento(
                        osData.numeroOs,
                        data.equipamentoId
                    );
                } catch (error) {
                    console.error("Erro ao associar equipamento:", error);
                }
            }
            
            toast.success("Ordem de Serviço cadastrada com sucesso!", { theme: "dark" });
            setTimeout(() => navigate("/home"), 2000);
        } catch (err: any) {
            console.error("Erro ao cadastrar OS:", err);
            toast.error(err.message || "Erro ao cadastrar OS", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={GlobalStyle.PageContainer}>
            <ToastContainer/>
            <div className={GlobalStyle.Logo}/>
            <div className={style.ContainerPrincipal}>
                <div className={style.Title}>
                    <h2>Criar Ordem de Serviço</h2>
                </div>

                <form onSubmit={os.handleSubmit(registerOs)}>
                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="titulo">Título *</label>
                            <input 
                                className={style.InputField} 
                                {...os.register("titulo", { required: true })} 
                                type="text" 
                                placeholder="Título da OS" 
                            />
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="descricao">Descrição *</label>
                            <textarea 
                                className={style.InputField} 
                                {...os.register("descricao", { required: true })} 
                                placeholder="Descrição detalhada da OS"
                            />
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="setorId">Setor</label>
                            <select 
                                className={style.InputField}
                                {...os.register("setorId")}
                            >
                                <option value="">Selecione um setor</option>
                                {setores.map((s: any) => (
                                    <option key={s.setor_id} value={s.setor_id}>
                                        {s.nome_setor}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="tecnicoId">Técnico Responsável</label>
                            <select 
                                className={style.InputField}
                                {...os.register("tecnicoId")}
                            >
                                <option value="">Selecione um técnico</option>
                                {tecnicos.map((t: Tecnico) => (
                                    <option key={t.tecnicoId} value={t.tecnicoId}>
                                        {t.nomeTecnico}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel} htmlFor="equipamentoId">Equipamento</label>
                            <select 
                                className={style.InputField}
                                {...os.register("equipamentoId")}
                            >
                                <option value="">Selecione um equipamento</option>
                                {equipamentos.map((eq: any) => (
                                    <option key={eq.equipamento_id} value={eq.equipamento_id}>
                                        {eq.nome_equipamento}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={style.ContainerButtons}>
                        <button className={style.BackButton} type="button" onClick={() => navigate("/home")}>
                            Voltar
                        </button>
                        <button className={style.RegisterButton} type="submit" disabled={loading}>
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateOs