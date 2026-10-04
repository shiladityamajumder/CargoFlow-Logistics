import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3002';
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const manifest = JSON.parse(fs.readFileSync('src/content/reference/manifest.json', 'utf8'));

async function open(path) {
  const response = await page.goto(base + path, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200, path);
  await page.waitForTimeout(250);
}

async function fillStep() {
  const step = page.locator('[data-form="step"]:not([hidden])');
  const required = step.locator('input[required],select[required],textarea[required]');
  for (const field of await required.all()) {
    if (!await field.isVisible()) continue;
    const { type, name } = await field.evaluate(element => ({ type: element.type, name: element.name }));
    if (type === 'checkbox') { await field.check({ force: true }); continue; }
    if (type === 'select-one') {
      const value = await field.evaluate(element => [...element.options].find(option => option.value)?.value);
      assert.ok(value, `Options missing for ${name}`);
      await field.selectOption(value);
    } else if (type === 'date') await field.fill('2026-10-08');
    else if (type === 'number') await field.fill('10');
    else if (type === 'email') await field.fill('test@example.com');
    else if (type === 'tel') await field.fill('+491234567890');
    else await field.fill(/zip|plz/i.test(name) ? '51069' : 'Test entry');
  }
}

try {
  // Every copied route is independently served; this also catches missing files.
  const paths = Object.keys(manifest);
  for (let index = 0; index < paths.length; index += 8) {
    await Promise.all(paths.slice(index, index + 8).map(async path => {
      const response = await page.request.get(base + path);
      assert.equal(response.status(), 200, path);
      const html = await response.text();
      assert.ok(html.includes('reference-page'), path);
      assert.ok(!html.includes('hook.eu2.make.com'), 'Original form destination leaked');
    }));
  }
  console.log(`PASS: ${paths.length} internal routes`);

  for (const mode of ['strasse', 'schiene', 'luft-und-see', 'autotransport', 'logistik']) {
    await open(`/en/frachtanfrage/${mode}`);
    assert.equal(await page.locator('[data-form="step"]:not([hidden])').count(), 1);
    await page.locator('[data-form="step"]:not([hidden]) [data-form="next-btn"]').click();
    assert.match(await page.locator('.step_link.current').innerText(), /01/);
    const stepCount = await page.locator('[data-form="step"]').count();
    for (let step = 0; step < stepCount - 1; step++) {
      await fillStep();
      if (mode === 'strasse' && step === 0) {
        await page.locator('[name="Adressdaten_Andere_Checkbox"]').check({ force: true });
        assert.ok(await page.locator('.form_cell.is-abholadresse').first().isVisible());
        await page.locator('[name="Adressdaten_Andere_Checkbox"]').uncheck({ force: true });
      }
      if (mode === 'strasse' && step === 3) {
        await page.locator('[data-add-new]').click();
        assert.equal(await page.locator('[data-clone]').count(), 2);
        await fillStep();
        await page.locator('[data-clone]').last().locator('[data-form="remove-clone"]').click();
        assert.equal(await page.locator('[data-clone]').count(), 1);
      }
      await page.locator('[data-form="step"]:not([hidden]) [data-form="next-btn"]').click();
      await page.waitForTimeout(100);
      assert.match(await page.locator('.step_link.current').innerText(), new RegExp(`0${step + 2}`), `${mode}: step ${step + 2}`);
    }
    const firstSummary = page.locator('[data-form="step"]:not([hidden]) [data-input-field]').first();
    assert.equal(await firstSummary.textContent(), 'Test entry');
    await page.locator('[data-form="custom-progress-indicator"]').first().click();
    assert.equal(await page.locator('input[name$="auftraggeber_name"]').inputValue(), 'Test entry');
    await page.locator('[data-form="custom-progress-indicator"]').last().click();
    await fillStep();
    await page.locator('[data-form="submit-btn"]').click({ force: true });
    await page.waitForFunction(() => document.querySelector('.reference-form-status')?.textContent?.includes('not been sent'));
    assert.ok(await page.getByRole('button', { name: 'Download your inquiry' }).isVisible());
    console.log(`PASS: ${mode} validation, steps, summary, back navigation and delivery state`);
  }

  await open('/en/kontakt');
  const trigger = page.locator('[fs-accordion-element="trigger"]').first();
  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  await trigger.press('Enter');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  const contact = page.locator('.reference-contact-form');
  await contact.locator('[name=email]').fill('test@example.com');
  await contact.locator('[name=name]').fill('Test person');
  await contact.locator('[name=subject]').fill('Test inquiry');
  await contact.locator('[name=message]').fill('A local form verification.');
  await contact.locator('[name=consent]').check();
  await contact.getByRole('button', { name: 'Submit' }).click();
  await page.waitForFunction(() => document.querySelector('.reference-form-status')?.textContent?.includes('not been sent'));
  console.log('PASS: contact form and keyboard accordion');

  const invalid = await page.request.post(base + '/api/inquiries', { multipart: { email: 'invalid' } });
  assert.equal(invalid.status(), 400);

  await open('/en/standorte');
  const allLocations = await page.locator('.branch_list > :not([hidden])').count();
  await page.locator('input[fs-list-field="*"]').first().fill('Cologne');
  const filtered = await page.locator('.branch_list > :not([hidden])').count();
  assert.ok(filtered < allLocations);
  await page.locator('input[fs-list-field="*"]').first().fill('no-such-location-12345');
  assert.equal(await page.locator('.branch_list > :not([hidden])').count(), 0);
  await page.locator('input[fs-list-field="*"]').first().fill('');
  assert.equal(await page.locator('.branch_list > :not([hidden])').count(), allLocations);
  console.log('PASS: location search and empty results');

  await open('/en/news');
  const allNews = await page.locator('.news_grid_list > :not([hidden])').count();
  await page.locator('[fs-cmsfilter-element="filters"] label').first().click();
  assert.ok(await page.locator('.news_grid_list > :not([hidden])').count() < allNews);
  await page.locator('[fs-cmsfilter-element="clear"]').click();
  assert.equal(await page.locator('.news_grid_list > :not([hidden])').count(), allNews);
  console.log('PASS: news category filters');

  await open('/en/search?query=Road');
  assert.ok(await page.locator('.reference-search-results > a').count() > 0);
  await open('/en/leistungen/strasse');
  await page.locator('[data-dropdown-toggle="leistungen"]').click();
  assert.equal(await page.locator('[data-nav-content="leistungen"]').getAttribute('aria-hidden'), 'false');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-nav-content="leistungen"]').getAttribute('aria-hidden'), 'true');

  await open('/');
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '16px');
  await page.mouse.move(700, 650);
  for (const stage of ['logistics', 'air', 'rail', 'digital']) {
    await page.mouse.wheel(0, 150);
    await page.waitForFunction(stage => document.querySelector('#journey')?.getAttribute('data-stage') === stage, stage);
    await page.waitForFunction(() => document.querySelector('#journey')?.getAttribute('data-transitioning') === 'false');
    assert.equal(await page.evaluate(() => scrollY), 0);
  }
  await page.mouse.wheel(0, 300);
  await page.waitForFunction(() => scrollY > 0);
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, -1000);
  await page.waitForFunction(() => scrollY <= 4);
  await page.waitForTimeout(200);
  await page.mouse.wheel(0, -150);
  await page.waitForFunction(() => document.querySelector('#journey')?.getAttribute('data-stage') === 'rail');
  await page.waitForFunction(() => document.querySelector('#journey')?.getAttribute('data-transitioning') === 'false');
  console.log('PASS: all homepage wheel transitions, scrolling release and reverse transition');

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/en/leistungen', '/en/leistungen/strasse', '/en/portrait', '/en/kontakt', '/en/frachtanfrage/strasse', '/en/standorte', '/en/news']) {
    await open(route);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Mobile overflow: ${route}`);
  }
  await page.locator('[data-burger-toggle]').click();
  assert.equal(await page.locator('[data-burger-toggle]').getAttribute('aria-expanded'), 'true');
  assert.ok(await page.locator('[data-mobile-nav]').isVisible());
  console.log('PASS: mobile layouts and navigation');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log('All checks passed.');
} finally {
  await browser.close();
}
