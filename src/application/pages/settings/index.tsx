import { SetStateAction, useState } from 'react';

function Settings() {
  const [textValue, setTextValue] = useState('Exemplo de texto digitado por você. Nada aqui será salvo...');
  const adjustTextSize = (increaseStep: number, increase: boolean) => {
    const root = document.documentElement;
    const currentTextSize = getComputedStyle(root).getPropertyValue('--user-text-size');
    const currentSizeInPixels = parseInt(currentTextSize, 10);
    let newSizeInPixels;
    if (increase) {
      newSizeInPixels = currentSizeInPixels + increaseStep;
    } else {
      newSizeInPixels = currentSizeInPixels - increaseStep;
    }
    root.style.setProperty('--user-text-size', `${newSizeInPixels}px`);
    localStorage.setItem('contenSize', `${newSizeInPixels}px`);
  };

  const handleTextChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTextValue(event.target.value);
  };

  return (
    <div className="innerContent">
      <div className="card">
        <h1>Configurações</h1>
        <div className="divider div-transparent" />
        <h2>Customizar campos de texto livre</h2>
        <button onClick={() => adjustTextSize(2, true)} className="btnSmall" type="button">+ A</button>
        <button onClick={() => adjustTextSize(2, false)} className="btnSmall" type="button">- A</button>
        <div className="fullContent">
          <textarea
            style={{ height: '100%' }}
            className="cardInputFull"
            placeholder="Campo livre..."
            value={textValue}
            onChange={handleTextChange}
          />
        </div>
        <h2>Listas predefinidas</h2>
        <h3>Categorias de personagnes</h3>
        <h3>Gênero de personagnes</h3>
      </div>
    </div>
  );
}

export default Settings;
