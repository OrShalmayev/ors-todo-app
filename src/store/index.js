import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

// Actions:
const ADD_TODO = 'ADD_TODO';
const COMPLETE_TODO = 'COMPLETE_TODO';
const TRASH_TODO = 'TRASH_TODO';
const DELETE_TODO = 'DELETE_TODO';
const UNCOMPLETE_TODO = 'UNCOMPLETE_TODO';

// Actions Creators:
export const addTodo = (todo)=> {
    return {
        type: ADD_TODO,
        payload: todo
    }
}

export const completeTodo = (id, state_key_where_todo_is)=> {
    return {
        type: COMPLETE_TODO,
        payload: {
            id,
            state_key_where_todo_is
        }
    }
}

export const deleteTodo = (id)=> {
    return {
        type: DELETE_TODO,
        payload: {
            id
        }
    }
}

export const trashTodo = (id, state_key_where_todo_is)=> {
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
                    history: [],
                    createdAt: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
                }],
                error: null
            }

        case COMPLETE_TODO:
            console.log('STORE: acion.type===COMPLETE_TODO')
            return add_to_another_key_in_state__action(state, action, 'completed_todos', {completed: true});

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
                todos: [
                    ...state.todos.filter(todo=>todo.id!==action.payload.id),
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