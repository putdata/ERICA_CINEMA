import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import 'styles/SideBar.scss';

const SideBarItemContent = (props) => {
  return (
    <div className="sidebar-item-content">
      { props.img && <img src={ props.img } alt="" className="sidebar-item-icon"/> }
      <div>{ props.title }</div>
    </div>
  );
}

const SideBar = (props) => {
  const user = props.auth.toJS();
  return(
    <div className="sidebar">
      <div className="sidebar-content">
        <NavLink className="sidebar-item" activeClassName="active" exact to="/">
          <SideBarItemContent img="/home.svg" title="홈"/>
        </NavLink>
        <NavLink className="sidebar-item" activeClassName="active" to="/movie">
          <SideBarItemContent img="/movie.svg" title="영화"/>
        </NavLink>
        {/* <NavLink className="sidebar-item" activeClassName="active" to="/signup">
          <SideBarItemContent img="/medal.png" title="인기 영화"/>
        </NavLink> */}
        <NavLink className="sidebar-item" activeClassName="active" to="/theater">
          <SideBarItemContent img="/theater.svg" title="영화관"/>
        </NavLink>
        <NavLink className="sidebar-item" activeClassName="active" to="/ticket">
          <SideBarItemContent img="/ticket.svg" title="티켓 예매"/>
        </NavLink>
        { user.adminType &&
          <NavLink className="sidebar-item" activeClassName="active" to="/admin">
            <SideBarItemContent img="/medal.png" title="관리자"/>
          </NavLink>
        }
      </div>
      <div className="sidebar-footer">
        <div className="members">
          <span>HYU ERICA CAMPUS</span>
          <span>CSE3010 DATABASE PBL A01</span>
          <span>김원배 박서연 오익준</span>
          <span>이세명 이효원 한예진</span>
        </div>
        <div className="footer-copyright">© 2019 EricaCinema</div>
      </div>
    </div>
  );
}

function mapState(state) {
  const { auth } = state;
  return { auth };
}

const connectedApp = connect(mapState, undefined)(SideBar);
export { connectedApp as SideBar };