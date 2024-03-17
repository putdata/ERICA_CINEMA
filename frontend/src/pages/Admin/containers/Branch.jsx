import React, { Component, Fragment } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import BrachAdd from './BrachAdd';
import ScreenManage from './ScreenManage';

const SubMenuItem = (props) => {
  return (
    <div id="item">

    </div>
  );
};

class Branch extends Component {
  render() {
    const { match } = this.props;
    // console.log(match);

    return (
      <Fragment>
        <div id="sub-menu" className="flex-r">
          <NavLink id="item" activeClassName="active" exact to={ `${ match.path }` }>극장 목록</NavLink>
          <NavLink id="item" activeClassName="active" to={ `${ match.path }/add` }>극장 추가</NavLink>
          <NavLink id="item" activeClassName="active" to={ `${ match.path }/screen` }>상영관 관리</NavLink>
        </div>
        <div id="content">
          <Switch>
            <Route exact path={ `${ match.path }/add` } component={ BrachAdd } />
            <Route exact path={ `${ match.path }/screen` } component={ ScreenManage } />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export { Branch };