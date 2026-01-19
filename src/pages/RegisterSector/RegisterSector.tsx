import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { addSetor, fetchSetores, deleteSetor, updateSetor } from "../../actions/setorActions";

import style from '../../styles/RegisterSectorStyle.module.scss';
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

function RegisterSector () {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { setores, loading } = useSelector((state: RootState) => state.setor);
    const { user } = useSelector((state: RootState) => state.auth);
    
    const [setor, setSetor] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const isAdmin = user?.is_admin || false;

    useEffect(() => {
        dispatch(fetchSetores());
    }, [dispatch]);

    const registerNewSector = async () => {
        if (!isAdmin) {
            toast.error("Apenas administradores podem cadastrar setores", { theme: "dark" });
            return;
        }

        if (!setor.trim()) {
            toast.error("Informe o nome do setor", { theme: "dark" });
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId) {
                await dispatch(updateSetor(editingId, { nome_setor: setor }));
                toast.success("Setor atualizado com sucesso!", { theme: "dark" });
                setEditingId(null);
            } else {
                await dispatch(addSetor({ nome_setor: setor }));
                toast.success("Setor cadastrado com sucesso!", { theme: "dark" });
            }
            setSetor('');
            dispatch(fetchSetores());
        } catch (error: any) {
            toast.error(error.message || "Erro ao cadastrar setor", { theme: "dark" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (id: number, name: string) => {
        if (!isAdmin) {
            toast.error("Apenas administradores podem editar setores", { theme: "dark" });
            return;
        }
        setEditingId(id);
        setSetor(name);
    };

    const handleDelete = async (id: number) => {
        if (!isAdmin) {
            toast.error("Apenas administradores podem deletar setores", { theme: "dark" });
            return;
        }

        if (window.confirm("Tem certeza que deseja deletar este setor?")) {
            try {
                await dispatch(deleteSetor(id));
                toast.success("Setor deletado com sucesso!", { theme: "dark" });
                dispatch(fetchSetores());
            } catch (error: any) {
                toast.error(error.message || "Erro ao deletar setor", { theme: "dark" });
            }
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setSetor('');
    };

    return (
        <div className={GlobalStyle.PageContainer}>
            <ToastContainer/>
            <div className={GlobalStyle.Logo}/>
            <div className={style.RegisterForm}>
                <h2 className={style.RegisterTitle}>Cadastro de Setor</h2>
                {!isAdmin && (
                    <div style={{ color: '#ff9800', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>
                        ⚠️ Apenas administradores podem gerenciar setores
                    </div>
                )}
                <div className={style.InputGroup}>
                    <label className={style.InputLabel} htmlFor="setor">Nome do Setor</label>
                    <input 
                        className={style.InputField}
                        type="text"
                        id="setor"
                        placeholder="Informe o Setor: "
                        value={setor}
                        onChange={(e) => setSetor(e.target.value)}
                        disabled={!isAdmin}
                    />
                </div>

                <div className={style.ContainerButtons}>
                    {editingId && (
                        <button className={style.CancelButton} type="button" onClick={handleCancel} disabled={!isAdmin}>
                            Cancelar
                        </button>
                    )}
                    <button className={style.BackButton} type="button" onClick={() => navigate("/home")}>Home</button>
                    <button 
                        className={style.RegisterButton} 
                        onClick={registerNewSector}
                        disabled={isSubmitting || loading || !isAdmin}
                    >
                        {isSubmitting ? (editingId ? "Atualizando..." : "Cadastrando...") : (editingId ? "Atualizar Setor" : "Cadastrar Setor")}
                    </button>
                </div>

                {setores.length > 0 && (
                    <div className={style.ListContainer}>
                        <h3 className={style.ListTitle}>Setores Cadastrados:</h3>
                        <div className={style.ListWrapper}>
                            {setores.map((s: any) => (
                                <div key={s.setor_id} className={style.ListItem}>
                                    <span className={style.ItemName}>{s.nome_setor}</span>
                                    {isAdmin && (
                                        <div className={style.ItemActions}>
                                            <button 
                                                className={style.EditButton}
                                                onClick={() => handleEdit(s.setor_id, s.nome_setor)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className={style.DeleteButton}
                                                onClick={() => handleDelete(s.setor_id)}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterSector;