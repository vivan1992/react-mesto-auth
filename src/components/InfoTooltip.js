import {useEffect} from 'react';

import ok from '../images/ok.svg';
import error from '../images/error.svg';

const InfoTooltip = (props) => {
  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === 'Escape') {
        props.onClose();
      }
    }

    if (props.isOpen) {
      document.addEventListener('keydown', handleEscClose);
    }

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    }
  });

  return (
    <section
      className={`popup popup_tooltip ${props.isOpen ? 'popup_opened' : ''}`}
      onClick={(e) => e.target.classList.contains(`popup_tooltip`) ? props.onClose() : null}>

      <div className="popup__container popup__container_tooltip">
        <button
          onClick={props.onClose}
          type="button"
          className="popup__close"
          aria-label="Закрыть"/>
        <img className='popup__img-status' src={props.isOk ? ok : error} alt={`${props.isOk ? 'Успешно' : 'Ошибка'}`}/>
        <p className="popup__title popup__title_center">
          {props.isOk ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </p>
      </div>
    </section>
  )
}

export default InfoTooltip;
