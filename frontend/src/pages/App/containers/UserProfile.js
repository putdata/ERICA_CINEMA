import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { authAction } from 'actions/auth.action';

import SignInDropDown from './SignInDropDown';
import ProfileDropDown from './ProfileDropDown';

class UserProfile extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const user = this.props.auth.toJS();

    return (
      <Fragment>
        { !user.isSigned ?
          <SignInDropDown /> :
          <ProfileDropDown />
        }
      </Fragment>
    );
  }
}

function mapState(state) {
  const { auth } = state;
  return { auth };
}

const actionCreators = {
  signInWithToken: authAction.signInWithToken
}


export default connect(mapState, actionCreators)(UserProfile);