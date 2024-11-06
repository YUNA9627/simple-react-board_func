import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { Component } from 'react'
import Axios from "axios";
import { Navigate, Link } from "react-router-dom";

export default class Write extends Component {
  state = { // 초기값 설정
    isModifyMode:false,
    title:'',
    content:'',
    redirect:false // 주소 변경 할지 말지 변경 상태 추가
  }

  write = (e)=>{
    e.preventDefault();
    Axios.post('http://localhost:8000/insert',{
      title:this.state.title,
      content:this.state.content
    })
    .then((res) => {
      this.setState({
        redirect:true
      })
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }

  update = (e)=>{
    e.preventDefault();
    Axios.post('http://localhost:8000/update',{
      title:this.state.title,
      content:this.state.content,
      id:this.props.boardId // 수정할 글 번호
    })
    .then((res) => {
      this.setState({
        title:'',
        content:'',
        isModifyMode:false
      });
      this.props.handleCancel();
      // 글 수정 완료 후, 수정모드 -> false로 변경, 목록 다시 조회, boardId 초기화 (handleCancel에게 속성을 넘겨서 시킬 것)
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }

  detail = () => {
    // 글번호에 맞는 데이터 조회, 글 결과를 title, content 반영, 수정모드를 true로 변경해야
    Axios.get(`http://localhost:8000/detail?id=${this.props.boardId}`)
    .then((res) => {
      // console.log(res);
      const {data} = res; //destructuring 비구조할당
      // console.log(data); // data가 배열
      this.setState({
        title:data[0].BOARD_TITLE,
        content:data[0].BOARD_CONTENT,
        isModifyMode:true
      })
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }
  // this.props.isModifyMode의 값이 변경 되었다면, detail함수를 실행, componentDidUpdate 함수로 실행

  componentDidUpdate(prevProps) {
    // 수정모드이고, boardId가 변경되었다면, 그 글의 내용 조회(detail 함수)실행
    if (this.props.isModifyMode && this.props.boardId !== prevProps.boardId) {
      this.detail();
    }
  }

  componentDidMount() {
    // 수정모드이고, boardId가 변경되었다면, 그 글의 내용 조회(detail 함수)실행
    if (this.props.isModifyMode) {
      this.detail();
    }
  }

  handleChange = (e)=>{
    this.setState({
      [e.target.name]:e.target.value // 계산된 속성
    });
    console.log(this.state)
  }

  render() {
    if(this.state.redirect){
      return <Navigate to="/"/>; // 새로고침 없이 부드럽게
    }
    return (
      <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>제목</Form.Label>
        <Form.Control type="text" name="title" value={this.state.title} placeholder="제목을 입력해주세요." onChange={this.handleChange}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="content">
        <Form.Label>내용</Form.Label>
        <Form.Control as="textarea" name="content" rows={3} value={this.state.content} onChange={this.handleChange}/>
      </Form.Group>
      <div className="d-flex gap-1 justify-content-end">
        <Button variant="dark" size="sm" type="submit" onClick={this.state.isModifyMode ? this.update : this.write}>{this.state.isModifyMode ? '수정완료' : '입력완료'}</Button>
        <Link to="/" className="btn btn-outline-dark btn-sm">취소</Link>
      </div>
    </Form>
    )
  }
}