import axios from 'axios';

import { apiUrl }from 'constant';

export const authService = {
  signInWithToken,
  signIn,
  signOut
  // signUp
};

function signInWithToken(token) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${ apiUrl }/user/verify`, {
        token: token
      })
      .then(handleData)
      .then(handleResponse)
      .then(res => {
        // console.log(res);
        axios.defaults.headers.common['Authorization'] = token;
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
  });
}

function signIn(email, password) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${ apiUrl }/user/login`, {
        email: email,
        pw: password
      })
      .then(handleData)
      .then(handleResponse)
      .then(res => {
        sessionStorage.setItem('user', JSON.stringify(res));
        axios.defaults.headers.common['Authorization'] = res.token;
        resolve(res);
      })
      .catch(err => {
        // console.log(err);
        reject(err);
      });
  });
}

// function signUp(email, password) {
//   return new Promise((resolve, reject) => {
//     axios
//       .post(`${ apiUrl }/user/register`, {
//         email: email,
//         pw: password
//       })
//       .then(handleData)
//       .then(handleResponse)
//       .then(res => {
//         sessionStorage.setItem('user', JSON.stringify(res));
//         axios.defaults.headers.common['Authorization'] = res.token;
//         resolve(res);
//       })
//       .catch(err => {
//         // console.log(err);
//         reject(err);
//       });
//   });
// }

function signOut() {
  // console.log('byebye');
  sessionStorage.removeItem('user');
  axios.defaults.headers.common['Authorization'] = null;
}

function handleData(res) {
  return res.data;
}

function handleResponse(res) {
  if (!res.ok) return Promise.reject('signin fail');
  return res.data;
  // return new Promise((resolve, reject) => {
  // });
}