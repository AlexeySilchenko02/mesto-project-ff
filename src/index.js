import './pages/index.css';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

import {
  getUserData,
  getInitialCards,
  updateUserProfile,
  addCard,
  deleteCardOnServer,
  updateAvatar
} from './components/api.js';

const placesList = document.querySelector('.places__list');

const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

const editProfilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const deletePopup = document.querySelector('.popup_type_delete');
const deletePopupForm = deletePopup.querySelector('.popup__form');

const newCardFormElement = newCardPopup.querySelector('.popup__form');
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

let userId; 

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarFormElement.querySelector('.popup__input_type_url');
const avatarSaveButton = avatarFormElement.querySelector('.popup__button');
const avatarEditButton = document.querySelector('.profile__avatar-edit');
const profileAvatar = document.querySelector('.profile__image');

avatarEditButton.addEventListener('click', () => {
  avatarInput.value = '';
  clearValidation(avatarFormElement, validationConfig);
  openModal(avatarPopup);
});

avatarFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  avatarSaveButton.textContent = 'Сохранение...';
  const newAvatarLink = avatarInput.value;

  updateAvatar(newAvatarLink)
    .then((res) => {
      profileAvatar.style.backgroundImage = `url(${res.avatar})`;
      closeModal(avatarPopup);
    })
    .catch((err) => console.log(`Ошибка при обновлении аватара: ${err}`))
    .finally(() => {
      avatarSaveButton.textContent = 'Сохранить';
    });
});

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editFormElement, validationConfig);
}

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();
  const saveButton = editProfilePopup.querySelector(validationConfig.submitButtonSelector);
  saveButton.textContent = 'Сохранение...';

  updateUserProfile(nameInput.value, jobInput.value)
    .then((updatedUserData) => {
      profileTitle.textContent = updatedUserData.name;
      profileDescription.textContent = updatedUserData.about;
      closeModal(editProfilePopup);
    })
    .catch((err) => {
      console.log(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      saveButton.textContent = 'Сохранить';
    });
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  const cardName = cardNameInput.value;
  const cardLink = cardLinkInput.value;

  const saveButton = newCardPopup.querySelector(validationConfig.submitButtonSelector);
  saveButton.textContent = 'Сохранение...';

  addCard(cardName, cardLink)
    .then((createdCard) => {
      const cardElement = createCard(
        createdCard,
        userId,
        handleCardDelete,
        handleImageClick
      );
      placesList.prepend(cardElement);
      closeModal(newCardPopup);
      newCardFormElement.reset();
      clearValidation(newCardFormElement, validationConfig);
    })
    .catch((err) => {
      console.log(`Ошибка при добавлении карточки: ${err}`);
    })
    .finally(() => {
      saveButton.textContent = 'Сохранить';
    });
}

function handleImageClick({ src, alt, caption }) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = caption;
  openModal(imagePopup);
}

function submitDelete(evt, cardElement, cardId) {
  evt.preventDefault();
  deleteCardOnServer(cardId)
    .then(() => {
      cardElement.remove();
      closeModal(deletePopup);
    })
    .catch(err => console.log(`Ошибка при удалении карточки: ${err}`));
}

function handleCardDelete(cardElement, cardId) {
  openModal(deletePopup);
  deletePopupForm.onsubmit = (evt) => submitDelete(evt, cardElement, cardId);
}

function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(
      cardData,
      userId,
      handleCardDelete,
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

enableValidation(validationConfig);

Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cardsData]) => {
    userId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    renderCards(cardsData);
  })
  .catch((err) => {
    console.log(`Ошибка при загрузке данных: ${err}`);
  });