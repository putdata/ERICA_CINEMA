import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { authAction } from 'actions/auth.action';

import 'styles/ProfileDropDown.scss';

class ProfileDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      dropDownVisible: false,
      submitted: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.closeDropDown = this.closeDropDown.bind(this);
  }

  componentDidMount() {
    const user = this.props.auth.toJS();
    this.setState({
      email: user.email,
      name: user.name
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
  }

  handleClick() {
    // console.log(this.state.dropDownVisible);
    if (!this.state.dropDownVisible) {
      document.addEventListener('mousedown', this.handleOutsideClick, false);
      this.setState({ dropDownVisible: true });
    } else {
      this.closeDropDown();
    }
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) return;

    this.closeDropDown();
  }

  closeDropDown() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
    
    this.setState({
      dropDownVisible: false,
      submitted: false
    });
  }

  render() {
    const { email, name, dropDownVisible } = this.state;

    return (
      <div id="profile" ref={ ref => this.node = ref }>
        <div id="outside" className="flex-r center" onClick={ this.handleClick }>
          <img id="icon" src="/profile.svg"/>
          <div id="name">{ name } 님</div>
        </div>
        { dropDownVisible &&
          <div id="dropdown">
            <div id="wrap" className="flex-c">
              <Link to="/mypage"><div id="mypage-btn">마이페이지</div></Link>
              <div id="segment-line" />
              <div id="signout-btn" onClick={ () => this.props.signOut() } className="flex-r">
                <img src="/signout.svg" />
                <div id="text">로그아웃</div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapState(state) {
  const { auth } = state;
  return { auth };
}

const actionCreators = {
  signOut: authAction.signOut
}


export default connect(mapState, actionCreators)(ProfileDropDown);