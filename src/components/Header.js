import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Header(props) {
  const headerButtonText = {
    '/': 'Выйти',
    '/sign-up': 'Войти',
    '/sign-in': 'Регистрация'
  };

  let location = useLocation();

  const [isburger, setIsBurger] = useState(false);

  const onClickBurger = () => {
    setIsBurger(!isburger);
  }

  const onClickOut = () => {
    setIsBurger(false);
    props.onSignOut();
  }

  return (
    <>
      {(isburger && props.loggedIn) ?
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
            <div className={isburger ? 'header__close' : 'header__burger'} onClick={onClickBurger}/>
          </>

          :
          <Link to={location.pathname === '/sign-in' ? '/sign-up' : '/sign-in'} className="header__login-link">
            {headerButtonText[location.pathname]}
          </Link>
        }
      </header>
    </>
  );
}

export default Header;
