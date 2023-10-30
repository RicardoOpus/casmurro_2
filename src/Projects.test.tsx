import 'fake-indexeddb/auto';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import Projects from './application/pages/projects';
import userEvent from '@testing-library/user-event';


test('PROJETOS: Deve haver um botão Novo Projeto', () => {
  render(
    <HashRouter>
      <Projects />
    </HashRouter>,
  );

  const btnNewProject = screen.getByRole('button', { name: /novo projeto/i });
  expect(btnNewProject).toBeInTheDocument();
});

test('PROJETOS: Deve ser possível criar um novo projeto', async () => {
  render(
    <HashRouter>
      <Projects />
    </HashRouter>,
  );

  const btnNewProject = screen.getByRole('button', { name: /novo projeto/i });
  await userEvent.click(btnNewProject)
  const modal = screen.getByTestId('modal-new-project');
  const inputProjectName = screen.queryByRole('input');
})

