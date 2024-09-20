import * as actionTypes from './actionTypes';
export const requestApi = () => {
  return {
    type: actionTypes.LOADING
  }
}
export const setError = (error) => {
  return {
    type: actionTypes.ERROR_MESSAGE,
    payload: error,
  }
}
export const loginRequest = () => {
  return {
    type: actionTypes.LOGIN_REQUEST,
  };
};

export const loginSuccess = (userData) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: userData,
  };
};

export const loginFailure = (error) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    payload: error,
  };
};

export const logoutUser = () => {
  return {
    type: actionTypes.LOGOUT_USER,
  };
};

export const registrationRequest = () => ({
  type: actionTypes.REGISTRATION_REQUEST,
});

export const registrationSuccess = (userData) => ({
  type: actionTypes.REGISTRATION_SUCCESS,
  payload: userData,
});

export const registrationFailure = (error) => ({
  type: actionTypes.REGISTRATION_FAILURE,
  payload: error,
});