import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import style from "../../styles/MenuStyle.module.scss";

function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate("/");
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className={style.Menu}>
      <div className={style.MenuContainer}>
        <div className={style.Logo}>OllinTec</div>
        
        <button className={style.BurgerButton} onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${style.MenuList} ${isOpen ? style.Active : ""}`}>
          <li>
            <button onClick={() => handleNavigation("/home")}>Home</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/createOs")}>Nova OS</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/registerUser")}>Novo Usuário</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/registerSector")}>Novo Setor</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/registerEquipment")}>Novo Equipamento</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/relatorio")}>Relatório</button>
          </li>
          <li>
            <button onClick={handleLogout} className={style.LogoutButton}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Menu;
