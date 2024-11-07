import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react'
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const View = ()=>{
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)

   useEffect(()=>{
    Axios.get(`http://localhost:8000/detail?id=${id}`)
    .then((res) => {
      const {data} = res;
      console.log(data)
      setBoard({
        title:data[0].BOARD_TITLE,
        content:data[0].BOARD_CONTENT,
        image:data[0].IMAGE_PATH
      });
    })

    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });

   },[id])

   if(!board) return <div>로딩중...</div>;

  return(
    <div>
      <h2>제목: {board.title}</h2>
      <br/>
      <p>본문: {board.content}</p>
      <img src={`http://localhost:8000/${board.image}`} style={{width:'380px', height:'240px', objectFit:'cover'}}/>
      <hr/>
      <Button variant="btn btn-outline-success" onClick={()=>{navigate(-1)}} >목록</Button>
    </div>
  )
}

export default View;