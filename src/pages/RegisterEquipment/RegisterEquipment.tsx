import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { addEquipamento, fetchEquipamentos, deleteEquipamento, updateEquipamento } from "../../actions/equipamentoActions";

import style from "../../styles/RegisterEquipmentStyle.module.scss";
import GlobalStyle from "../../styles/GlobalStyle.module.scss";
import { FormEquipment } from "../../types/FormCadastroEquipment";

function RegisterEquipment() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { equipamentos } = useSelector((state: RootState) => state.equipamento);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isAdmin = user?.is_admin || false;

  const form = useForm<FormEquipment>({
    defaultValues: {
      nome: "",
      tipoEquipamento: "",
      dataAquisicao: undefined,
      descricao: ""
    },
  });

  useEffect(() => {
    dispatch(fetchEquipamentos());
  }, [dispatch]);

  const onSubmit = async (data: FormEquipment) => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem cadastrar equipamentos", { theme: "dark" });
      return;
    }

    if (!data.nome || !data.tipoEquipamento) {
      toast.error("Preencha todos os campos obrigatórios", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const equipamentoData = {
        nome_equipamento: data.nome,
        tipo_id: parseInt(data.tipoEquipamento),
        data_aquisicao: data.dataAquisicao?.toString() || new Date().toISOString().split('T')[0],
        descricao: data.descricao || "",
      };

      if (editingId) {
        await dispatch(updateEquipamento(editingId, equipamentoData));
        toast.success("Equipamento atualizado com sucesso!", { theme: "dark" });
        setEditingId(null);
      } else {
        await dispatch(addEquipamento(equipamentoData));
        toast.success("Equipamento cadastrado com sucesso!", { theme: "dark" });
      }
      
      form.reset();
      dispatch(fetchEquipamentos());
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar equipamento", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (equipamento: any) => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar equipamentos", { theme: "dark" });
      return;
    }
    setEditingId(equipamento.equipamento_id);
    form.setValue("nome", equipamento.nome_equipamento);
    form.setValue("tipoEquipamento", equipamento.tipo_id?.toString() || "");
    form.setValue("dataAquisicao", equipamento.data_aquisicao);
    form.setValue("descricao", equipamento.descricao);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem deletar equipamentos", { theme: "dark" });
      return;
    }

    if (window.confirm("Tem certeza que deseja deletar este equipamento?")) {
      try {
        await dispatch(deleteEquipamento(id));
        toast.success("Equipamento deletado com sucesso!", { theme: "dark" });
        dispatch(fetchEquipamentos());
      } catch (error: any) {
        toast.error(error.message || "Erro ao deletar equipamento", { theme: "dark" });
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset();
  };

  return (
    <div className={GlobalStyle.PageContainer}>
        <ToastContainer/>
        <div className={GlobalStyle.Logo}/>
        <div className={style.CadastroForm}>
          <h2 className={style.CadastroTitle}>Cadastro de Equipamento</h2>
          {!isAdmin && (
            <div style={{ color: '#ff9800', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>
              ⚠️ Apenas administradores podem gerenciar equipamentos
            </div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={style.InputGroup}>
              <label className={style.InputLabel} htmlFor="nome">Nome *</label>
              <input className={style.InputField} {...form.register("nome", { required: true })} placeholder="Nome do equipamento" disabled={!isAdmin} />
            </div>
            <div className={style.InputGroup}>
              <label className={style.InputLabel} htmlFor="tipoEquipamento">Tipo do Equipamento *</label>
              <input className={style.InputField} {...form.register("tipoEquipamento", { required: true })} placeholder="Ex: Impressora, Computador" disabled={!isAdmin} />
            </div>
            <div className={style.InputGroup}>
              <label className={style.InputLabel} htmlFor="dataAquisicao">Data de Aquisição</label>
              <input className={style.InputField} {...form.register("dataAquisicao")} type="date" disabled={!isAdmin} />
            </div>
            <div className={style.InputGroup}>
              <label className={style.InputLabel} htmlFor="descricao">Descrição</label>
              <textarea className={style.InputField} {...form.register("descricao")} placeholder="Descrição do equipamento" disabled={!isAdmin} />
            </div>

            <div className={style.ContainerButtons}>
              {editingId && (
                <button className={style.CancelButton} type="button" onClick={handleCancel} disabled={!isAdmin}>
                  Cancelar
                </button>
              )}
              <button className={style.RegisterButton} type="button" onClick={() => navigate("/home")}>
                Voltar
              </button>
              <button className={style.RegisterButton} type="submit" disabled={loading || !isAdmin}>
                {loading ? (editingId ? "Atualizando..." : "Cadastrando...") : (editingId ? "Atualizar" : "Cadastrar")}
              </button>
            </div>
          </form>

          {equipamentos.length > 0 && (
            <div className={style.ListContainer}>
              <h3 className={style.ListTitle}>Equipamentos Cadastrados:</h3>
              <div className={style.ListWrapper}>
                {equipamentos.map((eq: any) => {
                  console.log('Equipamento:', eq);
                  return (
                  <div key={eq.equipamento_id} className={style.ListItem}>
                    <div className={style.ItemContent}>
                      <span className={style.ItemName}>{eq.nome_equipamento || 'Sem nome'}</span>
                    </div>
                    {isAdmin && (
                      <div className={style.ItemActions}>
                        <button 
                          className={style.EditButton}
                          onClick={() => handleEdit(eq)}
                        >
                          Editar
                        </button>
                        <button 
                          className={style.DeleteButton}
                          onClick={() => handleDelete(eq.equipamento_id)}
                        >
                          Deletar
                        </button>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default RegisterEquipment
