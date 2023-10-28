import { Dispatch, SetStateAction } from 'react';
import './filter-bar.css';

type FilterBarProps = {
  selectedStatus: string;
  selectedGenre: string;
  selectedTitle: string;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
  setSelectedGenre: Dispatch<SetStateAction<string>>;
  setSelectedTitle: Dispatch<SetStateAction<string>>;
  clearAllFilters: () => void;
};

function FilterBar({
  selectedStatus,
  selectedGenre,
  selectedTitle,
  setSelectedStatus,
  setSelectedGenre,
  setSelectedTitle,
  clearAllFilters,
}: FilterBarProps) {
  return (
    <div className="filterBar">
      <input
        type="text"
        value={selectedTitle}
        placeholder="Pesquisar por título..."
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelectedTitle(target.value);
        }}
      />
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">Todos os Status</option>
        <option value="Arquivado">Arquivado</option>
        <option value="Em Andamento">Em Andamento</option>
        <option value="Finalizado">Finalizado</option>
        <option value="Não iniciado">Não iniciado</option>
        <option value="Pausado">Pausado</option>
      </select>
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <option value="">Todos os Gêneros</option>
        <option value="Romance">Romance</option>
        <option value="Conto">Conto</option>
      </select>
      <button type="button" onClick={clearAllFilters}>
        Limpar Filtros
      </button>
    </div>
  );
}

export default FilterBar;
