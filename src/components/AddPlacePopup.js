import { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';

import { useValidator } from '../hooks/useValidator';


function AddPlacePopup({isOpen, onClose, isLoaded, onAddPlace}) {

  const [place, setPlace] = useState('');
  const [link, setLink] = useState('');

  const validPlace = useValidator();
  const validLink = useValidator();

  const isDisabled = validPlace.validity && validLink.validity;

  useEffect(() => {
    setPlace('');
    setLink('');
  }, [isOpen]);

  function handleChangePlace(e) {
    setPlace(e.target.value);
    validPlace.setValidator(e);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
    validLink.setValidator(e);
  }

  function handleClose() {
    onClose();
    validPlace.resetValidate();
    validLink.resetValidate();
  }

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: place,
      link
    });

    setPlace('');
    setLink('');
  }

  return (
    <PopupWithForm
      name='card'
      title='Новое место'
      buttonText={isLoaded ? 'Создание...' : 'Создать'}
      buttonDisabled={isDisabled}
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >

      <label className="form__field">
        <input
          value={place}
          onChange={handleChangePlace}
          id="place-input"
          name="place"
          type="text"
          className="form__input form__input_name_place"
          placeholder="Название"
          required
          minLength="2"
          maxLength="30"/>
        <span className="form__input-error place-input-error" >
          {validPlace.textError}
        </span>
      </label>
      <label className="form__field">
        <input
          value={link}
          onChange={handleChangeLink}
          id="link-input"
          name="link"
          type="url"
          className="form__input form__input_name_link"
          placeholder="Ссылка на картинку"
          required/>
        <span className="form__input-error link-input-error" >
          {validLink.textError}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
