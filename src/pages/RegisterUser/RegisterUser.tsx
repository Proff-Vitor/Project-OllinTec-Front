import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { addUsuario, fetchUsuarios, deleteUsuario, updateUsuario } from "../../actions/usuarioActions";

import style from "../../styles/RegisterUserStyle.module.scss";
import GlobalStyle from "../../styles/GlobalStyle.module.scss";
import { FormData } from "../../types/FormCadastroUser";

function RegisterUser() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { usuarios } = useSelector((state: RootState) => state.usuario);
  const { user } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"admin" | "tecnico">("admin");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isAdmin = user?.is_admin || false;

  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      sector: "",
      password: "",
      confirmPassword: "",
      userType: "admin",
      especialidade: ""
    }
  });

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const onSubmit = async (data: FormData) => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem cadastrar usuários", { theme: "dark" });
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const usuarioData = {
        nome: data.username,
        email: data.email,
        senha: data.password,
        is_admin: data.userType === "admin",
        is_tecnico: data.userType === "tecnico",
      };

      if (editingId) {
        await dispatch(updateUsuario(editingId, usuarioData));
        toast.success("Usuário atualizado com sucesso!", { theme: "dark" });
        setEditingId(null);
      } else {
        await dispatch(addUsuario(usuarioData));
        toast.success("Usuário cadastrado com sucesso!", { theme: "dark" });
      }
      
      form.reset();
      setUserType("admin");
      dispatch(fetchUsuarios());
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar usuário", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario: any) => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar usuários", { theme: "dark" });
      return;
    }
    setEditingId(usuario.usuario_id);
    form.setValue("username", usuario.nome);
    form.setValue("email", usuario.email);
    form.setValue("sector", usuario.setor_id?.toString() || "");
    const tipo = usuario.is_admin ? "admin" : "tecnico";
    setUserType(tipo as "admin" | "tecnico");
    form.setValue("userType", tipo);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem deletar usuários", { theme: "dark" });
      return;
    }

    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await dispatch(deleteUsuario(id));
        toast.success("Usuário deletado com sucesso!", { theme: "dark" });
        dispatch(fetchUsuarios());
      } catch (error: any) {
        toast.error(error.message || "Erro ao deletar usuário", { theme: "dark" });
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset();
    setUserType("admin");
  };

  return (
    <div className={GlobalStyle.PageContainer}>
        <ToastContainer/>
        <div className={GlobalStyle.Logo}/>
        <div className={style.CadastroForm}>
            <h2 className={style.CadastroTitle}>Cadastro de Usuários</h2>
            {!isAdmin && (
              <div className={style.WarningMessage}>
                ⚠️ Apenas administradores podem gerenciar usuários
              </div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className={style.InputGroup}>
              <label className={style.InputLabel} htmlFor="username">Username</label>
              <input className={style.InputField} {...form.register("username", { required: true })} placeholder="Digite seu nome" disabled={!isAdmin} />
              </div>
              <div className={style.InputGroup}>
                <label className={style.InputLabel} htmlFor="email">Email</label>
                <input className={style.InputField}  {...form.register("email", { required: true })} type="email" placeholder="Digite seu email" disabled={!isAdmin} />
              </div>

              <div className={style.InputGroup}>
                <label className={style.InputLabel} htmlFor="setor">Setor</label>
                <input className={style.InputField}  {...form.register("sector")} type="text" placeholder="Setor" disabled={!isAdmin} />
              </div>

              <div className={style.InputGroup}>
                <label className={style.InputLabel} htmlFor="password">Senha</label>
                <div className={style.PasswordWrapper}>
                  <input
                  className={style.InputField} 
                  {...form.register("password", { required: !editingId })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  disabled={!isAdmin}
                  />
                  <button className={style.TogglePasswordBtn}  type="button" onClick={() => setShowPassword(!showPassword)} disabled={!isAdmin}>
                      {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className={style.InputGroup}>
                <label className={style.InputLabel}>Confirmar senha</label>
                <div className={style.PasswordWrapper}>
                  <input
                    className={style.InputField}
                    {...form.register("confirmPassword", { required: !editingId })}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar senha"
                    disabled={!isAdmin}
                  />
                  <button className={style.TogglePasswordBtn}  type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={!isAdmin}>
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className={style.RadioGroup}>
                <div className={style.ContainerLabel}>
                  <label className={style.LabelRadio}>
                    <input
                      type="radio"
                      checked={userType === "admin"}
                      onChange={() => {
                        setUserType("admin");
                        form.setValue("userType", "admin");
                      }}
                      disabled={!isAdmin}
                    />
                    Admin
                  </label>
                  <label className={style.LabelRadio}>
                    <input
                      type="radio"
                      checked={userType === "tecnico"}
                      onChange={() => {
                        setUserType("tecnico");
                        form.setValue("userType", "tecnico");
                      }}
                      disabled={!isAdmin}
                    />
                    Técnico
                  </label>
                </div>

                {userType === "tecnico" && (
                  <div className={style.InputGroup} >
                    <label className={style.InputLabel} >Especialidade</label>
                    <input
                    className={style.InputField}
                    {...form.register("especialidade")} placeholder="Informe a especialidade" disabled={!isAdmin} />
                  </div>
                )}
              </div>
            
              <div className={style.ContainerButtons}>
                {editingId && (
                  <button className={style.CancelButton} type="button" onClick={handleCancel} disabled={!isAdmin}>
                    Cancelar
                  </button>
                )}
                <button className={style.BackButton} type="button" onClick={() => navigate("/")} disabled={!isAdmin}>
                  Voltar
                </button>
                <button className={style.RegisterButton} type="submit" disabled={loading || !isAdmin}>
                  {loading ? (editingId ? "Atualizando..." : "Cadastrando...") : (editingId ? "Atualizar" : "Cadastrar")}
                </button>
              </div>
            </form>

            {usuarios.length > 0 && (
              <div className={style.ListContainer}>
                <h3 className={style.ListTitle}>Usuários Cadastrados:</h3>
                <div className={style.ListWrapper}>
                  {usuarios.map((user: any) => (
                    <div key={user.usuario_id} className={style.ListItem}>
                      <div className={style.ItemContent}>
                        <span className={style.ItemName}>{user.nome}</span>
                        <span className={style.ItemEmail}>{user.email}</span>
                        <span className={style.ItemType}>{user.is_admin ? "Admin" : "Técnico"}</span>
                      </div>
                      {isAdmin && (
                        <div className={style.ItemActions}>
                          <button 
                            className={style.EditButton}
                            onClick={() => handleEdit(user)}
                            type="button"
                          >
                            Editar
                          </button>
                          <button 
                            className={style.DeleteButton}
                            onClick={() => handleDelete(user.usuario_id)}
                            type="button"
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

export default RegisterUser
