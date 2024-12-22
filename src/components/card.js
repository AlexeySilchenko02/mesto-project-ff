const cardTemplate = document.querySelector('#card-template').content;

export function createCard(data, handleCardDelete, handleLikeToggle, handleImageClick) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    handleLikeToggle(likeButton);
  });

  // Обработчик удаления
  deleteButton.addEventListener('click', () => handleCardDelete(cardElement));

  // Обработчик клика по изображению
  cardImage.addEventListener('click', () => {
    handleImageClick({
      src: data.link,
      alt: data.name,
      caption: data.name,
    });
  });

  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function toggleLike(buttonElement) {
  buttonElement.classList.toggle('card__like-button_is-active');
}
