import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

/*
const submitTest = ()=>{
  // react->server로 요청 보내고, 그 결과를 출력
  Axios.get('http://localhost:8000/')
  .then(function (response) {
    // 성공 핸들링
    alert('등록완료');
    console.log(response);
  })
  .catch(function (error) {
    // 에러 핸들링
    console.log(error);
  });
}
*/

class Board extends Component {
  render() {
    return (
      <tr>
        <td>
        <Form.Check 
          type="checkbox" 
          id={`default-checkbox`}
          value={this.props.id} 
          onChange={(e)=>{
            this.props.onCheckboxChange(e.target.checked, e.target.value)
          }} // 체크 여부가 넘어가야한다. (인수 두 값이 넘어감) -> 체크여부, 체크박스에 설정된 값
        />
        </td>
        <td>{this.props.id}</td>
        <td><Link to={`/view?id=${this.props.id}`} >{this.props.title}</Link></td>
        <td>{this.props.registerId}</td>
        <td>{this.props.date}</td>
      </tr>
    )
  }
}

export default class BoardList extends Component {
  state = {
    BoardList:[],
    CheckList:[]
  }

  onCheckboxChange = (checked, id)=>{ // 매개변수 두 개가 들어감
    const list = [...this.state.CheckList];
    if(checked){
      if(!list.includes(id)){
        list.push(id);
      }
    }else {
      let idx = list.indexOf(id);
      list.splice(idx,1)
    }

    this.setState({
      CheckList:list
    });
    console.log(this.state.CheckList)
  }

  getList = ()=>{
    Axios.get('http://localhost:8000/list')
    .then((res) => {
      // const data = res.data;
      const {data} = res; //destructuring 비구조할당

      this.setState({
        BoardList:data
      });
      this.props.renderComplete(); // App.js에 목록 출력이 완료되었다고 전달
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }
  componentDidMount(){
    this.getList();
  }
  componentDidUpdate(prevProps) {
    // 수정모드이고, boardId가 변경되었다면, 그 글의 내용 조회(detail 함수)실행
    if (this.props.isComplete !== prevProps.isComplete) {
      this.getList();
    }
  }

  handleDelete = ()=>{
    if(this.state.CheckList.length === 0){
      alert('삭제할 게시글을 선택해주세요.');
      return;
    }
    let boardIDList = this.state.CheckList.join(); // 1,2,3
    // let boardIDList = '';
    // this.state.CheckList.forEach(num=>{
    //   boardIDList = boardIDList + `${num},`; // 콤마를 제거해야하는 불편
    //   console.log(boardIDList)
    // })

    Axios.post('http://localhost:8000/delete',{
      boardIDList
    })
    .then((res) => {
      // 목록 조회
      this.getList();
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }

  render() {
    console.log(this.state.BoardList[0])
    return (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>선택</th>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.BoardList.map(
                item=><Board 
                key={item.BOARD_ID} 
                id={item.BOARD_ID}
                title={item.BOARD_TITLE} 
                registerId={item.REGISTER_ID} 
                date={item.REGISTER_DATE} 
                onCheckboxChange={this.onCheckboxChange}
                />
              )
            }
          </tbody>
        </Table>
        <div className="d-flex gap-1 justify-content-end">
          <Link to="/write" className="btn btn-success">글쓰기</Link>
          <Button variant="warning" onClick={()=>{
            this.props.handleModify(this.state.CheckList);
          }}>수정</Button>
          <Button variant="danger" onClick={()=>{this.handleDelete()}}>삭제</Button>
        </div>
      </>
    )
  }
}