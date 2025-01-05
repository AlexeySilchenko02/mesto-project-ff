import './pages/index.css';
import { initialCards } from './components/cards.js';
import { createCard, deleteCard, toggleLike } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

const placesList = document.querySelector('.places__list');

const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const newCardFormElement = document.querySelector('.popup_type_new-card .popup__form');
const cardNameInput = newCardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardFormElement.querySelector('.popup__input_type_url');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const editFormElement = editProfilePopup.querySelector('.popup__form');
const nameInput = editFormElement.querySelector('.popup__input_type_name');
const jobInput = editFormElement.querySelector('.popup__input_type_description');

const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Функция для заполнения формы редактирования профиля
function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editFormElement, validationConfig);
}

// Обработчик для отправки формы редактирования профиля
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editProfilePopup);
}

// Обработчик для отправки формы добавления новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const cardName = cardNameInput.value;
  const cardLink = cardLinkInput.value;

  const cardElement = createCard(
    { name: cardName, link: cardLink },
    deleteCard,
    toggleLike,
    handleImageClick
  );
  placesList.prepend(cardElement);

  newCardFormElement.reset();
  clearValidation(newCardFormElement, validationConfig);
  closeModal(newCardPopup);
}

// Обработчик для открытия попапа с изображением
function handleImageClick({ src, alt, caption }) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = caption;
  openModal(imagePopup);
}

// Функция для рендеринга карточек
function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(
      cardData,
      deleteCard,
      toggleLike,
      handleImageClick
    );
    placesList.append(cardElement);
  });
}

editProfileButton.addEventListener('click', () => {
  fillProfileForm();
  openModal(editProfilePopup);
});

addCardButton.addEventListener('click', () => {
  clearValidation(newCardFormElement, validationConfig);
  openModal(newCardPopup);
});

editFormElement.addEventListener('submit', handleEditProfileFormSubmit);
newCardFormElement.addEventListener('submit', handleNewCardFormSubmit);

// Закрытие попапов
const popups = document.querySelectorAll('.popup');
popups.forEach(popup => {
  const closeButton = popup.querySelector('.popup__close');
  closeButton.addEventListener('click', () => closeModal(popup));

  popup.addEventListener('mousedown', event => {
    if (event.target === event.currentTarget) {
      closeModal(popup);
    }
  });
});

// Включение валидации
enableValidation(validationConfig);

// Инициализация карточек
renderCards(initialCards);