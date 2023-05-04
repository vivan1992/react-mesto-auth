import { useEffect } from "react";

function PopupWithForm (props) {

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
      className={`popup popup_${props.name} ${props.isOpen ? 'popup_opened' : ''}`}
      onClick={(e) => e.target.classList.contains(`popup_${props.name}`) ? props.onClose() : null}>

      <div className="popup__container">
        <button
          onClick={props.onClose}
          type="button"
          className="popup__close"
          aria-label="Закрыть"></button>
        <h3 className="popup__title">{props.title}</h3>
        <form name={`${props.name}-form`} className={`form form_name_${props.name}`} noValidate onSubmit={props.onSubmit}>
          {props.children}
          <button type="submit" className="form__button" disabled={!props.buttonDisabled} >{props.buttonText}</button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
