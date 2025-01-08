import { addLike, removeLike } from './api.js';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard(data, userId, handleCardDelete, handleImageClick) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCounter = cardElement.querySelector('.like-button__count');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeCounter.textContent = data.likes.length;

  if (data.likes.some(likeObj => likeObj._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (data.owner._id !== userId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => {
      handleCardDelete(cardElement, data._id);
    });
  }

  likeButton.addEventListener('click', () => {
    if (likeButton.classList.contains('card__like-button_is-active')) {
      removeLike(data._id)
        .then(updatedCard => {
          likeCounter.textContent = updatedCard.likes.length;
          likeButton.classList.remove('card__like-button_is-active');
        })
        .catch(err => console.log(`Ошибка при удалении лайка: ${err}`));
    } else {
      addLike(data._id)
        .then(updatedCard => {
          likeCounter.textContent = updatedCard.likes.length;
          likeButton.classList.add('card__like-button_is-active');
        })
        .catch(err => console.log(`Ошибка при установке лайка: ${err}`));
    }
  });

  cardImage.addEventListener('click', () => {
    handleImageClick({
      src: data.link,
      alt: data.name,
      caption: data.name,
    });
  });

  return cardElement;
}