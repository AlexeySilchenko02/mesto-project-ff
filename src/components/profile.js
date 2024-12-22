import { closeModal } from './modal.js';

// DOM-элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Поля формы редактирования профиля
const editFormElement = document.querySelector('.popup_type_edit .popup__form');
const nameInput = editFormElement.querySelector('.popup__input_type_name');
const jobInput = editFormElement.querySelector('.popup__input_type_description');

// Заполнение формы текущими значениями профиля
export function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// Обработчик отправки формы редактирования профиля
export function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  // Обновляем значения на странице
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  // Закрываем попап
  closeModal(document.querySelector('.popup_type_edit'));
}