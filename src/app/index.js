import React from 'react';
import cls from 'classnames';

import connect from './connect';

import merge from 'callbag-merge';

export default function makeApp(state, actions, events){
  const shouldFocusNew = merge(
    actions.initActions, actions.deleteActions, actions.confirmEditActions,
    actions.newTodoActions, actions.cancelEditActions
  );
  
  @connect({
    sources: {state},
    signals: [
      [shouldFocusNew, comp => comp.focusNew()],
      [actions.editActions, comp => comp.focusEdit()]
    ]
  })
  class App extends React.Component {
    constructor(props){
      super(props);
      this.newField = React.createRef();
      this.editField = React.createRef();
    }
    focusNew(){
      this.newField.current && this.newField.current.focus();
    }
    focusEdit(){
      setTimeout(() => this.editField.current.select());
    }
    render(){
      const s = this.props.state;
      if (!s) return '';
      return (
        <div>
          <section className="todoapp">
            <header className="header">
              <h1>todos</h1>
              <input ref={this.newField} onChange={events.newNameType.emitter} onKeyUp={events.newNameKeyUp.emitter} className="new-todo" value={s.newName} placeholder="What needs to be done?"/>
            </header>
            <section className="main">
              {s.todos.length > 0 && (
                <div>
                  <input onChange={events.toggleAll.emitter} id="toggle-all" className="toggle-all" type="checkbox" checked={!s.remaining}/>
                  <label htmlFor="toggle-all">Mark all as complete</label>
                </div>
              )}
              <ul className="todo-list">
                {s.todos.map((t,n) => (s.filter === 'all' || (s.filter === 'completed' && t.done) || (s.filter === 'active' && !t.done)) && (
                  <li onDoubleClick={events.todoDblClick.emitter} key={n} className={cls({completed: t.done, editing: s.editing === n})}>
                    {
                      s.editing !== n ? (
                        <div className="view">
                          <input className="toggle" type="checkbox" checked={t.done} onChange={events.toggleTodo.emitter} />
                          <label>{t.text}</label>
                          <button onClick={events.destroyClick.emitter} className='destroy'/>
                        </div>
                      ) : (
                        <input ref={this.editField} className="edit" value={s.editText} onChange={events.todoType.emitter} onBlur={events.todoBlur.emitter} onKeyUp={events.todoKeyUp.emitter} />
                      )
                    }
                  </li>
                ))}
              </ul>
              {s.todos.length > 0 && (
                <footer className="footer">
                  <span className="todo-count"><strong>{s.remaining}</strong> item{s.remaining !== 1 && 's'} left</span>
                  <ul className="filters">
                    <li>
                      <a className={cls({selected: s.filter === 'all'})} href="#/">All</a>
                    </li>
                    <li>
                      <a className={cls({selected: s.filter === 'active'})} href="#/active">Active</a>
                    </li>
                    <li>
                      <a className={cls({selected: s.filter === 'completed'})} href="#/completed">Completed</a>
                    </li>
                  </ul>
                  <button onClick={events.clearCompleted.emitter} className="clear-completed">Clear completed</button>
                </footer>
              )}
            </section>
          </section>
          <footer className="info">
            <p>Double-click to edit a todo</p>
            <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
            <p>Created by <a href="http://blog.krawaller.se">David Waller</a></p>
            <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
          </footer>
        </div>
      );
    }
  }
  return App;
}


