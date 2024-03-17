import { combineReducers } from 'redux';

import { auth } from './auth.reducer';
import {alert } from './alert.reducer';

const rootReducer = combineReducers({
  auth,
  alert
});

export default rootReducer;