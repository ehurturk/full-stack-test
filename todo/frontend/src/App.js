import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const Checkbox = ({ label, value, onClick, onDelete }) => {
  return (
    <label style={ value ? {textDecoration: 'line-through'}: {}}>
      <input type="checkbox" checked={value} onChange={onClick} />
      {label}
      <button onClick={onDelete}>🗑️</button>
    </label>
  );
};

class App extends React.Component {
  
  state = {
    details: [],
    title: "",
    description: "",
  }

  componentDidMount() {

      let data ;

      axios.get('http://localhost:8000/api/')
      .then(res => {
        data = res.data;
          this.setState({
              details : data    
          });
      })
      .catch(err => {console.log(err);})
  }
  
  handleOnChange(detail) {
    axios.put(`http://localhost:8000/api/${detail.pk}`, {
      title: detail.title,
      description: detail.description,
      completed: !detail.completed
    }).then((res) => {
      detail.completed = res.data.completed;
      const index = this.state.details.indexOf(detail);
      this.setState(state=>{
        const details = this.state.details.map(detail_ => {
          if (detail_ === detail)
            return detail;
          return detail_;
        });
        return {
          details,
        };
      });
    }).catch(err => console.log(err));
  }
  
  handleOnAdd(e) {
    e.preventDefault();
    axios.post("http://localhost:8000/api/", {
      title: this.state.title,
      description: this.state.description,
      completed: false,
    }).then((res) => {
      
      this.setState(state=>{
        const details = [...state.details, {title: state.title, description: state.description, completed: false}]
        const title = '';
        const description = '';

        return {
          details,
          title,
          description,
        };
      });
    })
    .catch(err=>console.log(err));
  }

  handleOnDelete(detail) {
    axios.delete(`http://localhost:8000/api/${detail.pk}`, {}).then((res) => {
      this.setState({details: this.state.details.filter(detail_ => { 
        return detail_ !== detail; 
    })});
    }).catch(err => console.log(err));
  }

  render() {
    return(
      <div>
            {this.state.details.map((detail, id) =>  (
            <div key={id}>
            <div >
                  <div >
                    <Checkbox label={`${detail.title}: ${detail.description}`} value={detail.completed} onClick={() => this.handleOnChange(detail)} onDelete={()=>this.handleOnDelete(detail)} />
                  </div>
            </div>
            </div>
            )
        )}
        <br></br>
        <form onSubmit={(e)=>this.handleOnAdd(e)}>
          <label>
            Title:
            <input type="text" name="title" onChange={(e)=>this.setState({title: e.target.value})} />
          </label>
          <label>
            Description:
            <input type="text" name="description" onChange={(e)=>this.setState({description: e.target.value})}/>
          </label>
          <input type="submit" value="Add a TODO item" />
        </form>
      </div>
      );
  }
}

export default App;
