
import { test, expect } from '@playwright/test';

test('Planifier une nouvelle tâche d\'arrosage', async ({ page }) => {
  // 1. Aller sur la page /watering
  await page.goto('http://localhost:5173/watering');

  // 2. Cliquer sur le bouton "Planifier une tâche"
  await page.getByLabel('Planifier une tâche').click();

  // 3. Sélectionner le jour sur le carousel (scroll si besoin)
  // Exemple : sélectionner le 15 du mois
  const targetDay = '15';
  const dayButton = await page.locator('.date-card-number', { hasText: targetDay }).first();
  await dayButton.click();

  // 4. Sélectionner l'heure de début et de fin via les dropdowns HourSelect
  const dropdowns = await page.locator('.hour-select-dropdown');
  await dropdowns.nth(0).selectOption('10:00'); // début
  await dropdowns.nth(1).selectOption('11:00'); // fin

  // 5. Sélectionner la nature de la tâche (catégorie)
  await page.getByRole('button', { name: 'Arrosage' }).click();

  // 6. Sélectionner la jauge de soif (nombre de jours entre deux arrosages)
  await page.selectOption('.thirst-input-select', '7');

  // 7. Ajouter une note (optionnel)
  await page.getByPlaceholder('Ajouter une note...').fill('Test Playwright');

  // 8. Valider l'action
  await page.getByRole('button', { name: 'Encore une bonne action à faire' }).click();

});
