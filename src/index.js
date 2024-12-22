import './pages/index.css';
import { initialCards } from './components/cards.js';
import { createCard, deleteCard, toggleLike } from './components/card.js';
import { openModal, closeModal, openImagePopup } from './components/modal.js';
import { fillProfileForm, handleEditProfileFormSubmit } from './components/profile.js';

const placesList = document.querySelector('.places__list');

const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const popups = document.querySelectorAll('.popup');

const newCardFormElement = document.querySelector('.popup_type_new-card .popup__form');
const cardNameInput = newCardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardFormElement.querySelector('.popup__input_type_url');

function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(
      cardData,
      deleteCard,
      toggleLike,
      (imageData) => openImagePopup(imagePopup, imageData)
    );
    placesList.append(cardElement);
  });
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const cardName = cardNameInput.value;
  const cardLink = cardLinkInput.value;

  const cardElement = createCard(
    { name: cardName, link: cardLink },
    deleteCard,
    toggleLike,
    (imageData) => openImagePopup(imagePopup, imageData)
  );
  placesList.prepend(cardElement);

  newCardFormElement.reset();
  closeModal(newCardPopup);
}

editProfileButton.addEventListener('click', () => {
  fillProfileForm();
  openModal(editProfilePopup);
});

addCardButton.addEventListener('click', () => {
  openModal(newCardPopup);
});

popups.forEach(popup => {
  const closeButton = popup.querySelector('.popup__close');
  closeButton.addEventListener('click', () => closeModal(popup));

  popup.addEventListener('mousedown', event => {
    if (event.target === event.currentTarget) {
      closeModal(popup);
    }
  });
});

document
  .querySelector('.popup_type_edit .popup__form')
  .addEventListener('submit', handleEditProfileFormSubmit);
newCardFormElement.addEventListener('submit', handleNewCardFormSubmit);

renderCards(initialCards);
