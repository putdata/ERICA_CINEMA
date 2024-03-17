import { alertActionType } from '../action-types';

export const alertAction = {
  success,
  error,
  loading,
  clear
};

function success(message) {
  return { type: alertActionType.SUCCESS, message };
}

function error(message) {
  return { type: alertActionType.ERROR, message };
}

function loading(message) {
  return { type: alertActionType.LOADING, message };
}

function clear() {
  return { type: alertActionType.CLEAR };
}