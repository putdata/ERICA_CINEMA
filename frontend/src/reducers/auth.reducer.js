import { Map } from 'immutable';

import { authActionType } from 'action-types';

const initialState = Map({
  isSigned: false,
  // user: '',
  // token: ''
});

export function auth(state = initialState, action) {
  const { type, payload } = action;
  // console.log(payload);
  switch (type) {
    case authActionType.SIGNIN_SUCCESS:
      return state.merge({
        isSigned: true,
        email: payload.email,
        name: payload.name,
        adminType: payload.admin
      });
    case authActionType.SIGNOUT:
      return initialState;
    default:
      return state;
  }
}