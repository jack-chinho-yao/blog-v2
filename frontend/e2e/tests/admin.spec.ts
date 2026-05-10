import { test, expect } from '@playwright/test';


test.describe('tags page', () => {
    test('navigate to tags', async ({ page }) => {
        /*
           3. Admin login (hardest, has side effects)
          - Go to /admin/login
          - Fill username + password
          - Click submit
          - Assert redirect to dashboard
          - Assert "logout" button or admin-only UI appears
        */
        // await page.goto('/');
        // await expect(page.getByRole('link', { name: 'Tags' })).toBeVisible()
        // await page.getByRole('link', { name: 'Tags' }).click();
        // await expect(page).toHaveURL(/\/tags$/);
        // await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible()


    });

    test('filter posts by tag and open one', async ({page}) => {
        // await page.goto('/tags');
        // await expect(page.getByRole('button', { name: 'Java' })).toBeVisible()
        // await page.getByRole('button', { name: 'Java' }).click();
        //
        // await expect(page.getByRole('link', { name: 'Docker Compose for Local' })).not.toBeVisible();
        //
        // await expect(page.getByRole('link', { name: 'Getting Started with Spring Boot' })).toBeVisible()
        // await page.getByRole('link', { name: 'Getting Started with Spring Boot' }).click();
        // await expect(page).toHaveURL(/\/blog\/\d+/);
        // await expect(page.getByRole('heading', { name: 'Getting Started with Spring Boot' })).toBeVisible()

    });

});



