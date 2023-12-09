import { useEffect, useState } from 'react';

function Dashboard() {
  const [content, setContent] = useState('Começe por aqui');

  const getCPos = () => {
    let caretPos: number | undefined;
    const sel = document.getSelection();
    if (sel) {
      const range = sel.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        caretPos = rect.y;
      }
    }
    return caretPos;
  };

  const dosave = () => {
    console.log('chamou');
    const textArea = document.getElementById('nodeText');
    if (textArea) {
      // Salve o conteúdo de nodeText no estado
      setContent(textArea.innerText);
    }
  };

  useEffect(() => {
    const textArea = document.getElementById('nodeText');
    if (textArea) {
      textArea.addEventListener('input', () => {
        const halfway = textArea.offsetHeight / 2;
        const caret = getCPos();
        if (caret !== undefined) {
          if (caret > halfway) {
            const fix = caret - halfway;
            textArea.scrollTop += fix;
          }
        }
        dosave();
      });
    }
  }, []);

  return (
    <div className="innerContent">
      <div className="card">
        <div
          id="nodeText"
          contentEditable
          style={{
            border: 'solid ', height: '50px', overflow: 'scroll', paddingBottom: '100%',
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
