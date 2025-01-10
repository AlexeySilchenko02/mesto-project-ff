// Функция для показа ошибки валидации
function showError(inputElement, errorElement, config) {
  inputElement.classList.add(config.inputErrorClass);

  if (inputElement.validity.patternMismatch) {
    errorElement.textContent = inputElement.dataset.error;
  } else {
    errorElement.textContent = inputElement.validationMessage;
  }

  errorElement.classList.add(config.errorClass);
}

// Функция для скрытия ошибки валидации
function hideError(inputElement, errorElement, config) {
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

// Функция проверки валидности ввода
function checkInputValidity(inputElement, formElement, config) {
  const isInputValid = inputElement.validity.valid;
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);

  if (isInputValid) {
    hideError(inputElement, errorElement, config);
  } else {
    showError(inputElement, errorElement, config);
  }
}

// Функция изменения состояния кнопки отправки
function toggleButtonState(buttonElement, isActive, config) {
  if (buttonElement) {
    if (isActive) {
      buttonElement.disabled = false;
      buttonElement.classList.remove(config.inactiveButtonClass);
    } else {
      buttonElement.classList.add(config.inactiveButtonClass);
      buttonElement.disabled = true;
    }
  }
}

// Функция для очистки ошибок валидации и делает кнопку неактивной
export function clearValidation(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const submitButtonElement = formElement.querySelector(config.submitButtonSelector);

  [...inputList].forEach((inputElement) => {
    const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
    hideError(inputElement, errorElement, config);
  });

  toggleButtonState(submitButtonElement, false, config);
}

// Функция установки обработчиков событий для формы
function setEventListeners(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const submitButtonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(submitButtonElement, formElement.checkValidity(), config);

  [...inputList].forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(inputElement, formElement, config);
      toggleButtonState(submitButtonElement, formElement.checkValidity(), config);
    });
  });
}

// Функция активации валидации для форм
export function enableValidation(config) {
  const formsList = document.querySelectorAll(config.formSelector);

  [...formsList].forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}