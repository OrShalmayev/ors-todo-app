import React from 'react';
import styles from './Todos.module.scss';
import _ from 'underscore';

// REDUX
import {connect} from 'react-redux';
// STORE
import {
  // Global variables
  addTodo, 
  completeTodo, 
  editTodo,
  unEditTodo,
  trashTodo, 
  deleteTodo,
  uncompleteTodo,
  updateTodoOnChange,
} from '../../store';

const Todos = (props) => {

  /**
  * Handlers
  */

  React.useEffect(()=>{
    // Component did mount
  }, []);

  const editInput = React.useRef('');

  const handleCompleteTodo = (id, state_key_where_todo_is) => {
    props.completeTodo(id, state_key_where_todo_is);
  }//END handleCompleteTodo

  const handleEditTodo = (id, state_key_where_todo_is) => {
    props.editTodo(id, state_key_where_todo_is);
  }//END handleCompleteTodo

  const handleUnEditTodo = (id, state_key_where_todo_is) => {
    props.unEditTodo(id, state_key_where_todo_is);
  }//END handleCompleteTodo
  
  const handleTrashTodo = (id, state_key_where_todo_is) => {
    props.trashTodo(id, state_key_where_todo_is);
  }//END handleTrashTodo

  const handleDeleteTodo = (id, state_key_where_todo_is) => {
    props.deleteTodo(id, state_key_where_todo_is);
  }

  const handleUncompleteTodo = (id, state_key_where_todo_is) => {
    props.uncompleteTodo(id, state_key_where_todo_is);
  }


  const handleDynamicProps = () => {
    return eval(`props.${props.drilled.props_to_map}`); 
  }

  const handleDynamicHandlers = (action) => {
    return eval(`handle${upperFirstLetter(action)}Todo`); 
  }

  const handleOnBlurInput = (evnt, todo_id, state_key_where_todo_is) => {
    // if the value is less then the required then stay focus on this input 
    let editedInputVal = editInput.current.value;
    if(editInput.current.value.length < 1){
      // show error notification
      // stay focus on this input / maybe put the value to the revious value
    } else {
    // if the value is passing the required validations then save the edited todo in the store
      props.unEditTodo(todo_id, state_key_where_todo_is);
    }
  }

  const handleOnTodoChange = (val, todo_id, state_key_where_todo_is) => {
    props.updateTodoOnChange(todo_id, state_key_where_todo_is, val);
  }
  /**
   * Helpers
   */
  const upperFirstLetter = (str)=> str.charAt(0).toUpperCase() + str.slice(1);


  /**
   * JSX
   */
  return (
    <React.Fragment>
      {
        _.isEmpty(handleDynamicProps())
        ?
        <h6>{props.drilled.title + ' Empty'}</h6>
        :
        <React.Fragment>
          <h6>{props.drilled.title}</h6>
          {handleDynamicProps().map((item)=>(
            <div className="input-group mb-3" key={item.id}>
              { item.isEditing ? 
                <input 
                  autoFocus 
                  onBlur={(evnt)=>handleOnBlurInput(evnt, item.id, props.drilled.props_to_map)}
                  onChange={e => handleOnTodoChange(e.target.value, item.id, props.drilled.props_to_map)}
                  ref={editInput} 
                  type="text" 
                  className="form-control" 
                  value={item.description} 
                  placeholder={item.description} />
              :
                <div className="form-control text-left">{item.description}</div>
              }
              <div className="input-group-append">
                {props.drilled.actions.map(action=>(
                  <button 
                  // complete the task by the to do id
                  onClick={()=>eval(handleDynamicHandlers(action))(item.id, props.drilled.props_to_map)}
                  className="btn btn-outline-success" 
                  type="button">
                    {upperFirstLetter(action)}
                  </button>
                ))}{/* END Dynamic actions */}
              </div>
            </div>
          ))}{/* END Dynamic Props */}
        </React.Fragment>
      }
    </React.Fragment>
  );
}

const mapStateToProps = (state) => (state);

const mapDispatchToProps = {
  addTodo,
  completeTodo,
  editTodo,
  unEditTodo,
  updateTodoOnChange,
  trashTodo,
  deleteTodo,
  uncompleteTodo
}

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
