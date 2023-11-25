import ICharacter from './characterModel';
import IWorld from './worldModel';

interface ICardInspectProps {
  card: IWorld | ICharacter;
}

export default ICardInspectProps;
