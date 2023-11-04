/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer');

describe('PROJETOS', () => {
  let page;
  const title = 'Meu Primeiro Projeto';

  beforeAll(async () => {
    global.browser = await puppeteer.launch({
      headless: 'new',
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await global.browser.close();
  });

  it('Deve criar um novo projeto', async () => {
    await page.goto('http://127.0.0.1:5501/dist/');
    await page.waitForTimeout(2000);
    const newProjectButton = await page.$('.btnNewProject');
    expect(newProjectButton).toBeTruthy();
    await newProjectButton.click();
    const input = await page.$('.cardInput');
    expect(input).toBeTruthy();
    await page.type('.cardInput', title);
    const termosChk = await page.$('#termos-uso');
    expect(termosChk).toBeTruthy();
    await termosChk.click();
    await page.waitForSelector('.button-container button:not([disabled])');
    await page.click('.button-container button:not([disabled])');
    const titleBar = await page.$('#main-header');
    expect(titleBar).toBeTruthy();
    const projectTitle = await page.$eval('.projectTitle', (element) => element.textContent);
    expect(projectTitle).toBe(title);
  });

  it('Não deve ser possível criar um projeto aceitar os termos', async () => {
    const projectBtn = await page.$('.btnPorjects');
    await projectBtn.click();
    const newProjectButton = await page.$('.btnNewProject');
    await newProjectButton.click();
    await page.type('.cardInput', title);
    const btnSave = await page.$('#btnSavePr');
    await btnSave.click();
    const mensage = await page.$('.tooltip-big-text');
    expect(mensage).toBeTruthy();
    const titleBar = await page.$('#main-header');
    expect(titleBar).not.toBeTruthy();
  });
});
