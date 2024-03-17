import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Record, List } from 'immutable';
import axios from 'axios';

import 'styles/Theater.scss';
import { apiUrl, serverUrl }from 'constant';
import { alertAction } from 'actions/alert.action';

const mapGrade = {
  "청소년관람불가": "adult",
  "15세이상관람가": "fifteen",
  "12세이상관람가": "twelve",
  "전체관람가": "all"
};

class Theater extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theaterList: null,
      code: -1,
      info: {},
      guideMaps: [],
      viewGuideMapIdx: 0,
      guideMapOn: false,
      showDateList: [],
      movieInfo: {},
      screenInfo: {},
      timeTable: {}
    }

    this.viewGuideMap = this.viewGuideMap.bind(this);
    this.getTheaterDetail = this.getTheaterDetail.bind(this);
    this.getScreenList = this.getScreenList.bind(this);
    this.getShowDateList = this.getShowDateList.bind(this);
    this.getShowTimeList = this.getShowTimeList.bind(this);

    this.changeTheater = this.changeTheater.bind(this);
    this.changeViewGuideMap = this.changeViewGuideMap.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.goMovieDetailPage = this.goMovieDetailPage.bind(this);

    this.bookTicket = this.bookTicket.bind(this);
  }

  componentDidMount() {
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
          const theaterCode = theaterList[Object.keys(theaterList)[0]][0].code;
          this.setState({ code: theaterCode, theaterList: theaterList });
          this.getTheaterDetail(theaterCode);
          this.getScreenList(theaterCode);
          this.getShowDateList(theaterCode);
        } else {
          this.props.errorAlert(res.data.message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
    axios.get(`${ apiUrl }/theater/movieInfo`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          let movieInfo = {};
          for (const { code, title, run_time, open, watch_grade } of data) {
            movieInfo[code] = {
              title: title,
              runTime: run_time,
              open: open.substr(0, 4) + '.' + open.substr(4, 2) + '.' + open.substr(6, 2),
              watchGrade: watch_grade
            };
          }
          this.setState({ movieInfo: movieInfo });
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  getTheaterDetail(theaterCode) {
    axios.get(`${ apiUrl }/theater/theaterDetail?theaterCode=${ theaterCode }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          const { info, guideMaps } = data;
          this.setState({
            code: theaterCode,
            info: info,
            guideMaps: guideMaps
          });
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  getScreenList(theaterCode) {
    axios.get(`${ apiUrl }/theater/ScreenList?theaterCode=${ theaterCode }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          let screenInfo = {};
          for (const { code, name, total_seats } of data) {
            screenInfo[code] = {
              name: name,
              totalSeats: total_seats
            };
          }
          this.setState({ screenInfo: screenInfo });
        }
      })
      .catch(err => {
        // console.error(err);
      })
  }

  getShowDateList(theaterCode) {
    axios.get(`${ apiUrl }/theater/showDateList?theaterCode=${ theaterCode }`)
      .then(res => {
        const { ok, data } = res.data;
        // console.log(res.data);
        if (ok) {
          this.setState({ showDateList: data });
          if (data.length) {
            this.getShowTimeList(theaterCode, data[0].date);
          }
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  getShowTimeList(theaterCode, date) {
    axios.get(`${ apiUrl }/theater/showTimeList?theaterCode=${ theaterCode }&date=${ date }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          let timeTable = {};
          for (const { movie_code, screen_code, start, booked_seats } of data) {
            if (timeTable[movie_code] === undefined) timeTable[movie_code] = {};
            if (timeTable[movie_code][screen_code] === undefined) timeTable[movie_code][screen_code] = [];
            timeTable[movie_code][screen_code].push({ start: start, bookedSeats: booked_seats });
          }
          this.setState({ timeTable: timeTable });
        }
      })
      .catch(err => {
        // console.error(err);
      })
  }

  changeTheater(theaterCode) {
    if (this.state.code === theaterCode) return;
    this.setState({
      code: theaterCode,
      info: {},
      guideMaps: [],
      viewGuideMapIdx: 0,
      guideMapOn: false,
      showDateList: [],
      screenInfo: {},
      timeTable: {}
    });
    this.getTheaterDetail(theaterCode);
    this.getScreenList(theaterCode);
    this.getShowDateList(theaterCode);
  }

  changeViewGuideMap(idx) {
    this.setState({ viewGuideMapIdx: idx });
  }

  changeDate(date) {
    this.getShowTimeList(this.state.code, date);
  }

  goMovieDetailPage(movieCode) {
    this.props.history.push(`/movie/detail/${ movieCode }`);
  }

  viewGuideMap() {
    this.setState({ guideMapOn: !this.state.guideMapOn });
  }

  bookTicket(movieCode, movieName, location, theaterCode, theaterName, screenCode, start) {
    this.props.history.push({
      pathname: '/ticket',
      state: {
        movieCode: movieCode,
        movieName: movieName,
        location: location,
        theaterCode: theaterCode,
        theaterName: theaterName,
        screenCode: screenCode,
        start: start.slice(0, 19).replace('T', ' ')
      }
    });
  }

  render() {
    const { theaterList, code, info, guideMaps, viewGuideMapIdx, guideMapOn, showDateList, movieInfo, screenInfo, timeTable } = this.state;
    // console.log(code, info, guideMaps);

    if (theaterList === null) {
      return (
        <div id="theater-page">불러오는 중</div>
      )
    }

    return (
      <div id="theater-page" className="flex-c">
        <div id="theater-list" className="flex-r">
          {  theaterList &&
            Object.keys(theaterList).map((key, i) => {
              return (
                <div id="location" key={ i }>
                  <div id="label">{ key }</div>
                  <div id="list" className="flex-r">
                    { theaterList[key] &&
                      theaterList[key].map((theater) => {
                        const  { code, name } = theater;
                        return ( <div id="item" key={ code } onClick={ () => this.changeTheater(code) }>{ name }</div> );
                      })
                    }
                  </div>
                </div>
              );
            })
          }
        </div>

        { info &&
          <div id="theater-info" className="flex-c">
            <div id="name">영화관 { info.location } - { info.name }</div>
            <div id="address">주소 - { info.address }</div>
            <div id="phone">번호 - { info.phone }</div>
          </div>
        }

        <div id="guide-map" className="flex-c center">
          <div id="title">영화관 층별 안내도</div>
          <div id="content" className={ "flex-c" + (guideMapOn ? ' active' : '') }>
            <div id="floors" className="flex-r">
              {
                guideMaps.map(({ comment }, i) => {
                  return ( <div id="floor" key={ i } onClick={ () => this.changeViewGuideMap(i) }>{ comment }</div> );
                })
              }
            </div>
            {
              guideMaps.map(({ img }, i) => {
                return ( <img id="img" src={ `${ serverUrl }/${ img }` } key={ i } active={ viewGuideMapIdx === i ? 'true' : 'false' } /> );
              })
            }
          </div>
          <div id="view" onClick={ this.viewGuideMap }>{ !guideMapOn ? '보기' : '닫기' }</div>
        </div>

        <div id="movies" className="flex-c">
          <div id="title">상영시간표</div>
          { !showDateList.length &&
            <div id="no-date">
              <img src="/no-list.svg" />
              <div>아쉽게도 없네요...</div> 
            </div>
          }
          <div id="day-list" className="flex-r">
            <div id="day-wrap" className="flex-r">
              {
                showDateList.map((item, i) => {
                  const { date } = item;
                  return ( <div id="day" name={ date } key={ i } onClick={ () => this.changeDate(date) }>{ date.slice(5, 7) }월 { date.slice(8, 10)}일</div> );
                })
              }
            </div>
          </div>

          {
            Object.keys(timeTable).map((movieCode) => {
              const { title, runTime, open, watchGrade } = movieInfo[movieCode];
              const mapWatchGrade = mapGrade[watchGrade];
              return (
                <div id="movie" key={ movieCode } className={ `flex-c ${ mapWatchGrade }` }>
                  <div id="info" className="flex-r">
                    <div id="watch-grade" className={ mapWatchGrade } />
                    <div id="name" onClick={ () => this.goMovieDetailPage(movieCode) }>{ title }</div>
                    <div id="runtime">{ runTime }분</div>
                    <div id="open">{ open } 개봉</div>
                  </div>
                  {
                    Object.keys(timeTable[movieCode]).map((screenCode) => {
                      const { name, totalSeats } = screenInfo[screenCode];
                      const timeList = timeTable[movieCode][screenCode];
                      return (
                        <div id="content" key={ screenCode } className="flex-c">
                          <div id="screen-info" className="flex-r">
                            <div id="screen-name">{ name }</div>
                            <div id="total-seats">총 { totalSeats }석</div>
                          </div>
                          <div id="time-list" className="flex-r">
                            {
                              timeList.map((item) => {
                                const { start, bookedSeats } = item;
                                return (
                                  <div id="item" key={ start } onClick={ () => this.bookTicket(movieCode, title, info.location, code, info.name, screenCode, start) } className="flex-c center">
                                    {/* <div id="screen-type">4DX 3D</div> */}
                                    <div id="time">{ start.slice(11, 16) }</div>
                                    <div id="seats">{ totalSeats - bookedSeats }석</div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }

          {/* <div id="movie" className="flex-c adult">
            <div id="info" className="flex-r">
              <div id="watch-grade" className="adult" />
              <div id="name">익준이 군대간다</div>
              <div id="runtime">123분</div>
              <div id="open">2020.03.01 개봉</div>
            </div>
            <div id="content" className="flex-c">
              <div id="screen-info" className="flex-r">
                <div id="screen-type">4DX 3D</div>
                <div id="screen-name">1관 6층</div>
                <div id="total-seats">총 180석</div>
              </div>
              <div id="time-list" className="flex-r">
                <div id="item" className="flex-c center">
                  <div id="time">11:11</div>
                  <div id="seats">111석</div>
                </div>
                <div id="item" className="flex-c center">
                  <div id="time">11:11</div>
                  <div id="seats">111석</div>
                </div>
              </div>
            </div>
          </div> */}


        </div>
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

const connectedApp = connect(undefined, actionCreators)(Theater);
export { connectedApp as Theater };


// INSERT INTO theater_guide_map VALUES(0, -1, "B1F", 'public/theater/ik-1.png');
// INSERT INTO theater_guide_map VALUES(0, 1, "1F", 'public/theater/ik1.png');
// INSERT INTO theater_guide_map VALUES(0, 2, "2F", 'public/theater/ik2.png');