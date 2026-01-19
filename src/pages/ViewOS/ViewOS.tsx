import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { getOrdemServico, updateOrdemServico, deleteOrdemServico } from "../../actions/osActions";
import { useForm } from "react-hook-form";
import { OrdemServico } from "../../types/OrdemServico";
import RelatorioOsService from "../../services/RelatorioOsService";
import TecnicoService, { Tecnico } from "../../services/TecnicoService";
import ExecucaoOsTecnicoService, { ExecucaoOsTecnico } from "../../services/ExecucaoOsTecnicoService";

import style from '../../styles/ViewOsStyle.module.scss';
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

function ViewOS () {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { osAtual, loading } = useSelector((state: RootState) => state.os);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showRelatorioModal, setShowRelatorioModal] = useState(false);
    const [relatorioDescricao, setRelatorioDescricao] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [tecnicoIdEdicao, setTecnicoIdEdicao] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    const [execucoes, setExecucoes] = useState<ExecucaoOsTecnico[]>([]);
    const [tecnicoAtribuido, setTecnicoAtribuido] = useState<Tecnico | null>(null);

    const numeroOs = searchParams.get('id');
    const isAdmin = user?.is_admin || false;

    const form = useForm<OrdemServico>({
        defaultValues: osAtual || {
            numeroOs: 0,
            dataCriacao: "",
            usuarioCadastroId: 0,
            titulo: "",
            descricao: "",
            statusId: 1,
            dataEncerramento: null
        }
    });

    useEffect(() => {
        if (numeroOs) {
            dispatch(getOrdemServico(parseInt(numeroOs)));
            carregarExecucoes(parseInt(numeroOs));
        }
        
        // Fetch technicians
        const fetchTecnicos = async () => {
            try {
                const data = await TecnicoService.listarTecnicos();
                setTecnicos(data);
            } catch (error) {
                console.error("Erro ao buscar técnicos:", error);
            }
        };
        
        fetchTecnicos();
    }, [numeroOs, dispatch]);

    const carregarExecucoes = async (numeroOs: number) => {
        try {
            const data = await ExecucaoOsTecnicoService.listarPorOS(numeroOs);
            setExecucoes(data);
        } catch (error) {
            console.error("Erro ao buscar execuções:", error);
        }
    };

    useEffect(() => {
        if (osAtual) {
            console.log('Resetando form com osAtual:', osAtual);
            form.reset(osAtual);
        }
    }, [osAtual, form]);

    useEffect(() => {
        if (execucoes.length > 0 && tecnicos.length > 0) {
            const tecnico = tecnicos.find(t => t.tecnicoId === execucoes[0].tecnicoId);
            setTecnicoAtribuido(tecnico || null);
            setTecnicoIdEdicao(execucoes[0].tecnicoId?.toString() || "");
        }
    }, [execucoes, tecnicos]);

    const onSubmit = async (data: OrdemServico) => {
        console.log('onSubmit chamado com data:', data);
        console.log('isEditing:', isEditing);

        setIsSaving(true);
        try {
            if (numeroOs) {
                await dispatch(updateOrdemServico(parseInt(numeroOs), data));
                
                // Se um técnico foi selecionado, atualizar a execução
                if (tecnicoIdEdicao) {
                    try {
                        // Se já existe execução, deletar a antiga
                        if (execucoes.length > 0) {
                            await ExecucaoOsTecnicoService.deletar(execucoes[0].execucaoId!);
                        }
                        
                        // Criar nova execução com o técnico selecionado
                        await ExecucaoOsTecnicoService.criarExecucao({
                            numeroOs: parseInt(numeroOs),
                            tecnicoId: parseInt(tecnicoIdEdicao),
                            dataExecucao: new Date().toISOString().split('T')[0]
                        });
                        
                        // Recarregar execuções
                        carregarExecucoes(parseInt(numeroOs));
                    } catch (error) {
                        console.error("Erro ao atribuir técnico:", error);
                    }
                }
                
                toast.success("OS atualizada com sucesso!", { theme: "dark" });
                setIsEditing(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar OS", { theme: "dark" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEncerrarOS = async () => {
        if (!relatorioDescricao.trim()) {
            toast.error("Preencha a descrição do relatório", { theme: "dark" });
            return;
        }

        setIsSaving(true);
        try {
            if (numeroOs && osAtual) {
                // Criar relatório
                const relatorioData = {
                    numeroOs: parseInt(numeroOs),
                    descricao: relatorioDescricao,
                    ...(tecnicoId && { tecnicoId: parseInt(tecnicoId) }),
                    ...(dataInicio && { dataInicio: dataInicio }),
                    ...(dataFim && { dataFim: dataFim }),
                };

                await RelatorioOsService.criarRelatorio(relatorioData);

                // Atualizar OS
                const dataAtualizada: OrdemServico = {
                    ...osAtual,
                    statusId: 3,
                    dataEncerramento: new Date().toISOString()
                };
                
                await dispatch(updateOrdemServico(parseInt(numeroOs), dataAtualizada));
                toast.success("OS encerrada com sucesso!", { theme: "dark" });
                setShowRelatorioModal(false);
                setRelatorioDescricao("");
                setTecnicoId("");
                setDataInicio("");
                setDataFim("");
                setTimeout(() => navigate("/home"), 2000);
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao encerrar OS", { theme: "dark" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) {
            toast.error("Apenas administradores podem deletar OS", { theme: "dark" });
            return;
        }

        if (window.confirm("Tem certeza que deseja deletar esta OS?")) {
            try {
                if (numeroOs) {
                    await dispatch(deleteOrdemServico(parseInt(numeroOs)));
                    toast.success("OS deletada com sucesso!", { theme: "dark" });
                    setTimeout(() => navigate("/home"), 2000);
                }
            } catch (error: any) {
                toast.error(error.message || "Erro ao deletar OS", { theme: "dark" });
            }
        }
    };

    const handleExportarPDF = async () => {
        if (!osAtual) {
            toast.error("OS não encontrada", { theme: "dark" });
            return;
        }

        try {
            // Dynamically import jsPDF
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.default;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Add title
            pdf.setFontSize(16);
            pdf.text('Ordem de Serviço', 15, 15);
            pdf.setFontSize(10);
            pdf.text(`Data de Geração: ${new Date().toLocaleDateString()}`, 15, 25);

            // Add OS details
            let currentY = 35;
            const lineHeight = 7;
            const labelWidth = 50;

            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            
            const details = [
                { label: 'Número OS:', value: osAtual.numeroOs?.toString() || '' },
                { label: 'Título:', value: osAtual.titulo || '' },
                { label: 'Descrição:', value: osAtual.descricao || '' },
                { label: 'Status:', value: osAtual.statusId === 1 ? 'Não Iniciado' : osAtual.statusId === 2 ? 'Em Andamento' : 'Concluído' },
                { label: 'Data de Criação:', value: osAtual.dataCriacao ? new Date(osAtual.dataCriacao).toLocaleDateString() : '' },
                { label: 'Data de Encerramento:', value: osAtual.dataEncerramento ? new Date(osAtual.dataEncerramento).toLocaleDateString() : 'N/A' },
                { label: 'Técnico Responsável:', value: tecnicoAtribuido?.nomeTecnico || 'Não atribuído' },
            ];

            details.forEach(detail => {
                pdf.setFont(undefined, 'bold');
                pdf.text(detail.label, 15, currentY);
                pdf.setFont(undefined, 'normal');
                
                // Handle long text wrapping
                const maxWidth = 150;
                const splitText = pdf.splitTextToSize(detail.value, maxWidth);
                pdf.text(splitText, 15 + labelWidth, currentY);
                
                currentY += lineHeight * splitText.length + 2;
            });

            pdf.save(`OS_${osAtual.numeroOs}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("PDF exportado com sucesso!", { theme: "dark" });
        } catch (error: any) {
            console.error("Erro ao exportar PDF:", error);
            toast.error("Erro ao exportar PDF. Certifique-se de que jsPDF está instalado.", { theme: "dark" });
        }
    };

    if (loading) return <div className={GlobalStyle.PageContainer}><p style={{ color: '#fff', fontSize: '18px' }}>Carregando...</p></div>;
    if (!osAtual) return <div className={GlobalStyle.PageContainer}><p style={{ color: '#fff', fontSize: '18px' }}>OS não encontrada</p></div>;

    return (
        <div className={GlobalStyle.PageContainer}>
            <ToastContainer/>
            <div className={GlobalStyle.Logo}/>
            <div className={style.ContainerPrincipal}>
                <div className={style.Title}>
                    <h2>Ordem de Serviço #{osAtual.numeroOs}</h2>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (isEditing) {
                        form.handleSubmit(onSubmit)(e);
                    }
                }}>
                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel}>N° OS</label>
                            <input 
                                className={style.InputField} 
                                type="number" 
                                value={osAtual.numeroOs || ""} 
                                disabled 
                            />
                        </div>

                        <div className={style.InputGroup}>
                            <label className={style.InputLabel}>Data de Criação</label>
                            <input 
                                className={style.InputField} 
                                type="text" 
                                value={osAtual.dataCriacao ? new Date(osAtual.dataCriacao).toLocaleDateString() : ""} 
                                disabled 
                            />
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel}>Título</label>
                            <input 
                                className={style.InputField} 
                                {...form.register("titulo")} 
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel}>Descrição</label>
                            <textarea 
                                className={style.InputField} 
                                {...form.register("descricao")} 
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel}>Status</label>
                            <select 
                                className={style.InputField} 
                                {...form.register("statusId")}
                                disabled={!isEditing}
                            >
                                <option value="1">Não Iniciado</option>
                                <option value="2">Em Andamento</option>
                                <option value="3">Concluído</option>
                            </select>
                        </div>
                    </div>

                    <div className={style.ContainerLine}>
                        <div className={style.InputGroup}>
                            <label className={style.InputLabel}>Técnico Responsável</label>
                            {isEditing ? (
                                <select 
                                    className={style.InputField}
                                    value={tecnicoIdEdicao}
                                    onChange={(e) => setTecnicoIdEdicao(e.target.value)}
                                >
                                    <option value="">Selecione um técnico</option>
                                    {tecnicos.map((t) => (
                                        <option key={t.tecnicoId} value={t.tecnicoId || ""}>
                                            {t.nomeTecnico}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    className={style.InputField} 
                                    type="text" 
                                    value={tecnicoAtribuido?.nomeTecnico || "Não atribuído"} 
                                    disabled 
                                />
                            )}
                        </div>
                    </div>

                    <div className={style.ContainerButtons}>
                        <button className={style.BackButton} type="button" onClick={() => navigate("/home")}>
                            Voltar
                        </button>
                        {!isEditing ? (
                            <>
                                <button className={style.SaveButton} type="button" onClick={() => {
                                    console.log('Clicou em Editar, isEditing agora é true');
                                    setIsEditing(true);
                                }}>
                                    Editar
                                </button>
                                <button className={style.RelatorioButton} type="button" onClick={handleExportarPDF}>
                                    Exportar PDF
                                </button>
                                {osAtual.statusId !== 3 && (
                                    <button className={style.RelatorioButton} type="button" onClick={() => setShowRelatorioModal(true)}>
                                        Encerrar OS
                                    </button>
                                )}
                                {isAdmin && (
                                    <button className={style.DeleteButton} type="button" onClick={handleDelete}>
                                        Deletar
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button className={style.SaveButton} type="button" disabled={isSaving} onClick={() => {
                                    console.log('Clicou em Salvar');
                                    form.handleSubmit(onSubmit)();
                                }}>
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </button>
                                <button className={style.BackButton} type="button" onClick={() => {
                                    console.log('Clicou em Cancelar, isEditing agora é false');
                                    setIsEditing(false);
                                }}>
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </form>

                {showRelatorioModal && (
                    <div className={style.Modal}>
                        <div className={style.ModalContent}>
                            <h3>Encerrar Ordem de Serviço</h3>
                            <p>Preencha o relatório final para encerrar esta OS:</p>
                            
                            <div className={style.ModalFormGroup}>
                                <label>Técnico Responsável</label>
                                <select 
                                    value={tecnicoId}
                                    onChange={(e) => setTecnicoId(e.target.value)}
                                    className={style.ModalInput}
                                >
                                    <option value="">Selecione um técnico</option>
                                    {tecnicos.map((tecnico, index) => (
                                        <option key={tecnico.tecnicoId || index} value={tecnico.tecnicoId || ""}>
                                            {tecnico.nomeTecnico}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.ModalFormGroup}>
                                <label>Data de Início</label>
                                <input 
                                    type="datetime-local"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className={style.ModalInput}
                                />
                            </div>

                            <div className={style.ModalFormGroup}>
                                <label>Data de Fim</label>
                                <input 
                                    type="datetime-local"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className={style.ModalInput}
                                />
                            </div>

                            <div className={style.ModalFormGroup}>
                                <label>Descrição do Trabalho Realizado</label>
                                <textarea 
                                    className={style.ModalTextarea}
                                    placeholder="Descreva o trabalho realizado e o resultado final..."
                                    value={relatorioDescricao}
                                    onChange={(e) => setRelatorioDescricao(e.target.value)}
                                />
                            </div>

                            <div className={style.ModalButtons}>
                                <button 
                                    className={style.CancelButton}
                                    onClick={() => {
                                        setShowRelatorioModal(false);
                                        setRelatorioDescricao("");
                                        setTecnicoId("");
                                        setDataInicio("");
                                        setDataFim("");
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={style.ConfirmButton}
                                    onClick={handleEncerrarOS}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Encerrando..." : "Encerrar OS"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewOS
