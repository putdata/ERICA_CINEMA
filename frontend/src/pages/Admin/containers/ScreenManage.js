import React, { Component, Fragment, useRef } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, Record } from 'immutable';


import axios from 'axios';
import { apiUrl, serverUrl }from 'constant';
import { alertAction } from 'actions/alert.action';

import 'styles/ScreenManage.scss';

const Seat = Record({
  x: 0,
  y: 0,
  disable: false,
  grade: 'NORMAL'
});

const Data = Record({
  theaterCode: '',
  screenCode: '',
  screenName: '',
  row: 0,
  column: 0,
  disabled: 0,
  seats: List()
});

class ScreenManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Data()
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCount = this.handleCount.bind(this);
    this.handleSeat = this.handleSeat.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { data } = this.state;
    this.setState({ data: data.set(name, value) });
  }

  handleCount(e) {
    const { name } = e.target;
    let { data } = this.state;
    const { row, column } = data;
    let { seats } = data;
    // console.log(name);
    if (name === 'row-plus' && row <= 25) {
      seats = seats.push(List())
      for (let i = 0; i < column; i++) seats = seats.setIn([row, i], Seat({ x: row + 1, y: i + 1 }));
      
      this.setState({
        data: data.merge({ "row": row + 1, "seats": seats })
      });
    } else if (name === 'row-minus' && row > 0) {
      this.setState({ data: data.merge({ "row": row - 1, "seats": seats.pop() }) });
      // this.setState({
      //   row: row - 1,
      //   seats: seats.pop()
      // });
    } else if (name === 'col-plus' && column <= 29) {
      for (let i = 0; i < row; i++) seats = seats.setIn([i, column], Seat({ x: i + 1, y: column + 1 }));
      this.setState({ data: data.merge({ "column": column + 1, seats: seats }) });
      // this.setState({
      //   column: column + 1,
      //   seats: seats
      // });
    } else if (name === 'col-minus' && column > 0) {
      for (let i = 0; i < row; i++) seats = seats.set(i, seats.get(i).pop());
      this.setState({ data: data.merge({ "column": column - 1, seats: seats }) });
      // this.setState({
      //   column: column - 1,
      //   seats: seats
      // });
    }
  }

  handleSeat(name, x, y) {
    const { data } = this.state;
    const { disabled, seats } = data;
    if (name === 'disable') {
      const value = seats.getIn([x - 1, y - 1, name]);
      this.setState({
        data: data.merge({
          "disabled": disabled + (value ? -1 : 1),
          "seats": seats.setIn([x - 1, y - 1, name], !value)
        })
      });
      // this.setState({
      //   disabled: disabled + (value ? -1 : 1),
      //   seats: seats.setIn([x - 1, y - 1, name], !value)
      // });
    } else {
      this.setState({ data: data.set("seats", seats.setIn([x - 1, y - 1, 'grade'], name)) });
      // this.setState({ seats: seats.setIn([x - 1, y - 1, 'grade'], name) });
    }
  }

  handleSubmit() {
    const param = this.state.data.toJS();
    // console.log(param);
    axios.post(`${ apiUrl }/admin/branch/screenAdd`, param)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.setState({ data: Data() });
          this.props.successAlert(message);
        } else {
          // console.log(message);
          this.props.errorAlert(message);
        }
      })
      .catch(err => {
        // console.error(err);
      })
  }

  render() {
    const { theaterCode, screenCode, screenName, row, column, disabled, seats } = this.state.data;
    const total = row * column - disabled;
    return (
      <div id="screen-manage" className="flex-c">
        <div id="setting" className="flex-c">
          <input type="text" name="theaterCode" placeholder="영화관 코드" value={ theaterCode } onChange={ this.handleChange } />
          <input type="text" name="screenCode" placeholder="상영관 코드" value={ screenCode } onChange={ this.handleChange } />
          <input type="text" name="screenName" placeholder="상영관 이름" value={ screenName } onChange={ this.handleChange } />

          <div className="flex-r">
            <div>행 { row }&nbsp;</div>
            <button name="row-plus" onClick={ this.handleCount }>추가</button>
            <button name="row-minus" onClick={ this.handleCount }>빼기</button>
          </div>
          <div className="flex-r">
            <div>열 { column }&nbsp;</div>
            <button name="col-plus" onClick={ this.handleCount }>추가</button>
            <button name="col-minus" onClick={ this.handleCount }>빼기</button>
          </div>
        </div>

        <div id="screen">SCREEN</div>
        <div id="seats" className="flex-c">
          {
            seats.map((item, i) => {
              return (
                <div id="row" className="flex-r" key={ i }>
                  {
                    item.map((seat) => {
                      const { x, y, disable, grade } = seat;
                      const key = `${ x },${ y }`;
                      return (
                        <div id="seat" key={ key } className={ "flex-c center" + (disable ? " disabled" : ` ${ grade.toLowerCase() }`)} >
                          <div>{ key }</div>
                          <div onClick={ (e) => this.handleSeat("disable", x, y) }>비활성</div>
                          <div onClick={ (e) => this.handleSeat("NORMAL", x, y) }>기본</div>
                          <div onClick={ (e) => this.handleSeat("COUPLE", x, y) }>커플</div>
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
        <div id="total-seats">총 { total } 좌석</div>
        <div id="submit" onClick={ this.handleSubmit }>제출</div>
      </div>
    );
  }
}

function mapState(state) {
}

const actionCreators = {
  successAlert: alertAction.success,
  errorAlert: alertAction.error
}

// const connectedApp = connect(undefined, actionCreators)(BranchAdd);
export default connect(undefined, actionCreators)(ScreenManage);