import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import axios from 'axios';
import { Record, List } from 'immutable';
import { apiUrl, serverUrl } from 'constant';

import 'styles/MovieDetail.scss';

const mapGrade = {
  "청소년관람불가": "adult",
  "15세이상관람가": "fifteen",
  "12세이상관람가": "twelve",
  "전체관람가": "all"
};

class MovieDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.match.params.code,
      imgCurIdx: 0,
      data: {}
    }

    this.handleCurIdx = this.handleCurIdx.bind(this);
    this.bookMovie = this.bookMovie.bind(this);
  }

  componentDidMount() {
    const { code } = this.state;
    axios.get(`${ apiUrl }/movie/movieDetail?code=${ code }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          this.setState({ data: data });
        }
      })
      .catch(err => {
        // console.error(err);
      })
  }

  handleCurIdx(e) {
    const { id } = e.target;
    const { imgCurIdx } = this.state;
    const maxLen = this.state.data.stillCuts.length;
    if (id === "prev") {
      this.setState({ imgCurIdx: imgCurIdx ? imgCurIdx - 1 : 0 });
    } else {
      this.setState({ imgCurIdx: imgCurIdx + 1 < maxLen ? imgCurIdx + 1 : imgCurIdx });
    }
  }

  bookMovie(movieCode, movieName) {
    this.props.history.push({
      pathname: '/ticket',
      state: {
        movieCode: movieCode,
        movieName: movieName,
      }
    });
  }

  render() {
    const { info, stillCuts } = this.state.data;
    // console.log(info, stillCuts);
    const { title, title_en, run_time, product_year, nation, open, synopsis, watch_grade,
            thumbnail, show_status, cumulative, book_rate, score_rate } = info || {};
    const watchGrade = mapGrade[watch_grade];

    const textOpen = open ? open.substr(0, 4) + '.' + open.substr(4, 2) + '.' + open.substr(6, 2) : '';

    const imgCurIdx = this.state.imgCurIdx;
    return (
      <div id="movie-detail" className="flex-c">
        <div id="page">영화상세</div>
        <div id="header" className="flex-r">
          { thumbnail && <img id="thumbnail" src={ `${ serverUrl }/${ thumbnail }` } /> }
          <div id="info" className="flex-c">
            <div id="badges" className="flex-r">
              <div id="badge" className={ watchGrade }>{ watch_grade }</div>
              { show_status && <div id="badge">상영중</div> }
            </div>

            <div id="title">{ title + '' + (title_en && ` (${ title_en })`) }</div>

            <div id="statistics" className="flex-r">
              <div id="book" className="flex-r">
                <div id="label">예매율</div>
                <div id="percentage" className="flex-r">
                  { book_rate &&
                    <div id="rate" style={ { width: `${ book_rate }%`} } />
                  }
                  <div id="text">{ book_rate != null ? `${ book_rate }%` : '집계중' }</div>
                </div>
              </div>
              {/* <div id="score">평점 { score_rate ? score_rate : '집계중' }</div> */}
            </div>

            <div id="cumulative" className="flex-r">
              <div id="label">누적 관객 { cumulative != null ? cumulative.toLocaleString() + '명' : '집계중' }</div>
            </div>

            <div id="others" className="flex-r">
              <div id="item">{ nation }</div>
              <div id="item">{ run_time } 분</div>
              <div id="item">{ textOpen } 개봉</div>
            </div>

            <div id="buttons" className="flex-c">
              <div id="book-btn" onClick={ () => this.bookMovie(this.state.code, title) }>예매하기</div>
            </div>
          </div>
        </div>
        <div id="synopsis">
          <div id="label">시놉시스</div>
          <div id="main" dangerouslySetInnerHTML={{ __html: `${ synopsis }` }} />
        </div>
        { stillCuts &&
          <div id="still-cuts" className="flex-c">
            <div id="label">스틸컷 ({ `${ imgCurIdx + 1 } / ${ stillCuts.length }` })</div>
            <div id="imgs" className="flex-r center">
              {
                stillCuts.map((stillCut, idx) => {
                  const { is_external, img } = stillCut;
                  return (
                    <img key={ idx } id="img" src={ is_external ? img : `${ serverUrl }/${ img }` } active={ idx == imgCurIdx ? "true" : "false" }/>
                  );
                })
              }
            </div>
          { imgCurIdx > 0 && <div id="prev" onClick={ this.handleCurIdx }>이전</div> }
          { imgCurIdx + 1 < stillCuts.length && <div id="next" onClick={ this.handleCurIdx }>다음</div> }
          </div>
        }
      </div>
    );
  }
}

const connectedApp = connect(undefined, undefined)(MovieDetail);
export { connectedApp as MovieDetail };