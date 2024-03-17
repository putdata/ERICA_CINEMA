import React, { Component, Fragment, useRef } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, Record } from 'immutable';


import axios from 'axios';
import { apiUrl, serverUrl }from 'constant';
import { alertAction } from 'actions/alert.action';

import 'styles/BranchAdd.scss';

const GuideMap = Record({
  floor: '',
  comment: '',
  img: null
});

const Data = Record({
  code: '',
  location: '',
  name: '',
  address: '',
  phone: '',
  guideMaps: List()
});

class BranchAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Data()
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGuideMapChange = this.handleGuideMapChange.bind(this);
    this.addGuideMap = this.addGuideMap.bind(this);
    this.deleteGuideMap = this.deleteGuideMap.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { data } = this.state;
    // console.log(name);
    this.setState({
      data: data.set(name, value)
    });
  }

  handleGuideMapChange(e, idx) {
    const { name, value, files } = e.target;
    const { data } = this.state;
    if (files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      axios.post(`${ apiUrl }/admin/branch/uploadImage`, formData)
        .then(res => {
          // console.log(res);
          this.setState({
            data: data.setIn(['guideMaps', idx, name], res.data.path)
          });
        })
        .catch(err => {
          // console.error(err);
          this.setState({
            data: data.setIn(['guideMaps', idx, name], '')
          });
        })
      return;
    }

    this.setState({
      data: data.setIn(['guideMaps', idx, name], value)
    });
  }

  addGuideMap() {
    const { data } = this.state;
    this.setState({
      data: data.set('guideMaps', data.guideMaps.push(GuideMap()))
    });
  }

  deleteGuideMap(idx) {
    const { data } = this.state;
    // console.log(idx);
    this.setState({
      data: data.deleteIn(['guideMaps', idx])
    })
  }

  handleSubmit() {
    const param = this.state.data.toJS();
    axios.post(`${ apiUrl }/admin/branch/add`, param)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.setState({ data: Data() });
          this.props.successAlert('극장 추가 성공');
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
    const { data } = this.state;
    return (
      <div id="branch-add" className="flex-c">
        <input type="number" min="0" name="code" placeholder="극장 고유번호" value={ data.code } onChange={ this.handleChange } autoComplete="off" />
        <select id="select" name="location" value={ data.location } onChange={ this.handleChange }>
          <option value="">지역 선택</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
          <option value="강원">강원</option>
          <option value="대전/충청">대전/충청</option>
          <option value="대구">대구</option>
          <option value="부산/울산">부산/울산</option>
          <option value="경상">경상</option>
          <option value="광주/전라/제주">광주/전라/제주</option>
        </select>
        <input type="text" name="name" placeholder="극장 이름" value={ data.name } onChange={ this.handleChange } autoComplete="off" />
        <input type="text" name="address" placeholder="주소" value={ data.address } onChange={ this.handleChange } autoComplete="off" />
        <input type="text" name="phone" placeholder="전화번호" value={ data.phone } onChange={ this.handleChange } autoComplete="off" />
        <div id="guide-map">
          <div id="list" className="flex-c">
            {
              data.guideMaps.map((item, idx) => {
                return (
                  <GuideMapItem key={ idx } value={ item } idx={ idx }
                    onChange={ this.handleGuideMapChange }
                    onDelete={ this.deleteGuideMap }
                  />
                );
              })
            }
          </div>
          <div id="add-btn" onClick={ this.addGuideMap }>층 추가</div>
        </div>
        <div id="submit" onClick={ this.handleSubmit }>제출</div>
      </div>
    );
  }
}

class GuideMapItem extends Component {
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
        <input type="number" name="floor" value={ value.floor } onChange={ this.handleChange } placeholder="층" autoComplete="off" />
        <input type="text" name="comment" value={ value.comment } onChange={ this.handleChange } placeholder="세부사항" autoComplete="off" />
        <div id="img-btn" onClick={ this.uploadImg }>이미지 추가</div>
        { value.img &&
          <div id="img-name" onClick={ this.handleImgView }>{ value.img }</div>
        }
        { this.state.showImg &&
          <div id="img-view" className="flex-c center">
              <img id="img" src={ `${ serverUrl }/${ value.img }` } />
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

// const connectedApp = connect(undefined, actionCreators)(BranchAdd);
export default connect(undefined, actionCreators)(BranchAdd);