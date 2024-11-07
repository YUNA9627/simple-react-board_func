import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react'
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Write = ({boardId, isModifyMode, handleCancel})=>{
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e)=>{
    setImage(e.target.files[0]);
    console.log(e.target.files[0]);
  }

  const write = (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    Axios.post('http://localhost:8000/insert',formData, {
      header:{"Content-Type":"multipart/form-data"}
    })
    .then((res) => {
      navigate('/'); // 등록 완료 후 홈으로 이동
    })
    .catch((e) => {
      console.log(e);
    });
  }

  const update = (e)=>{
    e.preventDefault();
    Axios.post('http://localhost:8000/update',{
      title:title,
      content:content,
      id:boardId // 수정할 글 번호
    })
    .then((res) => {
      setTitle('')
      setContent('');
      setIsEditMode(false);
      handleCancel();
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }

  const detail = () => {
    // 글번호에 맞는 데이터 조회, 글 결과를 title, content 반영, 수정모드를 true로 변경해야
    Axios.get(`http://localhost:8000/detail?id=${boardId}`)
    .then((res) => {
      // console.log(res);

      const {data} = res;
      setTitle(data[0].BOARD_TITLE);
      setContent(data[0].BOARD_CONTENT);
      setIsEditMode(true);
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  }
  useEffect(()=>{
    if(isModifyMode && boardId){
      detail();
    }
  },[isModifyMode,boardId])

  const handleChangeTitle = (e)=> setTitle(e.target.value);
  const handleChangeContent = (e)=> setContent(e.target.value);

  return (
    <Form>
    <Form.Group className="mb-3" controlId="title">
      <Form.Label>제목</Form.Label>
      <Form.Control type="text" name="title" value={title} placeholder="제목을 입력해주세요." onChange={handleChangeTitle}/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="content">
      <Form.Label>내용</Form.Label>
      <Form.Control as="textarea" name="content" rows={3} value={content} onChange={handleChangeContent}/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="title">
      <Form.Label>이미지</Form.Label>
      <Form.Control type="file" accept="image/*" onChange={handleImageChange}/>
    </Form.Group>
    <div className="d-flex gap-1 justify-content-end">
      <Button variant="dark" size="sm" type="submit" onClick={isEditMode ? update : write}>{isEditMode ? '수정완료' : '입력완료'}</Button>
      <Link to="/" className="btn btn-outline-dark btn-sm">취소</Link>
    </div>
  </Form>
  )
  
}
export default Write;