import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import axios from 'axios';
import { apiUrl }from 'constant';

import { alertAction } from 'actions/alert.action';
import 'styles/MyPage.scss';


class MyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      mileage: 0,
      accMileage: 0,
      grade: '',
      paymentInfo: []
    };

    this.userInfo = this.userInfo.bind(this);
    this.paymentInfo = this.paymentInfo.bind(this);
    this.cancelBookTicket = this.cancelBookTicket.bind(this);
  }

  componentDidMount() {
    const user = this.props.auth.toJS();
    this.setState({ email: user.email });
    this.userInfo(user.email);
    this.paymentInfo(user.email);
  }

  cancelBookTicket(serialNumber) {
    const user = this.props.auth.toJS();
    const param = {
      email: user.email,
      serialNumber: serialNumber
    }
    axios.post(`${ apiUrl }/user/cancelTicket`, param)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.props.successAlert('예매가 취소 되었습니다.');
          this.userInfo(user.email);
          this.paymentInfo(user.email);
        } else {
          this.props.errorAlert(message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  userInfo(email) {
    axios.get(`${ apiUrl }/user/userInfo?email=${ email }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          const { mileage, acc_mileage, grade } = data;
          this.setState({
            mileage: mileage,
            accMileage: acc_mileage,
            grade: grade
          });
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  paymentInfo(email) {
    axios.get(`${ apiUrl }/user/paymentInfo?email=${ email }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          this.setState({ paymentInfo: data });
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  render() {
    const { email, mileage, accMileage, grade, paymentInfo } = this.state;
    return (
      <div id="my-page" className="flex-c">
        <div id="my-info">
          <div id="title">내 정보</div>
          <div id="info">
            <div id="label">이메일</div>
            <div id="value">{ email }</div>
          </div>
          <div id="info">
            <div id="label">마일리지</div>
            <div id="value">{ mileage }</div>
          </div>
          <div id="info">
            <div id="label">누적 마일리지</div>
            <div id="value">{ accMileage }</div>
          </div>
          <div id="info">
            <div id="label">등급</div>
            <div id="value">{ grade }</div>
          </div>
        </div>

        <div id="payment">
          <div id="title">결제내역</div>
          {
            paymentInfo.map((log) => {
              const { time, type, serial_number, price } = log;
              return (
                <div id="log" key={ time } className="flex-r">
                  <div id="time">{ time.slice(0, 16).replace('T', ' ') }</div>
                  <div id="type">{ type }</div>
                  <div id="serial-number">{ serial_number }</div>
                  <div id="price">₩{ price }</div>
                  <div id="cancel-btn" onClick={ () => this.cancelBookTicket(serial_number) }>예매 취소</div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { auth } = state;
  return { auth };
}

const actionCreators = {
  successAlert: alertAction.success,
  errorAlert: alertAction.error
}

const connectedApp = connect(mapState, actionCreators)(MyPage);
export { connectedApp as MyPage };