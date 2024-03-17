import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import axios from 'axios';
import { apiUrl }from 'constant';

import { alertAction } from 'actions/alert.action';

import 'styles/SignUp.scss';

const InputFiled = (props) => {
  const handleChange = (e) => {
    props.onChange(e);
  };
  
  const { type, title, name, value } = props;
  return (
    <div id="field">
      <span id="title">{ title }</span>
      <div id="body">
        <input type="text" type={ type } name={ name } value={ value } onChange={ handleChange } autoComplete="off"/>
      </div>
    </div>
  );
}

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: '',
      rePassword: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, name, password, rePassword } = this.state;
    if (email && name && password && password === rePassword) {
      axios.post(`${ apiUrl }/user/register`, this.state)
        .then(res => {
          const { ok, message } = res.data;
          if (ok) {
            this.props.history.goBack();
            this.props.successAlert('회원가입 완료');
          } else {
            this.props.errorAlert(message);
          }
        })
        .catch(err => {
          // console.error(err);
        });
    } else {
      this.props.errorAlert('필드를 모두 채워주세요.');
    }
  }

  render() {
    const { email, name, password, rePassword } = this.state;
    return (
      <div id="signup">
        <form onSubmit={ this.handleSubmit }>
          <InputFiled title="이메일" name="email" value={ email } onChange={ this.handleChange }/>
          <InputFiled title="이름" name="name" value={ name } onChange={ this.handleChange }/>
          <InputFiled title="패스워드" type="password" name="password" value={ password } onChange={ this.handleChange }/>
          <InputFiled title="패스워드 재입력" type="password" name="rePassword" value={ rePassword } onChange={ this.handleChange }/>
          {/* <div id="field">
            <span id="title">이메일</span>
            <div id="body">
              <input type="text" name="email" value={ email } onChange={ this.handleChange } autoComplete="off"/>
            </div>
          </div>
          <div id="field">
            <span id="title">패스워드</span>
            <div id="body">
              <input type="password" name="password" value={ password } onChange={ this.handleChange }/>
            </div>
          </div>
          <div id="field">
            <span id="title">패스워드 재입력</span>
            <div id="body">
              <input type="password" name="rePassword" value={ rePassword } onChange={ this.handleChange }/>
            </div>
          </div> */}
          <button id="submit">가입</button>
        </form>
      </div>
    );
  }
}

const actionCreators = {
  successAlert: alertAction.success,
  errorAlert: alertAction.error
}

const connectedApp = connect(undefined, actionCreators)(SignUp);
export { connectedApp as SignUp };