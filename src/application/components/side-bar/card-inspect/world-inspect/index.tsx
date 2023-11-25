import ICardInspectProps from '../../../../../domain/IcardInspectProps';

function WorldInspect({ card }: ICardInspectProps) {
  return (
    <div>
      <h1>WorldInspect</h1>
      <h1>{card.title}</h1>
    </div>
  );
}

export default WorldInspect;
