import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './edit-lists.css';

interface EditListsProps {
  list: string[];
  projSettingsI: string;
  listTitle: string;
  // eslint-disable-next-line no-unused-vars
  onDataSend: (data: string[], table: string) => void;
}

const denyList = ['Local'];

function EditLists({
  list, projSettingsI, listTitle, onDataSend,
}: EditListsProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>(list);
  const [newItemTitle, SetNewItemTitle] = useState('');
  const isSaveButtonDisabled = newItemTitle.trim() === '';

  const handleCheckboxChange = (item: string) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  const moveItem = (toUp: boolean) => {
    if (!selectedItem) return;
    const selectedI = items.indexOf(selectedItem);
    if (toUp && selectedI > 0) {
      const newI = [...items];
      const swapIndex = selectedI - 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      setItems(newI);
      onDataSend(newI, projSettingsI);
    } else if (!toUp && selectedI < items.length - 1) {
      const newI = [...items];
      const swapIndex = selectedI + 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      setItems(newI);
      onDataSend(newI, projSettingsI);
    }
  };

  const addNewItem = () => {
    const newI = [...items];
    newI.unshift(newItemTitle);
    setItems(newI);
    onDataSend(newI, projSettingsI);
    SetNewItemTitle('');
  };

  const deleteItem = () => {
    if (!selectedItem) return;
    const selectedI = items.indexOf(selectedItem);
    const newI = [...items];
    newI.splice(selectedI, 1);
    setItems(newI);
    onDataSend(newI, projSettingsI);
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !isSaveButtonDisabled) {
      addNewItem();
    }
  };

  return (
    <div className="edit-lists">
      <h2>{listTitle}</h2>
      <input
        value={newItemTitle}
        onChange={(e) => SetNewItemTitle(e.target.value)}
        onKeyDown={handleKeyPress}
        className="cardInput"
        type="text"
        name="add-new"
        id="add-new"
        placeholder="Adicione um novo item à lista"
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
        <button onClick={() => deleteItem()} type="button" className="btnSmall">
          <span className="ui-icon ui-icon-trash icon-color" />
          {' '}
          Excluir
        </button>
      </div>
      <div className="edit-lists-items">
        {items && items.length ? (
          items.map((e) => (
            <div key={uuidv4()} className="checkboxCustom">
              {denyList.includes(e) ? (
                <label htmlFor={e} className="labelChk label-checkbox disabled">
                  {e}
                  {' '}
                  <span style={{ fontSize: 'small' }}>obrigatório</span>
                  <div className="chk_indicator" />
                </label>
              ) : (
                <label htmlFor={e} className="labelChk label-checkbox">
                  {e}
                  <input
                    id={e}
                    type="checkbox"
                    checked={e === selectedItem}
                    onChange={() => handleCheckboxChange(e)}
                  />
                  <div className="chk_indicator" />
                </label>
              )}
            </div>
          ))
        ) : (
          <h3>Lista vazia</h3>
        )}
      </div>
    </div>
  );
}

export default EditLists;
