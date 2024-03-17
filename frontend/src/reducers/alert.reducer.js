import { alertActionType } from 'action-types';

export function alert(state = {}, action) {
  switch (action.type) {
    case alertActionType.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case alertActionType.ERROR:
      return {
        type: 'alert-error',
        message: action.message
      };
    case alertActionType.CLEAR:
      return {};
    default:
      return state;
  }
}