import IManuscript from '../../../../domain/IManuscript';
import ICardInspectProps from '../../../../domain/IcardInspectProps';
import CharInspect from './cha-inspect';
import ChapterInspect from './chapter-inspect';
import NotesInspect from './notes-inspect';
import SceneInspect from './scene-inspect';
import WorldInspect from './world-inspect';

function CardInspect({ card }: ICardInspectProps) {
  const renderContent = (domain: string) => {
    switch (domain) {
      case 'Personagem':
        return <CharInspect card={card} />;
      case 'Mundo':
        return <WorldInspect card={card} />;
      case 'Notas':
        return <NotesInspect card={card} />;
      case 'Capítulo':
        return <ChapterInspect card={card as IManuscript} />;
      case 'Cena':
        return <SceneInspect card={card as IManuscript} />;
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
