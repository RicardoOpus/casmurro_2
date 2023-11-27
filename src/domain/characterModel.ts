interface Irelations {
  charID: number,
  type: string
}

interface ICharacter {
  age?: string;
  category?: string;
  color?: string;
  core_group?: string;
  content?: string;
  conflict?: string;
  date_birth?: string;
  date_death?: string;
  physical? : string;
  gender?: string;
  id: number;
  image?: string;
  last_edit: number;
  motivation?: string;
  note?: string;
  occupation?: string;
  psychological?: string;
  relations?: Irelations[];
  resume?: string;
  showCharacteristics?: boolean;
  showDate_birth?: boolean;
  showDate_death?: boolean;
  title: string;
  transformation?: string;
  type: string;
}

export default ICharacter;
