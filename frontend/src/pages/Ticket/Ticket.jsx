import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Record, List, Map } from 'immutable';
import { apiUrl, serverUrl }from 'constant';
import { alertAction } from 'actions/alert.action';
import axios from 'axios';

import 'styles/Ticket.scss';

const mapGrade = {
  "청소년관람불가": "adult",
  "15세이상관람가": "fifteen",
  "12세이상관람가": "twelve",
  "전체관람가": "all"
};

class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMovie: null,
      selectedMovieTitle: null,
      selectedLocation: null,
      selectedTheater: null,
      selectedTheaterName: null,
      selectedScreen: null,
      selectedDate: null,
      selectedTime: null,
      movieList: [],
      locationList: [],
      theaterList: [],
      dateList: [],
      screenTimeList: {},
      screenInfo: {},
      seatList: [],
      bookedSeat: {},
      selectedSeat: Map(),
      totalPrice: 0,
      step: 0,
      payModal: false,
      ticketData: {}
    }

    this.changeMovie = this.changeMovie.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
    this.changeTheater = this.changeTheater.bind(this);

    this.handleReset = this.handleReset.bind(this);
    this.handleStep = this.handleStep.bind(this);

    this.handlePayModal = this.handlePayModal.bind(this);
    this.requestPay = this.requestPay.bind(this);
  }

  componentDidMount() {
    axios.get(`${ apiUrl }/movie/movieList`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          let movieList = [];
          for (const { code, title, watch_grade } of data) {
            movieList.push({
              code: code,
              title: title,
              watchGrade: mapGrade[watch_grade]
            });
          }
          this.setState({ movieList: movieList })
        }
      })
      .catch(err => {
        // console.error(err);
      });

    const propParam = this.props.location.state;
    if (propParam !== undefined) {
      const { movieCode, movieName, location, theaterCode, theaterName, screenCode, start } = propParam;
      this.changeMovie(movieCode, movieName)
        .then(() => {
          if (location !== undefined) {
            this.changeLocation(location)
              .then(() => {
                if (theaterCode !== undefined) {
                  this.changeTheater(theaterCode, theaterName)
                    .then(() => {
                      this.changeDate(start.slice(0, 10))
                        .then(() => {
                          this.changeTime(screenCode, start);
                        });
                    })
                }
              });
          }    
        });
    }
  }

  changeMovie(movieCode, movieTitle) {
    if (this.state.selectedMovie === movieCode) return;
    return new Promise((resolve, reject) => {
      this.setState({
        selectedMovie: movieCode,
        selectedMovieTitle: movieTitle,
        selectedLocation: null,
        selectedTheater: null,
        selectedScreen: null,
        selectedDate: null,
        selectedTime: null,
        locationList: [],
        theaterList: [],
        dateList: [],
        screenTimeList: {},
      });
      axios.get(`${ apiUrl }/ticket/movieLocationList?movieCode=${ movieCode }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            this.setState({ locationList: data });
          }
          resolve();
        })
        .catch(err => {
          // console.error(err);
          reject();
        });
    });
  }

  changeLocation(location) {
    const { selectedMovie, selectedLocation } = this.state;
    if (selectedLocation === location) return;
    return new Promise((resolve, reject) => {
      this.setState({
        selectedLocation: location,
        selectedTheater: null,
        selectedDate: null,
        selectedTime: null,
        theaterList: [],
        dateList: [],
        screenTimeList: {}
      });
      axios.get(`${ apiUrl }/ticket/movieTheaterList?location=${ location }&movieCode=${ selectedMovie }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            this.setState({ theaterList: data });
          }
          resolve();
        })
        .catch(err => {
          // console.error(err);
          reject();
        });
    });
  }

  changeTheater(theaterCode, theaterName) {
    const { selectedTheater, selectedMovie } = this.state;
    if (selectedTheater === theaterCode) return;
    return new Promise((resolve, reject) => {
      this.setState({
        selectedTheater: theaterCode,
        selectedTheaterName: theaterName,
        selectedDate: null,
        selectedTime: null,
        dateList: [],
        screenTimeList: {}
      });
      axios.get(`${ apiUrl }/ticket/movieDateList?theaterCode=${ theaterCode }&movieCode=${ selectedMovie }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            this.setState({ dateList: data });
          }
        })
        .catch(err => {
          // console.error(err);
        });
      axios.get(`${ apiUrl }/theater/ScreenList?theaterCode=${ theaterCode }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            let screenInfo = {};
            for (const { code, name, row, col, total_seats } of data) {
              screenInfo[code] = {
                name: name,
                row: row,
                col: col,
                totalSeats: total_seats
              };
            }
            this.setState({ screenInfo: screenInfo });
          }
          resolve();
        })
        .catch(err => {
          // console.error(err);
          reject();
        });
    });
  }

  changeDate(date) {
    const { selectedTheater, selectedMovie, selectedDate } = this.state;
    if (selectedDate === date) return;
    return new Promise((resolve, reject) => {
      this.setState({ selectedDate: date });
      axios.get(`${ apiUrl }/ticket/movieTimeList?theaterCode=${ selectedTheater }&movieCode=${ selectedMovie }&date=${ date }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            let screenTimeList = {};
            for (const { screen_code, start, booked_seats } of data) {
              if (screenTimeList[screen_code] === undefined) screenTimeList[screen_code] = [];
              screenTimeList[screen_code].push({ start: start, bookedSeats: booked_seats });
            }
            this.setState({ screenTimeList: screenTimeList });
            resolve();
          }
        })
        .catch(err => {
          // console.error(err);
          reject();
        })
    });
  }

  changeTime(screenCode, time) {
    this.setState({
      selectedScreen: screenCode,
      selectedTime: time
    });
  }

  handleReset() {
    this.setState({
      selectedMovie: null,
      selectedLocation: null,
      selectedTheater: null,
      selectedDate: null,
      selectedTime: null,
      locationList: [],
      theaterList: [],
      dateList: [],
      screenTimeList: {},
      screenInfo: {}
    });
  }

  handleStep() {
    const { selectedTheater, selectedScreen, selectedMovie, selectedTime, step } = this.state;
    this.setState({
      step: step ? 0 : 1
    });
    if (step == 0) {
      axios.get(`${ apiUrl }/theater/screenSeatList?theaterCode=${ selectedTheater }&screenCode=${ selectedScreen }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            this.setState({ seatList: data });
          }
        })
        .catch(err => {
          // console.error(err);
        });
      axios.get(`${ apiUrl }/ticket/bookedSeatList?theaterCode=${ selectedTheater }&screenCode=${ selectedScreen }&movieCode=${ selectedMovie }&start=${ selectedTime }`)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            let bookedSeat = {};
            for (const { seat_code } of data) {
              bookedSeat[seat_code] = true;
            }
            this.setState({ bookedSeat: bookedSeat });
          }
        })
        .catch(err => {
          // console.error(err);
        });
    }
  }

  handlePayModal() {
    const { totalPrice, payModal } = this.state;
    if (!totalPrice) {
      this.props.errorAlert('좌석을 선택하세요.');
      return;
    }
    this.setState({ payModal: !payModal });
  }

  selectSeat(seatCode, grade) {
    const { selectedTheater, selectedScreen, selectedMovie, selectedTime, selectedSeat, totalPrice, bookedSeat } = this.state;
    const getSeat = selectedSeat.get(seatCode);
    if (getSeat !== undefined) {
      this.setState({
        selectedSeat: selectedSeat.delete(seatCode),
        totalPrice: totalPrice - getSeat["price"]
      });
      return;
    }
    axios.get(`${ apiUrl }/ticket/selectSeat?theaterCode=${ selectedTheater }&screenCode=${ selectedScreen }&movieCode=${ selectedMovie }&start=${ selectedTime }&seatCode=${ seatCode }`)
      .then(res => {
        const { ok, message, data } = res.data;
        if (ok) {
          const { price } = data;
          this.setState({
            selectedSeat: selectedSeat.set(data.seatCode, { type: grade.toLowerCase(), price: price }),
            totalPrice: totalPrice + price
          });

          const scrollHeight = this.listRef.scrollHeight;
          const height = this.listRef.clientHeight;
          const maxScrollTop = scrollHeight - height;
          this.listRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        } else {
          this.setState({ bookedSeat: { ...bookedSeat, [seatCode]: true }});
          this.props.errorAlert(message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  requestPay() {
    const { selectedTheater, selectedScreen, selectedMovie, selectedTime, selectedSeat } = this.state;
    const param = {
      theaterCode: selectedTheater,
      screenCode: selectedScreen,
      movieCode: selectedMovie,
      start: selectedTime,
      selectedSeat: selectedSeat.toJS()
    };
    // console.log(param);
    axios.post(`${ apiUrl }/ticket/pay`, param)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          const { ticketNumber, price } = data;
          this.setState({
            step: 2,
            ticketData: {
              ticketNumber: ticketNumber,
              totalPrice: price
            }
          });
        } else {
          this.props.errorAlert(res.data.message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  render() {
    const { selectedMovie, selectedMovieTitle, selectedLocation, selectedTheater, selectedTheaterName, selectedScreen, selectedDate, selectedTime,
            step, movieList, locationList, theaterList, dateList, screenTimeList, screenInfo, seatList, bookedSeat, selectedSeat, totalPrice, payModal } = this.state;
    const selectedSeatJS = selectedSeat.toJS();
    // console.log(this.state);
    // console.log(selectedSeatJS);
    if (step == 0) {
      return(
        <div id="ticket-page" className="flex-c">

          <div id="ticket-option" className="flex-r">
            <div id="movie-list" className="flex-c">
              <div id="header" className="flex-c">
                <div id="label">영화</div>
              </div>
              <div id="movie" className="flex-c">
                {
                  movieList.map((item) => {
                    const { code, title, watchGrade } = item;
                    return (
                      <div id="item" key={ code } className="flex-r"
                          onClick={ () => this.changeMovie(code, title) }
                          active={ selectedMovie === code ? 'true' : 'false' }>
                        <div id="watch-grade" className={ watchGrade } />
                        <div id="title">{ title }</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            <div id="location-list" className="flex-c">
              <div id="header">
                <div id="label">지역</div>
              </div>
              <div id="location" className="flex-c">
                {
                  locationList.map((item, i) => {
                    const { location, count } = item;
                    return (
                      <div id="item" key={ i }
                          onClick={ () => this.changeLocation(location) }
                          active={ selectedLocation === location ? 'true' : 'false' }>{ location } ({ count })
                      </div>
                    );
                  })
                }
                { selectedMovie && !locationList.length &&
                  <div id="empty">
                    <img src="./emptybox.svg" />
                    <div>일정 없음</div>
                  </div>
                }
              </div>
            </div>

            <div id="theater-list" className="flex-c">
              <div id="header">
                <div id="label">영화관</div>
              </div>
              <div id="theater">
                {
                  theaterList.map((item) => {
                    const { code, name } = item;
                    return (
                      <div id="item" key={ code }
                          onClick={ () => this.changeTheater(code, name) }
                          active={ selectedTheater === code ? 'true' : 'false' }>{ name }
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div id="select-time">
              <div id="wrap" className="flex-c">
                <div id="date-list" className="flex-c">
                  <div id="header">
                    <div id="label">날짜</div>
                  </div>
                  <div id="date" className="flex-r">
                    {
                      dateList.map((item, i) => {
                        const { date } = item;
                        return (
                          <div id="item" key={ i }
                              onClick={ () => this.changeDate(date) }
                              active={ selectedDate === date ? 'true' : 'false' }>{ date.slice(5, 10).replace('-', '월 ') + '일' }
                          </div>
                        );
                      })
                    }
                  </div>
                </div>

                <div id="screen-list" className="flex-c">
                  {
                    Object.keys(screenTimeList).map((screenCode) => {
                      const { name, totalSeats } = screenInfo[screenCode];
                      return (
                        <div id="screen" key={ screenCode }>
                          <div id="name">{ name }</div>
                          <div id="time-list">
                            {
                              screenTimeList[screenCode].map((time, i) => {
                                const { start, bookedSeats } = time;
                                return (
                                  <div id="time" key={ i }
                                      onClick={ () => this.changeTime(screenCode, start) }
                                      active={ selectedTime === start ? 'true' : 'false' }>
                                    <span id="start">{ start.slice(11, 16) }</span>
                                    <span id="remain">{ totalSeats - bookedSeats }석</span>
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
              </div>
            </div>
          </div>

          <div id="buttons" className="flex-r">
            <div id="reset-btn" onClick={ this.handleReset }>초기화</div>
            { selectedTime ?
              <div id="next-btn" onClick={ () => this.handleStep() }>좌석선택</div> :
              <div id="disable-btn">좌석선택</div>
            }
          </div>
        </div>
      );
    } else if (step == 1) {
      return (
        <Fragment>
          <div id="seat-select-page" className="flex-c">
            <div id="summary" className="flex-r">
              <div id="selected-info">
                <div id="movie">{  selectedMovieTitle }</div>
                <div id="theater">{ selectedLocation } - { selectedTheaterName }</div>
                <div id="screen">{ screenInfo[selectedScreen].name }</div>
                <div id="time">{ selectedTime.slice(0, 16) }</div>
              </div>
              <div id="selected-seat" ref={ ref => this.listRef = ref }>
                {
                  Object.keys(selectedSeatJS).map((code) => {
                    const { type, price } = selectedSeatJS[code];
                    return (
                      <div id="info" key={ code } className="flex-r center">
                        <div id="seat" className={ `flex-r center ${ type }` }>
                          <div id="position">{ code }</div>
                          <div id="type">{ type }</div>
                        </div>
                        <div id="price">₩{ price }</div>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div id="screen-seat">
              { seatList.length ?
                <div id="wrap" className="flex-c center">
                  <div id="screen">SCREEN</div>
                  <div id="seats" style={ {
                    gridTemplateRows: `repeat(${ screenInfo[selectedScreen].row }, 60px)`,
                    gridTemplateColumns: `repeat(${ screenInfo[selectedScreen].col }, 60px)`
                    } }
                  >
                    {
                      seatList.map((item) => {
                        const { x, y, code, grade } = item;
                        return (
                          <div id="seat" key={ code }
                              style={ { gridRow: `${ x } / ${ x + 1 }`, gridColumn: `${ y } / ${ y + 1 }` } }
                              onClick={ () => this.selectSeat(code, grade) }
                              className={ (bookedSeat[code] ? 'disabled' : grade.toLowerCase()) + (selectedSeatJS[code] !== undefined ? ' selected' : '') }>
                            { code }
                          </div>
                        );
                      })
                    }
                  </div>
                </div> :
                <div id="wrap" className="flex-c center">불러오는 중...
                </div>
              }
            </div>

            <div id="result" className="flex-r">
              <div id="total-price">총 <span id="won">{ totalPrice.toLocaleString() }</span>원</div>
              <div id="buttons" className="flex-r">
                {/* <div id="reset-btn">초기화</div> */}
                { Object.keys(selectedSeatJS).length ?
                  <div id="pay-btn" onClick={ this.handlePayModal }>결제하기</div> :
                  <div id="disable-btn">결제하기</div>
                }
              </div>
            </div>
          </div>

          { payModal && 
            <div id="pay-modal" className="flex-c center">
              <div id="wrap" className="flex-c">
                <div id="header">휴대폰 결제</div>
                <div id="fields">
                  <div id="label">이름</div>
                  <input id="input-name" autoComplete="off" />

                  <div id="label">주민등록번호</div>
                  <div id="rrn" className="flex-r">
                    <input id="input-front" maxLength="6" autoComplete="off" />
                    <div id="segment">-</div>
                    <input id="input-back" maxLength="1" />
                    <div id="secret">******</div>
                  </div>

                  <div id="label">휴대폰 전화번호 ('-' 제외)</div>
                  <input id="input-phone" maxLength="11" autoComplete="off" />
                </div>
                <div id="price">₩{ totalPrice.toLocaleString() }</div>
                <div id="buttons" className="flex-r">
                  <div id="cancel-btn" onClick={ this.handlePayModal }>취소</div>
                  <div id="pay-btn" onClick={ this.requestPay }>결제</div>
                </div>
              </div>
            </div>
          }
        </Fragment>
      );
    } else {
      const { ticketData } = this.state;
      const { ticketNumber, totalPrice } = ticketData;
      return (
        <div id="success-page" className="flex-c center">
          <div id="success-text">예매 완료</div>
          <div id="ticket-number-label">티켓 일련번호</div>
          <div id="ticket-number">{ ticketNumber }</div>
          <div id="total-price-text">결제금액</div>
          <div id="total-price">₩{ totalPrice }</div>
        </div>
      );
    }
  }
}

function mapState(state) {
}

const actionCreators = {
  successAlert: alertAction.success,
  errorAlert: alertAction.error
}

const connectedApp = connect(undefined, actionCreators)(Ticket);
export { connectedApp as Ticket };
