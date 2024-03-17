import React, { Component, Fragment, useRef } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, Record } from 'immutable';

import axios from 'axios';
import { apiUrl, serverUrl } from 'constant';
import { alertAction } from 'actions/alert.action';

class MovieStatistics extends Component {
  constructor(props) {
    super(props);

    this.bookRate = this.bookRate.bind(this);
    this.cumulative = this.cumulative.bind(this);
  }

  bookRate() {
    axios.get(`${ apiUrl }/admin/movie/bookRate`)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.props.successAlert('예매율 집계 완료');
        } else {
          this.props.errorAlert(message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  cumulative() {
    axios.get(`${ apiUrl }/admin/movie/cumulative`)
      .then(res => {
        const { ok, message } = res.data;
        if (ok) {
          this.props.successAlert('관람객 집계 완료');
        } else {
          this.props.errorAlert(message);
        }
      })
      .catch(err => {
        // console.error(err);
      });
  }

  render() {
    return (
      <div>
        <div id="book-rate" onClick={ this.bookRate }>예매율 집계</div>
        <div id="cumulative" onClick={ this.cumulative }>관람객 집계</div>
      </div>
    )
  }
}

function mapState(state) {
}

const actionCreators = {
  successAlert: alertAction.success,
  errorAlert: alertAction.error
}

// const connectedApp = connect(undefined, actionCreators)(MovieAdd);
export default connect(undefined, actionCreators)(MovieStatistics);