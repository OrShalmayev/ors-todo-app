// REACT
import React from 'react';
// External Packages
import _ from 'underscore';
import {NotificationContainer} from 'react-notifications';

// CSS
import './App.scss';
// REDUX
import {connect} from 'react-redux';
// STORE
import {
  // global variables
  dynamic_actions,
  addTodo, 
  completeTodo, 
  trashTodo, 
  deleteTodo,
  createNotification
} from './store';

// EXTERNAL COMPONENTS
import Todos from './components/Todos/Todos';

// CURRENT COMPONENT
function App(props) {
  // Variables
  const task = React.useRef('');

  // component did mount
  React.useEffect(()=>{
    console.log('props changed', props)
  },[props]);

  const handleAddTodo = () => {
    // get the input value
    const inputValue = task.current.value; 
    // store the value in the store
    // add a todo ony if the value is greater than 1
    if (inputValue.length >= 1) {
      // reset the add task text
      task.current.value = '';
      // add to store the task
      props.addTodo(sanitizeString(inputValue));
    } else {
      // do something if the value is less than 1
      // show a notification
      createNotification('warning')();
    }
  }//END handleAddTodo

  /**
   * Helpers
   */
  const sanitizeString = (string) => {
    return string.trim();
  }



  /**
   * JSX
   */
  return (
    <div className="App">
      <NotificationContainer/>
      <header className="App-header container">
        <h3>To Do</h3>
        {/* ADD TODO */}
        <div className="input-group mb-5">
          {/* Add new Task */}
          <input
          // onChange={(evnt)=>handleChange(evnt)} 
          ref={task} 
          type="text" 
          className="form-control" 
          placeholder="Add new task" 
          />
          <div className="input-group-append">
            <button
            onClick={()=>handleAddTodo()}
            className="btn btn-outline-primary" 
            type="button">
              Add task
            </button>
          </div>
        </div>

        {/* Didnt add a to do yet.. */}
        {
          _.isEmpty(props.todos) 
            && 
          _.isEmpty(props.completed_todos) 
            && 
          _.isEmpty(props.trash) 
            ?
            <h6>Your Tasks empty :)</h6>
            :
            <React.Fragment>
              {/* TODOS */}
              <Todos drilled={({
                title: 'Your Todos',
                props_to_map: 'todos',
                actions: [...dynamic_actions.actions_1]
              })} />
              {/* COMPLETED TODOS */}
              <Todos drilled={({
                title: 'Completed Todos',
                props_to_map: 'completed_todos',
                actions: [...dynamic_actions.actions_2]
              })} />
              {/* TRASHED TODOS */}
              <Todos drilled={({
                title: 'Trashed Todos',
                props_to_map: 'trash',
                actions: [...dynamic_actions.actions_3]
              })} />
            </React.Fragment>
        }{/* END Looping through ttodos */}
      </header>
    </div>
  );
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = {
  addTodo,
  completeTodo,
  trashTodo,
  deleteTodo
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
