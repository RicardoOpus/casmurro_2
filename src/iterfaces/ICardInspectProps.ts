import IManuscript from './IManuscript';
import ICharacter from './ICharacter';
import IWorld from './IWorld';

interface ICardInspectProps {
  card: IWorld | ICharacter | IManuscript;
}

export default ICardInspectProps;
