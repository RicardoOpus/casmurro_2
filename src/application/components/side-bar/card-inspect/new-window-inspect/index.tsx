import NewWindow from 'react-new-window';
import ICardInspectProps from '../../../../../interfaces/ICardInspectProps';
import CharInspect from '../cha-inspect';
import SceneInspect from '../scene-inspect';
import IManuscript from '../../../../../interfaces/IManuscript';
import WorldInspect from '../world-inspect';
import NotesInspect from '../notes-inspect';
import ChapterInspect from '../chapter-inspect';

function NewWindowInspect({ card }: ICardInspectProps) {
  const renderContent = (domain: string) => {
    switch (domain) {
      case 'Personagem':
        return <CharInspect card={card} isNewWindow={false} />;
      case 'Mundo':
        return <WorldInspect card={card} isNewWindow={false} />;
      case 'Notas':
        return <NotesInspect card={card} isNewWindow={false} />;
      case 'Capítulo':
        return <ChapterInspect card={card as IManuscript} isNewWindow={false} />;
      case 'Cena':
        return <SceneInspect card={card as IManuscript} isNewWindow={false} />;
      default:
        return null;
    }
  };

  return (
    <NewWindow
      center="parent"
      title={card.title}
      closeOnUnmount={false}
      onOpen={(w) => {
        w.focus();
        const storedMode = localStorage.getItem('uiMode');
        if (storedMode === 'light') {
          w.document.documentElement.classList.add('light-mode');
        }
      }}
    >
      <div style={{ padding: '1em' }}>
        <div>{renderContent(card.type)}</div>
      </div>
    </NewWindow>
  );
}

export default NewWindowInspect;
