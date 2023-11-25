import ICharacter from '../../../../domain/characterModel';
import IWorld from '../../../../domain/worldModel';

interface CardInspectProps {
  card: IWorld | ICharacter | undefined;
}

function CardInspect({ card }: CardInspectProps) {
  return (
    <div>
      <h2>{card?.title}</h2>
    </div>
  );
}

export default CardInspect;
