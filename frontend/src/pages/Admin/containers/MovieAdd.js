import React, { Component, Fragment, useRef } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, Record } from 'immutable';

import axios from 'axios';
import { apiUrl, serverUrl } from 'constant';
import { alertAction } from 'actions/alert.action';

import 'styles/MovieAdd.scss';

const StillCut = Record({
  isExternalImg: false,
  img: ''
});

const Data = Record({
  code: '',
  title: '',
  titleEn: '',
  runTime: '',
  productYear: '',
  nation: '',
  open: '',
  synopsis: '',
  watchGrade: '',
  thumbnail: '',
  showStatus: false,
  stillCuts: List()
});

class MovieAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Data()
    };

    this.handleChange = this.handleChange.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
    this.handleThumbNailChange = this.handleThumbNailChange.bind(this);
    this.handleStillCutChange = this.handleStillCutChange.bind(this);
    this.addStillCut = this.addStillCut.bind(this);
    this.deleteStillCut = this.deleteStillCut.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.getKOFIC = this.getKOFIC.bind(this);
  }

  handleChange(e) {
    const { name, value, checked } = e.target;
    const { data } = this.state;
    // console.log(name, value);
    // console.log(name);

    if (name === 'showStatus') {
      this.setState({
        data: data.set(name, checked)
      });
      return;
    }

    this.setState({
      data: data.set(name, value)
    });
  }

  uploadImg() {
    this.refs.thumbRef.click();
  }

  handleThumbNailChange(e) {
    const { name, files } = e.target;
    const { data } = this.state;
    if (files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      axios.post(`${ apiUrl }/admin/movie/uploadImage`, formData)
        .then(res => {
          // console.log(res);
          this.setState({
            data: data.set(name, res.data.path)
          });
        })
        .catch(err => {
          // console.error(err);
          this.setState({
            data: data.set(name, '')
          });
        })
    }
  }

  handleStillCutChange(e, idx) {
    const { name, value, checked, files } = e.target;
    const { data } = this.state;
    if (files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      axios.post(`${ apiUrl }/admin/movie/uploadImage`, formData)
        .then(res => {
          // console.log(res);
          this.setState({
            data: data.setIn(['stillCuts', idx, name], res.data.path)
          });
        })
        .catch(err => {
          // console.error(err);
          this.setState({
            data: data.setIn(['stillCuts', idx, name], '')
          });
        })
      return;
    }

    if (name === 'isExternalImg') {
      this.setState({
        data: data.setIn(['stillCuts', idx], { isExternalImg: checked, img: '' })
      });
      return;
    }

    this.setState({
      data: data.setIn(['stillCuts', idx, name], value)
    });
  }

  addStillCut() {
    const { data } = this.state;
    this.setState({
      data: data.set('stillCuts', data.stillCuts.push(StillCut()))
    });
  }

  deleteStillCut(idx) {
    const { data } = this.state;
    // console.log(idx);
    this.setState({
      data: data.deleteIn(['stillCuts', idx])
    })
  }

  handleSubmit() {
    let param = this.state.data.toJS();
    param.synopsis = this.synopsisRef.innerHTML;
    axios.post(`${ apiUrl }/admin/movie/add`, param)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.setState({ data: Data() });
          this.props.successAlert('영화 추가 성공');
        } else {
          // console.log(message);
          this.props.errorAlert(message);
        }
      })
      .catch(err => {
        // console.error(err);
      })
  }

  getKOFIC() {
    const code = this.state.data.code;
    if (!code) {
      this.props.errorAlert('영화 코드 입력');
      return;
    }

    axios.get(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=e49cf10a3a6701da65a899b7f789bc89&movieCd=${ code }`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(res => {
        const { movieNm, movieNmEn, showTm, prdtYear, nations, openDt, audits } = res.data.movieInfoResult.movieInfo;
        const nationNm = nations[0].nationNm || '';
        const watchGradeNm = audits[0].watchGradeNm || '';
        let { data } = this.state;
        data = data.merge({
          title: movieNm,
          titleEn: movieNmEn,
          runTime: showTm,
          productYear: prdtYear,
          nation: nationNm,
          open: openDt,
          watchGrade: watchGradeNm
        });
        // data = data.set('title', movieNm)
        //            .set('titleEn', movieNmEn)
        //            .set('runTime', showTm)
        //            .set('productYear', prdtYear)
        //            .set('nation', nationNm)
        //            .set('open', openDt)
        //            .set('watchGrade', watchGradeNm);
        this.setState({ data: data });
      })
      .catch(err => {
        // console.error(err);
      })
  }

  render() {
    const { data } = this.state;
    return (
      <div id="movie-add" className="flex-c">
        <div className="flex-r">
          <input type="number" min="0" name="code" placeholder="영화 고유번호" value={ data.code } onChange={ this.handleChange } autoComplete="off" />
          {/* <div id="get-kofic" onClick={ this.getKOFIC }>KOFIC에서 불러오기</div> */}
        </div>
        <input type="text" name="title" placeholder="영화 제목" value={ data.title } onChange={ this.handleChange } autoComplete="off" />
        <input type="text" name="titleEn" placeholder="영화 영어 제목" value={ data.titleEn } onChange={ this.handleChange } autoComplete="off" />
        <input type="number" min="0" name="runTime" placeholder="영화 런타임" value={ data.runTime } onChange={ this.handleChange } autoComplete="off" />
        <input type="text" name="productYear" placeholder="영화 제작년도" value={ data.productYear } onChange={ this.handleChange } autoComplete="off" />
        <input type="text" name="nation" placeholder="영화 제작국가" value={ data.nation } onChange={ this.handleChange } autoComplete="off" />
        <input type="text" name="open" placeholder="영화 개봉일" value={ data.open } onChange={ this.handleChange } autoComplete="off" />
        <div id="synopsis" ref={ ref => this.synopsisRef = ref } placeholder="영화 줄거리" contentEditable="true" />
        <input type="text" name="watchGrade" placeholder="영화 관람 등급" value={ data.watchGrade } onChange={ this.handleChange } autoComplete="off" />
        <div id="set-thumb" className="flex-c">
          <div>썸네일</div>
          { data.thumbnail && <img src={ `${ serverUrl }/${ data.thumbnail }` } /> }
          <div id="thumb-btn" onClick={ this.uploadImg }>업로드 / 변경</div>
          <input type="file" name="thumbnail" value='' onChange={ this.handleThumbNailChange } ref="thumbRef" accept="image/*" />
        </div>
        <div>
          <input id="status-checkbox" type="checkbox" name="showStatus" checked={ data.showStatus } onChange={ this.handleChange } />
          <label htmlFor="status-checkbox">현재 상영중</label>
        </div>
        <div id="still-cuts">
          <div id="list" className="flex-c">
            {
              data.stillCuts.map((item, idx) => {
                return (
                  <StillCutItem key={ idx } value={ item } idx={ idx }
                    onChange={ this.handleStillCutChange }
                    onDelete={ this.deleteStillCut }
                  />
                );
              })
            }
          </div>
          <div id="add-btn" onClick={ this.addStillCut }>스틸컷 추가</div>
        </div>
        <div id="submit" onClick={ this.handleSubmit }>제출</div>
      </div>
    );
  }
}

class StillCutItem extends Component {
  state = {
    showImg: false
  }

  handleChange = (e) => {
    this.props.onChange(e, this.props.idx);
  }

  deleteItem = () => {
    this.props.onDelete(this.props.idx);
  }

  handleImgView = () => {
    this.setState({ showImg: !this.state.showImg });
  }

  uploadImg = () => {
    this.refs.fileRef.click();
  }

  render() {
    const { value } = this.props;
    // console.log(this.state);
    return(
      <div id="item" className="flex-r">
        <input id="type-check" type="checkbox" name="isExternalImg" checked={ value.isExternalImg } onChange={ this.handleChange } />
        <label>외부 이미지 URL</label>
        { value.isExternalImg ?
          <input type="text" name="img" value={ value.img } onChange={ this.handleChange } placeholder="이미지 URL" autoComplete="off" /> :
          <div id="img-btn" onClick={ this.uploadImg }>스틸컷 이미지 추가</div>
        }
        { value.img &&
          <div id="img-name" onClick={ this.handleImgView }>{ value.img }</div>
        }
        { this.state.showImg &&
          <div id="img-view" className="flex-c center">
              <img id="img" src={ value.isExternalImg ? `${ value.img }` : `${ serverUrl }/${ value.img }` } />
              <div id="close-btn" onClick={ this.handleImgView }>이미지 닫기</div>
          </div>
        }
        <input type="file" name="img" value='' onChange={ this.handleChange } ref="fileRef" accept="image/*" />
        <div id="delete" onClick={ this.deleteItem }>삭제</div>
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

// const connectedApp = connect(undefined, actionCreators)(MovieAdd);
export default connect(undefined, actionCreators)(MovieAdd);