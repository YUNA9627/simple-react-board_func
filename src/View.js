import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { Component } from 'react'
import Axios from "axios";
import { Link } from "react-router-dom";

export default class View extends Component {
  state = { // 초기값 설정
    title:'',
    content:''
  }

  detail = () => {
    let url = window.location.href;
    let urlParams = url.split('?')[1];
    console.log(urlParams); // id=5
    // let url = '?id=1';

    const searchParams = new URLSearchParams(urlParams); // {id:5} 파라미터가 여러개 있을 때 용이
    let id = searchParams.get('id') // 5

    // 글번호에 맞는 데이터 조회, 글 결과를 title, content 반영, 수정모드를 true로 변경해야
    Axios.get(`http://localhost:8000/detail?id=${id}`)
    .then((res) => {
      // console.log(res);
      const {data} = res; //destructuring 비구조할당
      // console.log(data); // data가 배열
      this.setState({
        title:data[0].BOARD_TITLE,
        content:data[0].BOARD_CONTENT
      })
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }
  // this.props.isModifyMode의 값이 변경 되었다면, detail함수를 실행, componentDidUpdate 함수로 실행

  componentDidMount() {
    this.detail();
  }

  render() {
    return (
      <div>
        <h2>
        제목: {this.state.title}
        </h2>
        <br/>
        <p>본문: </p>
        {this.state.content}
        <hr/>
        <Link to="/" className="btn btn-outline-success">목록</Link>
      </div>
    )
  }
}