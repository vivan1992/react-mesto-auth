import { useState } from "react";

export function useValidator(initial = false) {
  const [validity, setValidity] = useState(initial);
  const [textError, setTextError] = useState('');

  const setValidator = (e) => {
    setValidity(e.target.validity.valid);
    setTextError(e.target.validationMessage);
  }

  const resetValidate = () => {
    setValidity(initial);
    setTextError('');
  }

  return {validity, setValidity, textError, setValidator, resetValidate}
}
