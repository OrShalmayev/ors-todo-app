import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {NotificationManager} from 'react-notifications';

// Global variables
export const dynamic_actions = {
    all: ['complete', 'edit', 'trash', 'uncomplete', 'delete'],
    actions_1: ['complete', 'edit', 'trash'],
    actions_2: ['uncomplete', 'edit', 'trash'],
    actions_3: ['uncomplete', 'edit', 'delete'],
}

  // Reference: https://www.npmjs.com/package/react-notifications
export const createNotification = (type) => {
    return () => {
    switch (type) {
        case 'info':
        NotificationManager.info('Info message');
        break;
        case 'success':
        NotificationManager.success('Success', 'Task Added');
        break;
        case 'complete':
        NotificationManager.success('Success', 'Task Completed');
        break;
        case 'trash':
        NotificationManager.success('Success', 'Task Trashed');
        break;
        case 'edited':
        NotificationManager.success('Success', 'Task Updated');
        break;
        case 'warning':
        NotificationManager.warning('At least 1 letter is required', 'Warning', 1500);
        break;
        case 'delete':
        NotificationManager.warning('Task Deleted');
        break;
        case 'error':
        NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
        });
        break;
        default:
            NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
            });
        break;
    }//END switch
    };//returned annonymos function
};//END createNotification


// Actions:
const ADD_TODO = 'ADD_TODO';
const COMPLETE_TODO = 'COMPLETE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const UNEDIT_TODO = 'UNEDIT_TODO';
const UPDATE_TODO_ON_CHANGE = 'UPDATE_TODO_ON_CHANGE';
const TRASH_TODO = 'TRASH_TODO';
const DELETE_TODO = 'DELETE_TODO';
const UNCOMPLETE_TODO = 'UNCOMPLETE_TODO';

// Actions Creators:
export const addTodo = (todo)=> {
    createNotification('success')();
    return {
        type: ADD_TODO,
        payload: todo
    }
}

export const completeTodo = (id, state_key_where_todo_is)=> {
    createNotification('complete')();
    return {
        type: COMPLETE_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const editTodo = (id, state_key_where_todo_is)=> {
    return {
        type: EDIT_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const unEditTodo = (id, state_key_where_todo_is)=> {
    createNotification('edited')();
    return {
        type: UNEDIT_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const deleteTodo = (id, state_key_where_todo_is)=> {
    createNotification('delete')();
    return {
        type: DELETE_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const trashTodo = (id, state_key_where_todo_is)=> {
    createNotification('trash')();
    return {
        type: TRASH_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const uncompleteTodo = (id, state_key_where_todo_is)=> {
    return {
        type: UNCOMPLETE_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const updateTodoOnChange = (id, state_key_where_todo_is, description)=> {
    return {
        type: UPDATE_TODO_ON_CHANGE,
        payload: {
            id,
            state_key_where_todo_is,
            description
        }
    }
}

/**
 * single todo Model object:
 * {
 *  id: Number
 *  description: String,
 *  history: Array,
 *  completed: Bolean,
 *  isEditing: Bolean
 * }
 */

 /**
  * Refactored reducer code.. 
  */
 function add_to_another_key_in_state__action(state, action, currentKey, additional_properties = null){
    // refactored action that repeated itself
    if (additional_properties) {
        return {
            ...state,
            [action.payload.state_key_where_todo_is]: [
                ...state[action.payload.state_key_where_todo_is].filter(todo=>todo.id!==action.payload.id)
            ],
            [currentKey]: [
                ...state[currentKey], 
                {
                    ...state[action.payload.state_key_where_todo_is].find(todo=>todo.id===action.payload.id),
                    ...additional_properties
                }
            ],
        }        
    } else {
        return {
            ...state,
            // save in trash the deleted tasks
            [action.payload.state_key_where_todo_is]: [
                ...state[action.payload.state_key_where_todo_is].filter(todo=>todo.id!==action.payload.id)
            ],
            [currentKey]: [
                ...state[currentKey], 
                state[action.payload.state_key_where_todo_is].find(todo=>todo.id===action.payload.id),
            ],
        }        
    }
}

function change_in_current_key_a_todo(state, action, currentKey, additional_properties = null) {
    
    if (additional_properties) {
        return {
            ...state,
            [action.payload.state_key_where_todo_is]: [
                ...state[action.payload.state_key_where_todo_is].filter(todo=>todo.id!==action.payload.id),
                // find the todo where the user is trying to edit
                {
                    ...state[action.payload.state_key_where_todo_is].find(todo=>todo.id===action.payload.id),
                    ...additional_properties
                }
            ]
        }
    } else {
        return {
            ...state,
            [action.payload.state_key_where_todo_is]: [
                ...state[action.payload.state_key_where_todo_is].filter(todo=>todo.id!==action.payload.id),
                // find the todo where the user is trying to edit
                {
                    ...state[action.payload.state_key_where_todo_is].find(todo=>todo.id===action.payload.id),
                }
            ]
        }
    }
} 


/**
 * Initial State
 */
const initalState = {
    todos:[],
    trash: [],
    completed_todos: [],
    loading: false,
    error: null
}

function rootReducer(state = initalState, action){
    switch (action.type) {
        case ADD_TODO:
            console.log('STORE: acion.type===ADD_TODO')
            return {
                ...state,
                todos: [...state.todos, {
                    id: Math.floor(Math.random() * 100),
                    description: action.payload,
                    completed: false,
                    isEditing: false,
                    history: [],
                    createdAt: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
                }],
                error: null
            }

        case COMPLETE_TODO:
            console.log('STORE: acion.type===COMPLETE_TODO')
            return add_to_another_key_in_state__action(state, action, 'completed_todos', {completed: true});
        
        case EDIT_TODO:
            return change_in_current_key_a_todo(state, action, action.payload.state_key_where_todo_is, {isEditing: true})

        case UNEDIT_TODO:
            return change_in_current_key_a_todo(
                state, 
                action, 
                action.payload.state_key_where_todo_is, 
                {isEditing: false}
            )

        case UPDATE_TODO_ON_CHANGE:
            console.log('Store: UPDATE_TODO_ON_CHANGE action:', action)
            return change_in_current_key_a_todo(
                state, 
                action, 
                action.payload.state_key_where_todo_is, 
                {description: action.payload.description}
            )

        case TRASH_TODO:
            console.log('STORE: acion.type===TRASH_TODO')
            console.log('STORE: state_key_where_todo_is', action.payload.state_key_where_todo_is, state[action.payload.state_key_where_todo_is])
            return add_to_another_key_in_state__action(state, action, 'trash');

        case DELETE_TODO:
            console.log('STORE: acion.type===DELETE_TODO')
            return {
                ...state,
                // save in trash the deleted tasks
                trash: [...state.trash, state.todos.find(todo=>todo.id===action.payload.id)],
                [action.payload.state_key_where_todo_is]: [
                    ...state[action.payload.state_key_where_todo_is].filter(todo=>todo.id!==action.payload.id),
                ],
            }

        case UNCOMPLETE_TODO:
            console.log('STORE: acion.type===UNCOMPLETE_TODO')
            console.log('STORE:state[action.payload.state_key_where_todo_is]', state[action.payload.state_key_where_todo_is])
            return {
                ...state,
                // remove the todo from the current key that he is right now
                // add him to the "todos" key
                todos: [
                    ...state.todos,
                    state[action.payload.state_key_where_todo_is].find(todo=>todo.id===action.payload.id)
                ],
                [action.payload.state_key_where_todo_is]: [
                    ...state[action.payload.state_key_where_todo_is].filter(todo=>todo.id!==action.payload.id)
                ],
            }
        default:
            return state;
    }
}

const middleware = [thunk]

export const store = createStore(rootReducer, initalState, composeWithDevTools(applyMiddleware(...middleware)))