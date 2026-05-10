import { test, expect } from '@playwright/test';


test.describe('tags page', () => {
    test('navigate to tags', async ({ page }) => {
        /*  2. Filter by tag
          - Go to /
          - Click "TypeScript" tag
          - Assert URL has the tag in it
          - Assert at least one post is shown
          - Assert posts shown actually have that tag (if visible in card)
        */
        await page.goto('/');
        await expect(page.getByRole('link', { name: 'Tags' })).toBeVisible()
        await page.getByRole('link', { name: 'Tags' }).click();
        await expect(page).toHaveURL(/\/tags$/);
        await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible()


    });

    test('filter posts by tag and open one', async ({page}) => {
        await page.goto('/tags');
        await expect(page.getByRole('button', { name: 'Java' })).toBeVisible();
        await page.getByRole('button', { name: 'Java' }).click();
        await expect(page).toHaveURL(/\/tags$/);
        await expect(page.getByRole('link', { name: 'Java' }).first()).toBeVisible();

        await expect(page.getByRole('link', { name: 'Docker Compose for Local' })).not.toBeVisible();

        await expect(page.getByRole('link', { name: 'Getting Started with Spring Boot' })).toBeVisible()
        await page.getByRole('link', { name: 'Getting Started with Spring Boot' }).click();
        await expect(page).toHaveURL(/\/blog\/\d+/);
        await expect(page.getByRole('heading', { name: 'Getting Started with Spring Boot' })).toBeVisible()

    });

});



