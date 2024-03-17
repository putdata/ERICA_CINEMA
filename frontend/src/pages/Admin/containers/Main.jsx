import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const MenuItem = (props) => {
  const { link, img, text, disabled } = props;

  if (disabled) {
    return (
      <div id="item" className="flex-c center" disabled>
        <img id="img" src={ img } alt={ text } />
        <span id="text">{ text }</span>
      </div>
    );
  }

  return (
    <Link to={ link }>
      <div id="item" className="flex-c center">
        <img id="img" src={ img } alt={ text } />
        <span id="text">{ text }</span>
        <div id="on"></div>
      </div>
    </Link>
  );
};

class Main extends Component {
  render() {
    return (
      <div id="menu">
        <MenuItem link="/admin/branch" img="/cinema.svg" text="극장 관리"/>
        <MenuItem link="/admin/movie" img="/cinema.svg" text="영화" />
        <MenuItem link="/admin/theater" img="/cinema.svg" text="상영관" />
        {/* <MenuItem link="/admin/employee" img="/cinema.svg" text="직원" disabled={ true } /> */}
        {/* <div id="item">관리자</div> */}
      </div>
    );
  }
}

export { Main };