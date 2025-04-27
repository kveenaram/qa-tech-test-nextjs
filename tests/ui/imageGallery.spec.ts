import { test, expect } from '@playwright/test';
import { ImageGalleryPage } from '../../page_objects/ImageGalleryPage';

let galleryPage: ImageGalleryPage; 

test.beforeEach(async ({ page }) => {
    galleryPage = new ImageGalleryPage(page);
    await galleryPage.goto();
});

test('should load the gallery page successfully', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Image Gallery');
    const images = await galleryPage.getImages();
    expect(images.length).toBeGreaterThan(0);
});

test('should display the default gallery items', async ({ page }) => {
    const titles = await galleryPage.getCardTitles();

    expect(titles).toContain('Book');
    expect(titles).toContain('Mountains');
    expect(titles).toContain('Coffee');
  });