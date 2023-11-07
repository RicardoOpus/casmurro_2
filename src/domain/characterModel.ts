interface Character {
  title: string;
  age?: string;
  category?: string;
  image?: string;
  content?: string;
  date_birth?: string;
  date_death?: string;
  gender?: string;
  occupation?: string;
  color?: string;
  relations?: unknown[];
  id: number;
}

export default Character;
