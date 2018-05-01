import fromEvent from 'callbag-from-event';
import pipe from 'callbag-pipe';
import map from 'callbag-map';
import mapTo from 'callbag-map-to';
import filter from 'callbag-filter';
import merge from 'callbag-merge';
import mergeWith from 'callbag-merge-with';
import share from 'callbag-share';

const nOfLi = node => {
  const li = node.closest('li');
  return Array.from(li.parentElement.children).indexOf(li);
};

export default function makeActions(events, window){

  const loadEvents = fromEvent(window, 'load');

  const initActions = pipe(
    loadEvents,
    mapTo(({type: 'INIT'}))
  );

  const hashActions = pipe(
    merge(loadEvents, fromEvent(window, 'hashchange')),
    map(e => ({type: 'HASH', value: e.target.location.hash.replace(/^#\//,'')}))
  );

  const clearCompletedActions = pipe(
    events.clearCompleted.source,
    mapTo({type: 'CLEARCOMPLETED'})
  );

  const toggleTodoActions = pipe(
    events.toggleTodo.source,
    map(e => ({type: 'TOGGLETODO', idx: nOfLi(e.target)})),
  );
  
  const toggleAllActions = pipe(
    events.toggleAll.source,
    mapTo({type: 'TOGGLEALL'})
  );

  const newNameActions = pipe(
    events.newNameType.source,
    map(e => e.target.value),
    map(v => ({type: 'NEWNAME', value: v}))
  );

  const editNameActions = pipe(
    events.todoType.source,
    map(e => ({type: 'CHANGEEDITNAME', value: e.target.value}))
  );

  const editActions = pipe(
    events.todoDblClick.source,
    filter(e => !e.target.matches('[type=checkbox]')),
    map(e => ({type: 'EDIT', idx: nOfLi(e.target)})),
  );

  const cancelEditActions = pipe(
    events.todoBlur.source,
    mergeWith(pipe(
      events.todoKeyUp.source,
      filter(e => e.key === 'Escape')
    )),
    mapTo({type: 'CANCELEDIT'})
  );

  const confirmEditActions = pipe(
    events.todoKeyUp.source,
    filter(e => e.key === 'Enter'),
    map(e => ({type: 'CONFIRMEDIT', idx: nOfLi(e.target)}))
  );

  const newTodoActions = pipe(
    events.newNameKeyUp.source,
    filter(e => e.key === 'Enter'),
    mapTo({type: 'NEWTODO'}),
  );

  const deleteActions = pipe(
    events.destroyClick.source,
    map(e => ({type: 'DELETETODO', idx: nOfLi(e.target)})),
    share
  );

  const allActions = merge(
    initActions, hashActions, toggleTodoActions, toggleAllActions, clearCompletedActions,
    newNameActions, editActions, editNameActions, cancelEditActions, confirmEditActions,
    newTodoActions, deleteActions
  );

  return {
    initActions, hashActions, toggleTodoActions, toggleAllActions, clearCompletedActions,
    newNameActions, editActions, editNameActions, cancelEditActions, confirmEditActions,
    newTodoActions, deleteActions,
    allActions
  };
}
