import React, { Component } from 'react';
import { Link, BrowserRouter, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from 'components/PrivateRoute';

import 'styles/NavBar.scss';
import UserProfile from '../containers/UserProfile';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="navbar">
        <div className="navbar-inner">
          <div className="navbar-menu">
            <Link to="/"><img src="/logo.png"/></Link>
          </div>
          <div className="navbar-right">
            <UserProfile/>
          </div>
        </div>
      </div>
    )
  }
}

export default NavBar;
