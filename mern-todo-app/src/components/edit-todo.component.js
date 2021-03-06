import React, {Component} from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';



export default class EditTodo extends Component {

  constructor(props) {
      super(props);

      this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
      this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
      this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
      this.onChangeTodoCompleted = this.onChangeTodoCompleted.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.deleteTodo = this.deleteTodo.bind(this);


      this.state = {
        todo_description: '',
        todo_responsible: '',
        todo_priority: '',
        todo_completed: false
      }
  }

  componentDidMount(){
    axios.get('http://localhost:4000/todos/'+this.props.match.params.id)
    .then(res => {
      this.setState({
        todo_description: res.data.todo_description,
        todo_responsible: res.data.todo_responsible,
        todo_priority: res.data.todo_priority,
        todo_completed: res.data.todo_completed
      })
    })
    .catch(function(error){
      console.log(error);
    })
  }

  onChangeTodoDescription(e){
    this.setState({
      todo_description: e.target.value
    });
  }

  onChangeTodoResponsible(e){
    this.setState({
      todo_responsible: e.target.value
    });
  }
  onChangeTodoPriority(e){
    this.setState({
      todo_priority: e.target.value
    });
  }
  onChangeTodoCompleted(e){
    this.setState({
      todo_completed: !this.state.todo_completed
    });
  }

  onSubmit(e){
    e.preventDefault();
    const obj = {
      todo_description: this.state.todo_description,
      todo_responsible: this.state.todo_responsible,
      todo_priority: this.state.todo_priority,
      todo_completed: this.state.todo_completed
    }
    axios.post('http://localhost:4000/todos/update/'+this.props.match.params.id, obj)
      .then(res => console.log(res.data));

    this.props.history.push('/')
  }

  deleteTodo(e){
    console.log("delte todo");
    axios.delete('http://localhost:4000/todos/delete/'+this.props.match.params.id)
      .then(res => console.log("todo deleted:"));

    this.props.history.push('/')
  }



  submitModal = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui modal-box'>
            <h3>Are you sure you want to delete this Todo?</h3>
            <p>This cannot be undone.</p>
            <div className='modal-footer'>
            <button onClick={onClose} className="btn btn-secondary">No</button>
            <button onClick={() => {
                this.deleteTodo();
                onClose()
            }} className="btn btn-primary">Yes, Delete it!</button>
            </div>
          </div>
        )
      }
    })
 };



  render(){
    return (
      <div>
        <h3>Update Todo</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Description:</label>
            <input type="text"
                  className="form-control"
                  value={this.state.todo_description}
                  onChange={this.onChangeTodoDescription} />
          </div>
          <div className="form-group">
            <label>Responsible:</label>
            <input type="text"
                  className="form-control"
                  value={this.state.todo_responsible}
                  onChange={this.onChangeTodoResponsible} />
          </div>

          <div className="form-group">
            <div className='form-check form-check-inline'>
              <input className='form-check-input'
                      type="radio"
                      name="priorityOptions"
                      id="priorityLow"
                      value="Low"
                      checked={this.state.todo_priority==='Low'}
                      onChange={this.onChangeTodoPriority}
                      />
                <label className="form-check-label">Low</label>
            </div>
            <div className='form-check form-check-inline'>
              <input className='form-check-input'
                      type="radio"
                      name="priorityOptions"
                      id="priorityMedium"
                      value="Medium"
                      checked={this.state.todo_priority==='Medium'}
                      onChange={this.onChangeTodoPriority}
                      />
                <label className="form-check-label">Medium</label>
            </div>
            <div className='form-check form-check-inline'>
              <input className='form-check-input'
                      type="radio"
                      name="priorityOptions"
                      id="priorityHigh"
                      value="High"
                      checked={this.state.todo_priority==='High'}
                      onChange={this.onChangeTodoPriority}
                      />
                <label className="form-check-label">High</label>
            </div>
            <div className="form-check">
                <input type="checkbox"
                className="form-check-input"
                id="completedCheckbox"
                onChange={this.onChangeTodoCompleted}
                checked={this.state.todo_completed}
                value={this.state.todo_completed}
                />
                <label className="form-check-label" htmlFor="completedCheckbox">
                  Completed
                </label>
            </div>
            <br />
            <div className="form-group">
            <input type="submit" value="Update Todo" className="btn btn-primary" />

            </div>
          </div>
        </form>

        <div>
        <button onClick={this.submitModal} className="btn btn-primary">Delete this Todo</button>
      </div>

      </div>
    )
  }
}
