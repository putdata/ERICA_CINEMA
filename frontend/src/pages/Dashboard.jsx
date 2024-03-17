import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import 'styles/Dashboard.scss';

class Dashboard extends Component {
  render() {
    return (
      <div id="ericacinema-page" className="flex-c center">
        <img id="neon" src="/main-neon.png" />
        {/* <div id="give-idea">무엇으로 장식 해야할까요?</div>
        <div id="role">
          <div id="title">ROLE</div>
          <div>FULL-STACK : 오익준</div>
          <div>FRONT-END : 김원배 / 이세명 / 한예진</div>
          <div>BACK-END : 박서연 / 이효원</div>
        </div>

        <div id="usage">
          <div id="title">Technique Stack</div>
          <div id="front-end">
            <div id="title">FRONT-END</div>
            <div>REACT.JS</div>
            <div>REACT-REDUX</div>
            <div>IMMUTABLE.JS</div>
            <div>AXIOS</div>
          </div>
          <div id="back-end">
            <div id="title">BACK-END</div>
            <div>NODE.JS</div>
            <div>EXPRESS.JS</div>
            <div>JWT</div>
            <div>MARIA DB</div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default Dashboard;