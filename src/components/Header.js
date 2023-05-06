import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";

function Header(props) {

  const [isBurger, setIsBurger] = useState(false);

  const onClickBurger = () => {
    setIsBurger(isBurger => !isBurger);
  }

  const onClickOut = () => {
    setIsBurger(false);
    props.onSignOut();
  }

  return (
    <>
      {(isBurger && props.loggedIn) ?
        <div className="header__mobile">
          <p className="header__user">{props.email}</p>
          <button className="header__login-button" onClick={onClickOut}>Выйти</button>
        </div>
        : null}
      <header className="header">

        <div className="logo"></div>
        {props.loggedIn ?
          <>
            <div className="header__login">
              <p className="header__user">{props.email}</p>
              <button className="header__login-button" onClick={onClickOut}>Выйти</button>
            </div>
            <div className={isBurger ? 'header__close' : 'header__burger'} onClick={onClickBurger}/>
          </>
          :
          <Routes>
            <Route path="/sign-in" element={
              <Link to="/sign-up" className="header__login-link">Войти</Link>}
            />
            <Route path="/sign-up" element={
              <Link to="/sign-in" className="header__login-link">Регистрация</Link>}
            />
          </Routes>
        }
      </header>
    </>
  );
}

export default Header;
