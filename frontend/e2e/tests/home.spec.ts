import { test, expect } from '@playwright/test';


test.describe('home page', () => {
    test('homepage', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('link', { name: 'Jack\'s Blog' })).toBeVisible()
        /*  2. Filter by tag
          - Go to /
          - Click "TypeScript" tag
          - Assert URL has the tag in it
          - Assert at least one post is shown
          - Assert posts shown actually have that tag (if visible in card)

        */
    });

    test('navigate to blog detail', async ({page}) => {
        /*
      *
    1. Read a blog post (good first real test)

    - Go to /
    - Click a post link
    - Assert URL changed to /blog/...
    - Assert post title is visible on detail page
    - Assert post content area is visible
      * */
        await page.goto('/');
        await page.getByRole('link', { name: 'Getting Started with Spring Boot'}).first().click();
        await expect(page).toHaveURL(/\/blog\/\d+/);
        await expect(page.getByRole('heading', { name: 'Getting Started with Spring Boot 3', exact: true })).toBeVisible();

        const article = page.locator('article');
        await expect(article).toContainText('Introduction');
        await expect(article).toContainText('Quick Start');

    });

});



