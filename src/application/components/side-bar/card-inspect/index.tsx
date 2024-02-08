import IManuscript from '../../../../interfaces/IManuscript';
import ICardInspectProps from '../../../../interfaces/ICardInspectProps';
import CharInspect from './cha-inspect';
import ChapterInspect from './chapter-inspect';
import NotesInspect from './notes-inspect';
import SceneInspect from './scene-inspect';
import WorldInspect from './world-inspect';

function CardInspect({ card }: ICardInspectProps) {
  const renderContent = (domain: string) => {
    switch (domain) {
      case 'Personagem':
        return <CharInspect card={card} isNewWindow />;
      case 'Mundo':
        return <WorldInspect card={card} isNewWindow />;
      case 'Notas':
        return <NotesInspect card={card} isNewWindow />;
      case 'Capítulo':
        return <ChapterInspect card={card as IManuscript} isNewWindow />;
      case 'Cena':
        return <SceneInspect card={card as IManuscript} isNewWindow />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>{renderContent(card.type)}</div>
    </div>
  );
}

export default CardInspect;
