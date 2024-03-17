import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Record, List } from 'immutable';
import { MovieList } from './containers/MovieList';
import { MovieDetail } from './containers/MovieDetail';

class Movie extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={ match.path } component={ MovieList } />
        <Route path={ `${ match.path }/detail/:code` } component={ MovieDetail } />
      </Switch>
    );
  }
}

const connectedApp = connect(undefined, undefined)(Movie);
export { connectedApp as Movie };
