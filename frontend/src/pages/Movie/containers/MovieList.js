import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import axios from 'axios';
import { Record, List } from 'immutable';
import { apiUrl, serverUrl } from 'constant';

import 'styles/MovieList.scss';

const mapGrade = {
  "청소년관람불가": "adult",
  "15세이상관람가": "fifteen",
  "12세이상관람가": "twelve",
  "전체관람가": "all"
};

class MovieList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "book",
      movieList: []
    }

    this.goDetail = this.goDetail.bind(this);
    this.sortMovie = this.sortMovie.bind(this);
    this.bookMovie = this.bookMovie.bind(this);
  }

  componentWillMount() {
    axios.get(`${ apiUrl }/movie/movieList?type=book`)
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

  goDetail(code) {
    this.props.history.push(`/movie/detail/${ code }`);
  }

  sortMovie(type) {
    if (type === this.state.type) return;

    axios.get(`${ apiUrl }/movie/movieList?type=${ type }`)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          this.setState({ type: type, movieList: data });
        }
      })
      .catch(err => {
        // console.error(err);
      });
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
    const { movieList } = this.state;
    return (
      <div id="movie-list-page" className="flex-c">
        <div id="header" className="flex-r">
          <div id="title">현재 상영작</div>
          <div id="sorting" className="flex-r">
            <div id="type" onClick={ () => this.sortMovie('book') }>예매율 순</div>
            <div id="type" onClick={ () => this.sortMovie('cumulative') }>관람객 순</div>
            {/* <div id="type" onClick={ () => this.sortMovie('score') }>평점 순</div> */}
          </div>
        </div>

        <div id="movies">
          {
            movieList.map((data) => {
              const { code, title, watch_grade, thumbnail, cumulative, book_rate, score_rate } = data;
              const watchGrade = mapGrade[watch_grade];
              return (
                <div id="movie" key={ code } className={ `flex-c ${ watchGrade }` }>
                  <div id="poster">
                    <img id="thumbnail" src={ `${ serverUrl }/${ thumbnail }`} />
                    <div id="watch-grade" className={ watchGrade } />
                  </div>
                  <div id="name">{ title }</div>
                  <div id="cumulative" className="flex-r">
                    <div id="title">누적</div>
                    <div id="value">{ cumulative != null ? cumulative.toLocaleString() : "집계중" }</div>
                  </div>
                  <div id="statistics" className="flex-r">
                    <div id="book-rate" className="flex-r">
                      <div id="title">예매율</div>
                      <div id="value">{ book_rate != null ? `${ book_rate }%` : "집계중" }</div>
                    </div>
                    {/* <div id="score-rate" className="flex-r">
                      <div id="title">평점</div>
                      <div id="value">{ score_rate ? score_rate : "집계중" }</div>
                    </div> */}
                  </div>
                  <div id="buttons" className="flex-c center">
                    <div id="detail" onClick={ () => this.goDetail(code) }>상세보기</div>
                    <div id="book" onClick={ () => this.bookMovie(code, title) }>예매하기</div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

const connectedApp = connect(undefined, undefined)(MovieList);
export { connectedApp as MovieList };
