import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BoardList from './BoardList';
import Write from './Write';
import View from './View';
import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default class App extends Component {
  state = {
    isModifyMode:false, // 수정모드 여부 설정
    isComplete:true, // 렌더완료(목록 출력 완료)
    boardId:0, // 수정, 삭제할 글 번호
    redirect_to_write:false,
    redirect_to_home:false
  }

  handleModify = (CheckList)=>{
    if(CheckList.length === 0){
      alert('수정할 게시글을 선택하세요.')
    }else if(CheckList.length > 1){
      alert('하나의 게시글만 선택하세요.')
    }
    this.setState({
      isModifyMode:CheckList.length === 1,
      boardId:CheckList[0] || 0,
      redirect_to_write:true
    });
  }

  handleCancel = ()=>{
    this.setState({
      isModifyMode:false,
      isComplete:false,
      boardId:0,
      redirect_to_home:true
    })
  }

  componentDidUpdate(){
    // 리다이렉트 후 redirect 상태 초기화
    if(this.state.redirect_to_write){
      this.setState({redirect_to_write:false});
    }
    if(this.state.redirect_to_home){
      this.setState({redirect_to_home:false});
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <h1 className="mb-4 mt-1">React Board</h1>
          {this.state.redirect_to_write && <Navigate to="/write" />}
          {this.state.redirect_to_home && <Navigate to="/" />}
          <Routes>
            <Route path="/" element={<BoardList isComplete={this.state.isComplete} handleModify={this.handleModify}/>}/>
            <Route path="/write" element={<Write 
              isModifyMode={this.state.isModifyMode} 
              boardId={this.state.boardId} 
              handleCancel={this.handleCancel} 
            />}
            />
            <Route path="/view" element={<View/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    )
  }
}