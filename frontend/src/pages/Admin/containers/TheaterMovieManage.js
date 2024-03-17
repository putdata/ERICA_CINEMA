import React, { Component, Fragment, useRef } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, Record } from 'immutable';


import axios from 'axios';
import { apiUrl, serverUrl }from 'constant';
import { alertAction } from 'actions/alert.action';

import 'styles/TheaterMovieManage.scss';

const Data = Record({
  theaterCode: '',
  screenCode: '',
  movieCode: '',
  date: '',
  hours: "0",
  minutes: "0"
});

class TheaterMovieManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curDate: '',
      theaterList: {},
      viewTheaterList: '',
      selectedTheater: '',
      screenList: [],
      timeList: [],
      movieList: [],
      data: Data()
    };

    this.handleTheater = this.handleTheater.bind(this);
    this.handleTheaterCode = this.handleTheaterCode.bind(this);
    this.handleScreen = this.handleScreen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setTime = this.setTime.bind(this);
  }

  setTime() {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const timezoneDate = new Date(Date.now() - timezoneOffset);
    const curDate =timezoneDate.toISOString().slice(0, 10);
    const { data } = this.state;
    this.setState({ curDate: curDate, data: data.set('date', curDate) });
  }

  componentDidMount() {
    this.setTime();
    axios.get(`${ apiUrl }/theater/theaterList`)  
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          let theaterList = {};
          for (const { location, code, name } of data) {
            if (!theaterList[location]) {
              theaterList[location] = [{ code: code, name: name }];
            } else {
              theaterList[location].push({ code: code, name: name });
            }
          }
          this.setState({ theaterList: theaterList });
        } else {
          this.props.errorAlert(res.data.message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
    axios.get(`${ apiUrl }/movie/movieList`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          this.setState({ movieList: data });
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  handleTheater(e) {
    this.setState({
      screenList: [],
      data: this.state.data.merge({
        screenCode: '',
        movieCode: this.state.data.movieCode
      })
    });
    const { name, value } = e.target;
    // console.log(name, value);
    this.setState({ [name]: value });
  }

  handleTheaterCode(code, name) {
    axios.get(`${ apiUrl }/theater/screenList?theaterCode=${ code }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          this.setState({ screenList: data || [] });
        }
      })
      .catch(err => {
        // console.error(err);
      });

    const { viewTheaterList, data } = this.state;
    this.setState({
      selectedTheater: `${ viewTheaterList} - ${ name }`,
      timeList: [],
      data: data.merge({
        theaterCode: code,
        screenCode: '',
      })
    });
  }

  getTimeList(x, y, z) {
    axios.get(`${ apiUrl }/admin/theater/movieTimeList?theaterCode=${ x }&screenCode=${ y }&date=${ z }`)
      .then(res => {
        const { ok } = res.data;
        this.setState({ timeList: ok ? res.data.data : [] });
      })
      .catch(err => {
        // console.error(err);
      });
  }

  handleScreen(e) {
    const { name, value } = e.target;
    const { data } = this.state;
    const { theaterCode, date } = data;
    if (value) {
      this.getTimeList(theaterCode, value, date);
    } else {
      this.setState({ timeList: [] });
    }
    this.setState({ data: data.set(name, value) });
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { data } = this.state;
    if (name === 'date') {
      const { theaterCode, screenCode } = data;
      this.getTimeList(theaterCode, screenCode, value);
    }
    this.setState({ data: data.set(name, value) });
  }

  handleSubmit() {
    const param = this.state.data.toJS();
    // console.log(param);
    axios.post(`${ apiUrl }/admin/theater/movieTimeAdd`, param)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.setState({ 
            curDate: '',
            viewTheaterList: '',
            selectedTheater: '',
            screenList: [],
            timeList: [],
            data: Data()
          });
          this.setTime();
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
    const { curDate, theaterList, viewTheaterList, selectedTheater, screenList, timeList, movieList, data } = this.state;
    const { screenCode, movieCode, date, hours, minutes } = data;
    // console.log(timeList);
    return (
      <div id="theater-movie-manage" className="flex-c">
        <select name="viewTheaterList" value={ viewTheaterList } onChange={ this.handleTheater }>
          <option value="">영화관 지역 선택</option>
          { theaterList &&
            Object.keys(theaterList).map((key, i) => {
              return ( <option key={ i } value={ key }>{ key }</option> );
            })
          }
        </select>
        { viewTheaterList &&
          <div id="theater-list" className="flex-r">
            {
              theaterList[viewTheaterList].map((theater) => {
                const { code, name } = theater;
                return (
                  <div key={ code } id="theater" onClick={ () => this.handleTheaterCode(code, name) }>{ name }</div>
                );
              })
            }
          </div>
        }
        { selectedTheater && <div id="selected-theater">선택 극장 : { selectedTheater }</div> }
        { selectedTheater &&
          <select name="screenCode" value={ screenCode } onChange={ this.handleScreen }>
            <option value="">상영관 선택</option>
            { screenList &&
              screenList.map((item, i) => {
                const { code, name, total_seats } = item;
                return ( <option key={ i } value={ code }>{ name } - 총 좌석 { total_seats }</option> );
              })
            }
          </select>
        }
        { timeList &&
          <div id="time-list">
            {
              timeList.map((item, i) => {
                const { start, end } = item;
                // console.log(start, end);
                const S = new Date(start);
                const E = new Date(end);
                return ( <div key={ i }>{ `${ S.getUTCHours() }:${ S.getUTCMinutes() }` } - { `${ E.getUTCHours() }:${ E.getUTCMinutes() }` }</div> );
              })
            }
          </div>
        }
        <select name="movieCode" value={ movieCode } onChange={ this.handleChange }>
          <option value="">상영중인 영화 선택</option>
          { movieList &&
            movieList.map((item, i) => {
              const { code, title } = item;
              return ( <option key={ i } value={ code }>{ title }</option> );
            })
          }
        </select>

        <div id="start-text">영화 시작시간 설정 (날짜 시간 분)</div>
        <div className="flex-r">
          <input type="date" name="date" min={ curDate } value={ date } onChange={ this.handleChange } />
          <input type="number" name="hours" min="0" max="23" value={ hours } onChange={ this.handleChange } />
          <input type="number" name="minutes" min="0" max="59" value={ minutes } onChange={ this.handleChange } />
        </div>

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
export default connect(undefined, actionCreators)(TheaterMovieManage);