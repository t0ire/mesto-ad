const REQUEST_TIMEOUT = 10000;

const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-203",
  headers: {
    authorization: "48b25da9-bf35-4ab8-946a-b5e4056773b1",
    "Content-Type": "application/json",
  },
};

/* Проверяем, успешно ли выполнен запрос, и отклоняем промис в случае ошибки. */
const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}; 

const request = (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  return fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: config.headers,
    signal: controller.signal,
  })
    .then(getResponseData)
    .catch((err) => {
      if (err.name === "AbortError") {
        return Promise.reject(
          `Ошибка: сервер не ответил за ${REQUEST_TIMEOUT / 1000} сек.`
        );
      }

      return Promise.reject(err);
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
};

export const getUserInfo = () => {
  return request("/users/me");
};

export const getCardList = () => {
    return request("/cards");
};

export const editUserInfo = ({name, about}) => {
    return request("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
            name,
            about,
        }),
    });
};

export const editUserAvatar = (avatar) => {
    return request("/users/me/avatar", {
        method: "PATCH",
        body: JSON.stringify({ avatar }),
    });
};

export const addNewCard = ({name, link}) => {
    return request("/cards", {
        method: "POST",
        body: JSON.stringify({
            name,
            link,
        }),
    });
};

export const deleteCardReq = (cardId) => {
    return request(`/cards/${cardId}`, {
        method: "DELETE",
    });
};

export const likeCardReq = (cardId, isLiked) => {
    return request(`/cards/likes/${cardId}`, {
        method: isLiked ? "DELETE" : "PUT",
    });
};