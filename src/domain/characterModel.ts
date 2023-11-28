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
  full_name?: string;
  gender?: string;
  id: number;
  image?: string;
  last_edit: number;
  motivation?: string;
  note?: string;
  occupation?: string;
  physical? : string;
  psychological?: string;
  relations?: Irelations[];
  resume?: string;
  showCharacteristics?: boolean;
  showDate_birth?: boolean;
  showDate_death?: boolean;
  show_notes?: boolean;
  show_full_name?: boolean;
  title: string;
  transformation?: string;
  type: string;
}

export default ICharacter;
