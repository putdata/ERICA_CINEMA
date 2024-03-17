import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { authAction } from 'actions/auth.action';

import 'styles/SignInDropDown.scss';
import { alertAction } from 'actions/alert.action';

class SignInDropDown extends Component {
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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      email: '',
      password: '',
      dropDownVisible: false,
      submitted: false
    });
  }

  handleChange(e) {
    if (this.state.submitted) this.setState({ submitted: false });

    const { name, value } = e.target;
    // console.log(name);
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (!email) {

      return;
    }
    if (!password) {
      return;
    }

    if (email && password) {
      this.props.signIn(email, password);
    }
  }

  render() {
    const { email, password, submitted } = this.state;
    const { dropDownVisible } = this.state;

    return (
      <div id="signin" ref={ ref => this.node = ref }>
        <div id="btn" onClick={ this.handleClick }>로그인</div>
        { dropDownVisible &&
          <div id="dropdown">
            <div id="form">
              <form onSubmit={ this.handleSubmit }>
                <div id="field">
                  <input type="email" name="email" value={ email } onChange={ this.handleChange } placeholder="이메일" autoComplete="off"/>
                  { submitted && !email &&
                    <div id="warn">
                      <span id="message">이메일을 입력해주세요.</span>
                    </div>
                  }
                </div>
                <div id="field">
                  <input type="password" name="password" value={ password } onChange={ this.handleChange } placeholder="패스워드"/>
                  { submitted && email && !password &&
                    <div id="warn">
                      <span id="message">패스워드를 입력해주세요.</span>
                    </div>
                  }
                </div>
                <button id="submit">로그인</button>
              </form>
              <div id="footer">
                <Link to="/signup">
                  <span id="signup" onClick={ this.closeDropDown }>Sign up for EricaCinema</span>
                </Link>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const actionCreators = {
  alertError: alertAction.error,
  signIn: authAction.signIn
}


export default connect(undefined, actionCreators)(SignInDropDown);