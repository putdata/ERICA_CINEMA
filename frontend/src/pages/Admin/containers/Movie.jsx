import React, { Component, Fragment } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import MovieAdd from './MovieAdd';
import MovieStatistics from './MovieStatistics';

class Movie extends Component {
  render() {
    const { match } = this.props;
    // console.log(match);

    return (
      <Fragment>
        <div id="sub-menu" className="flex-r">
          {/* <NavLink id="item" activeClassName="active" exact to={ `${ match.path }` }>영화 목록</NavLink> */}
          <NavLink id="item" activeClassName="active" to={ `${ match.path }/add` }>영화 추가</NavLink>
          <NavLink id="item" activeClassName="active" to={ `${ match.path }/statistics` }>영화 통계</NavLink>
        </div>
        <div id="content">
          <Switch>
            <Route path={ `${ match.path }/statistics` } component={ MovieStatistics } />
            <Route exact path={ `${ match.path }/add` } component={ MovieAdd } />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export { Movie };