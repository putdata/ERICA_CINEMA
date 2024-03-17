import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { SignUp } from '../index';
import { Movie } from '../Movie/Movie';
import { Theater } from '../Theater/Theater';
import { Ticket } from '../Ticket/Ticket';
import { Admin } from '../Admin/Admin';
import { MyPage } from '../MyPage/MyPage';

import Dashboard from '../Dashboard';
import NavBar from './components/NavBar';
import { SideBar } from './components/SideBar';

import 'styles/App.scss';
import { alertAction, authAction } from 'actions';
import { Page404 } from './Page404';

class App extends Component {
  constructor(props) {
    super(props);

    this.clearAlert = this.clearAlert.bind(this);
  }

  //   this.state = {
  //     prevScrollpos: window.pageYOffset,
  //     headerSticky: true
  //   };
  // }

  // componentDidMount() {
  //   window.addEventListener("scroll", this.handleScroll);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("scroll", this.handleScroll);
  // }

  // handleScroll = () => {
  //   const { prevScrollpos } = this.state;

  //   const currentScrollPos = window.pageYOffset;
  //   const headerSticky = prevScrollpos >= 64;

  //   this.setState({
  //     prevScrollpos: currentScrollPos,
  //     headerSticky
  //   });
  // };

  initUserInfo = async() => {
    const data = JSON.parse(sessionStorage.getItem('user'));
    if (!data) return;
    await this.props.signInWithToken(data.token);
  }

  componentDidMount() {
    this.initUserInfo();
  }

  clearAlert() {
    this.props.clearAlert();
  }

  render() {
    const { alert } = this.props;
    const user = this.props.auth.toJS();

    return(
      <BrowserRouter>
        <div className="header">
          <NavBar/>
        </div>
        <div className="section">
          <SideBar/>
          <div className="container">
            <Switch>
              <Route path="/signup" component={ SignUp } />
              <Route path="/movie" component={ Movie } />
              <Route path="/theater" component={ Theater } />
              <Route path="/ticket" component={ Ticket } />
              { user.isSigned && <Route path="/mypage" component={ MyPage } /> }
              { user.adminType && <Route path="/admin" component={ Admin } /> }
              <Route exact path="/" component={ Dashboard } />
              <Route component={ Page404 } /> {/* 404 page */}
            </Switch>
            {/* { alert.type && 
              <div id="alert">
                <div id="body">
                  <div id="type" className={ alert.type }/>
                  <span id="message">{ alert.message }</span>
                  <div id="close" onClick={ this.clearAlert }>닫기</div>
                </div>
              </div>
            } */}
          </div>
        </div>
        { alert.type && 
          <div id="alert">
            <div id="body">
              <div id="type" className={ alert.type }/>
              <span id="message">{ alert.message }</span>
              <div id="close" onClick={ this.clearAlert }>닫기</div>
            </div>
          </div>
        }
      </BrowserRouter>
    )
  }
}

function mapState(state) {
  const { alert, auth } = state;
  return { alert, auth };
}

const actionCreators = {
  signInWithToken: authAction.signInWithToken,
  clearAlert: alertAction.clear
}

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };
