import fromFunction from 'callbag-from-function';

export default function makeEvents(){
  return {
    clearCompleted: fromFunction(),
    toggleTodo: fromFunction(),
    toggleAll: fromFunction(),
    newNameType: fromFunction(),
    newNameKeyUp: fromFunction(),
    todoDblClick: fromFunction(),
    todoType: fromFunction(),
    todoKeyUp: fromFunction(),
    todoBlur: fromFunction(),
    destroyClick: fromFunction()
  };
}
