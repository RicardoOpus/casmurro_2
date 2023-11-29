import ICardInspectProps from '../../../../domain/IcardInspectProps';
import CharInspect from './cha-inspect';
import NotesInspect from './notes-inspect';
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
