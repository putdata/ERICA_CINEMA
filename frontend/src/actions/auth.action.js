import { authService } from "services";
import { alertAction } from 'actions';
import { authActionType } from "action-types";

export const authAction = {
  signInWithToken,
  signIn,
  signOut,
  signUp
};

function signInWithToken(token) {
  return dispatch => {

    authService.signInWithToken(token)
      .then(
        res => {
          dispatch(success(res));
        },
        err => {
          // console.log(err);
          dispatch(signOut());
        }
      )
  }

  function success(payload) {
    return { type: authActionType.SIGNIN_SUCCESS, payload };
  }
}

function signIn(email, password) {
  return dispatch => {
    // dispatch(alertAction.loading("Signing in..."));

    authService.signIn(email, password)
      .then(
        res => {
          dispatch(success(res));
          // dispatch({ type: authActionType.SIGNIN_SUCCESS, res });
        },
        err => {
          // console.log(err);
          dispatch(alertAction.error("로그인 실패. 없는 계정이거나, 한글 / 엉어를 확인하세요."));
        }
      );
  }

  function success(payload) {
    return { type: authActionType.SIGNIN_SUCCESS, payload };
  }
}

function signOut() {
  authService.signOut();
  return { type: authActionType.SIGNOUT };
}

function signUp() {

}