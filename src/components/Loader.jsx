import { Loading } from "notiflix/build/notiflix-loading-aio";
export const showLoader = () => {
  Loading.hourglass();
};

export const hideLoader = () => {
  Loading.remove();
};
