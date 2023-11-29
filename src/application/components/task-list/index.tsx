import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ITaskList from '../../../domain/ITaskList';
import './task-list.css';

interface EditListsProps {
  list: ITaskList[] | undefined;
  // eslint-disable-next-line no-unused-vars
  onDataSend: (data: ITaskList[] | undefined) => void;
}

function TaskList({
  list, onDataSend,
}: EditListsProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState<ITaskList[]>(list || []);
  const [newItemTitle, SetNewItemTitle] = useState('');
  const isSaveButtonDisabled = newItemTitle.trim() === '';

  const handleCheckboxChange = (item: string) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  const moveItem = (toUp: boolean) => {
    if (!selectedItem) return;
    const currentTask = items?.map((e) => e.task);
    const selectedI = currentTask?.indexOf(selectedItem) ?? -1;
    if (toUp && selectedI > 0 && items) {
      const newI = items;
      const swapIndex = selectedI - 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      setItems(newI);
      onDataSend(newI);
    } else if (!toUp && items && selectedI < items.length - 1) {
      const newI = items;
      const swapIndex = selectedI + 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      setItems(newI);
      onDataSend(newI);
    }
  };

  const addNewItem = () => {
    const newI = { isDone: false, task: newItemTitle };
    items?.push(newI);
    onDataSend(items);
    SetNewItemTitle('');
  };

  const deleteItem = () => {
    if (!selectedItem) return;
    const currentTask = items?.map((e) => e.task);
    const selectedI = currentTask?.indexOf(selectedItem) ?? -1;
    if (items) {
      items.splice(selectedI, 1);
      setItems(items);
      onDataSend(items);
    }
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !isSaveButtonDisabled) {
      addNewItem();
    }
  };

  const markasDone = () => {
    if (!selectedItem) return;
    if (items) {
      const updatedItems = items
        .map((item) => (item.task === selectedItem ? { ...item, isDone: true } : item));
      setItems(updatedItems);
      onDataSend(updatedItems);
      setSelectedItem(null);
    }
  };

  const removeDone = () => {
    if (items) {
      const updatedItems = items.filter((item) => !item.isDone);
      setItems(updatedItems);
      onDataSend(updatedItems);
      setSelectedItem(null);
    }
  };

  return (
    <div className="fullContent">
      <fieldset className="cardFiedset">
        <legend className="legendMedium">Lista de Tarefas</legend>
        <input
          value={newItemTitle}
          onChange={(e) => SetNewItemTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="cardInput"
          type="text"
          name="add-new"
          id="add-new"
          placeholder="Nova tarefa"
        />
        <div className="edit-lists-bar">
          <button
            onClick={addNewItem}
            disabled={isSaveButtonDisabled}
            type="button"
            className="btnSmall"
          >
            <span className="ui-icon ui-icon-plusthick icon-color" />
            Adicionar
          </button>
          <button onClick={() => moveItem(true)} type="button" className="btnSmall">▲</button>
          <button onClick={() => moveItem(false)} type="button" className="btnSmall">▼</button>
          <span className="tooltip-default" data-balloon aria-label="Marcar concluída" data-balloon-pos="down">
            <button onClick={markasDone} type="button" className="btnSmall">🗸</button>
          </span>
          <span className="tooltip-default" data-balloon aria-label="Remover selecionada" data-balloon-pos="down">
            <button onClick={deleteItem} type="button" className="btnSmall">
              <span className="ui-icon ui-icon-trash icon-color" />
            </button>
          </span>
          <span className="tooltip-default" data-balloon aria-label="Remover concluídas" data-balloon-pos="down">
            <button onClick={removeDone} type="button" className="btnSmall">✖</button>
          </span>
        </div>
        <div className="taskListContainer">
          {items && items.length ? (
            items.map((e) => (
              <div key={uuidv4()} className="checkboxCustom">
                <label htmlFor={e.task} className="labelChk label-checkbox">
                  <span className={e.isDone ? 'doneTask' : ''}>{e.task}</span>
                  <span className="done">{e.isDone ? ' 🗸 ' : ''}</span>
                  <input
                    id={e.task}
                    type="checkbox"
                    checked={e.task === selectedItem}
                    onChange={() => handleCheckboxChange(e.task)}
                  />
                  <div className="chk_indicator" />
                </label>
              </div>
            ))
          ) : (
            <h3>Lista vazia</h3>
          )}
        </div>
      </fieldset>
    </div>
  );
}

export default TaskList;
