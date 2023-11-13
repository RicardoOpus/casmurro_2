interface ICharacter {
  age?: string;
  category?: string;
  color?: string;
  content?: string;
  date_birth?: string;
  date_death?: string;
  gender?: string;
  id: number;
  image?: string;
  note?: string;
  occupation?: string;
  relations?: unknown[];
  resume?: string;
  title: string;
}

export default ICharacter;
