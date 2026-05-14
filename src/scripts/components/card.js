const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const isCardLiked = (cardElement) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  return likeButton.classList.contains("card__like-button_is-active");
};

export const removeCardElement = (cardElement) => {
  cardElement.remove();
};

export const updateCardLikes = (cardElement, likes, currentUserId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likesCount = cardElement.querySelector(".card__like-count");
  const isLiked = likes.some(like => like._id === currentUserId);
  
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }
  
  if (likesCount) {
    likesCount.textContent = likes.length;
  }
};

export const createCardElement = (data, userId, { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick }) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardImage = cardElement.querySelector(".card__image");
  const likesCount = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (likesCount) {
    likesCount.textContent = data.likes.length;
  }

  const isLikedByUser = data.likes.some(like => like._id === userId);
  if (isLikedByUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (data.owner && data.owner._id !== userId) {
    deleteButton.style.display = 'none';
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(cardElement, data._id));
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data._id));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  if (onInfoClick) {
    infoButton.addEventListener("click", () => onInfoClick(data._id));
  }

  return cardElement;
};