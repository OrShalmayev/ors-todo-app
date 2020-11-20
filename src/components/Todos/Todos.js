import React from 'react';
import styles from './Todos.module.scss';
import _ from 'underscore';

// REDUX
import {connect} from 'react-redux';
// STORE
import {
  addTodo, 
  completeTodo, 
  trashTodo, 
  deleteTodo,
  uncompleteTodo
} from '../../store';

const Todos = (props) => {

  /**
  * Handlers
  */
  const handleCompleteTodo = (id, state_key_where_todo_is) => {
    props.completeTodo(id, state_key_where_todo_is);
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
              {/* <input type="text" className="form-control" value="todo 1s" placeholder="" /> */}
              <div className="form-control text-left">{item.description}</div>
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

const mapStateToProps = (state) => (state)
const mapDispatchToProps = {
  addTodo,
  completeTodo,
  trashTodo,
  deleteTodo,
  uncompleteTodo
}

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
