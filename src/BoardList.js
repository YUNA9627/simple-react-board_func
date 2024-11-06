import React, { Component, useCallback, useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

function Board({id, title, registerId, date, onCheckboxChange}) {
  return (
    <tr>
      <td>
      <Form.Check 
        type="checkbox" 
        id={`default-checkbox`}
        value={id} 
        onChange={(e)=>{
          onCheckboxChange(e.target.checked, e.target.value)
        }}
      />
      </td>
      <td>{id}</td>
      <td><Link to={`/view/${id}`} >{title}</Link></td>
      <td>{registerId}</td>
      <td>{date}</td>
    </tr>
  )

}

const BoardList = ({isComplete, handleModify}) => {
  const [boardList, setBoardList] = useState([]);
  const [CheckList, setCheckList] = useState([]);

  const onCheckboxChange = (checked, id)=>{
    setCheckList((prevList)=>{ // 밑에 if문이 setCheckList의 인수로 들어감
      if(checked){
        return [...prevList,id]; // includes와 push를 둘 다 해결 [...prevList, 4]->[1,2,3,4] [...prevList, 3]->[1,2,3]
      }else{
        return prevList.filter(item=> item !== id); // [1,2,3] 1 / 1과 1이 같지 않으면 => return 안 됨 1이 아닌 다른 값이 들어가야 출력
      }
    }) // prevList는 CheckList의 기존 값
  }

const getList = useCallback(()=>{
  Axios.get('http://localhost:8000/list')
  .then((res) => {
    // const data = res.data;
    const {data} = res; //destructuring 비구조할당
    setBoardList(data);
  })

  .catch((e) => {
    // 에러 핸들링
    console.log(e);
  });
},[]); // useEffect(()=>{리스트 조회},[getList])와 같은 효과 / 최초 한 번 실행될 수 있는 구조 / []->두번째인자가 추가 된 것

useEffect(()=>{
  getList();
},[getList]) // 최초 한 번 getList 실행, getList 객체가 변경되면 getList 실행

useEffect(()=>{
  if(isComplete){
    getList();
  }
},[isComplete])

const handleDelete = ()=>{
  if(CheckList.length === 0){
    alert('삭제할 게시글을 선택해주세요.');
    return;
  }
  let boardIDList = CheckList.join(); // 1,2,3

  Axios.post('http://localhost:8000/delete',{
    boardIDList
  })
  .then((res) => {
    // 목록 조회
    getList();
  })
  .catch((e) => {
    // 에러 핸들링
    console.log(e);
  });
}

  return(
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
            boardList.map(
              item=><Board 
              key={item.BOARD_ID} 
              id={item.BOARD_ID}
              title={item.BOARD_TITLE} 
              registerId={item.REGISTER_ID} 
              date={item.REGISTER_DATE} 
              onCheckboxChange={onCheckboxChange}
              />
            )
          }
        </tbody>
      </Table>
      <div className="d-flex gap-1 justify-content-end">
        <Link to="/write" className="btn btn-success">글쓰기</Link>
        <Button variant="warning" onClick={()=>{
          handleModify(CheckList);
        }}>수정</Button>
        <Button variant="danger" onClick={()=>{handleDelete()}}>삭제</Button>
      </div>
    </>
  )
}

export default BoardList;