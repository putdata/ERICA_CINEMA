import React, { Component } from 'react';
import { Link, BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, Branch, Movie, Theater } from './containers';

import 'styles/Admin.scss';

class Admin extends Component {
  constructor(props) {
    super(props);
  } 

  render() {
    const { match } = this.props;

    return(
      <div id="admin-page" className="flex-c center">
        <Switch>
          <Route exact path={ match.path } component={ Main } />
          <Route path={ `${ match.path }/branch` } component={ Branch } />
          <Route path={ `${ match.path }/movie` } component={ Movie } />
          <Route path={ `${ match.path }/theater` } component={ Theater } />
        </Switch>
      </div>
    )
  }
}

function mapState(state) {
}

const actionCreators = {
}

const connectedApp = connect(undefined, undefined)(Admin);
export { connectedApp as Admin };
