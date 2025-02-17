import { test, expect } from '@playwright/test';
import { ImageGalleryPage } from '../../page_objects/ImageGalleryPage';

let galleryPage: ImageGalleryPage; 

test.beforeEach(async ({ page }) => {
    galleryPage = new ImageGalleryPage(page);
    await galleryPage.goto();
});

test('should display "Mountains" image for partial search term "mo"', async () => {
    await galleryPage.searchFor('mo');
    const visibleCount = await galleryPage.getVisibleImages();
    expect(visibleCount).toBeGreaterThan(0);

    const titles = await galleryPage.getCardTitles();
    expect(titles.some(t => t.toLowerCase().includes('mountains'))).toBeTruthy();
});

test('should show "Book" image when searching with uppercase letters', async () => {
    await galleryPage.searchFor('BOOK');
    expect(await galleryPage.isImageVisible('Book')).toBeTruthy();
    expect(await galleryPage.getVisibleImages()).toBe(1);
});

test('should handle case-insensitive search for "CofFeE"', async () => {
    await galleryPage.searchFor('CofFeE');

    const titles = await galleryPage.getCardTitles();
   expect(titles.some(t => t.toLowerCase().includes('coffee'))).toBeTruthy();
});

test('should show no images if search term has no matches', async () => {
    await galleryPage.searchFor('xyzrandom!@');

    const count = await galleryPage.getVisibleImages();
    expect(count).toBe(0);
});

test('should reset search filters and show all images', async () => {
    await galleryPage.searchFor('book');
    expect(await galleryPage.getVisibleImages()).toBe(1);
    await galleryPage.clearSearch();
    expect(await galleryPage.getVisibleImages()).toBe(3);
});