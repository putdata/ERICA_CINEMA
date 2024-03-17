import React, { Component, Fragment } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import TheaterMovieManage from './TheaterMovieManage';

class Theater extends Component {
  render() {
    const { match } = this.props;
    // console.log(match);

    return (
      <Fragment>
        <div id="sub-menu" className="flex-r">
          <NavLink id="item" activeClassName="active" exact to={ `${ match.path }` }>홈</NavLink>
          <NavLink id="item" activeClassName="active" to={ `${ match.path }/movieManage` }>상영관 영화 관리</NavLink>
        </div>
        <div id="content">
          <Switch>
            <Route exact path={ `${ match.path }/movieManage` } component={ TheaterMovieManage } />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export { Theater };