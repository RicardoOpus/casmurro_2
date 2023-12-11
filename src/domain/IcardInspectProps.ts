import IManuscript from './IManuscript';
import ICharacter from './characterModel';
import IWorld from './worldModel';

interface ICardInspectProps {
  card: IWorld | ICharacter | IManuscript;
}

export default ICardInspectProps;
