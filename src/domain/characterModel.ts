interface ICharacter {
  age?: string;
  category?: string;
  color?: string;
  core_group?: string;
  content?: string;
  date_birth?: string;
  date_death?: string;
  gender?: string;
  id: number;
  image?: string;
  last_edit: number;
  note?: string;
  occupation?: string;
  relations?: unknown[];
  resume?: string;
  title: string;
  type: string;
}

export default ICharacter;
