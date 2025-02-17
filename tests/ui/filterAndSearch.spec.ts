import { test, expect } from '@playwright/test';
import { ImageGalleryPage } from '../../page_objects/ImageGalleryPage';

let galleryPage: ImageGalleryPage; 

test.beforeEach(async ({ page }) => {
    galleryPage = new ImageGalleryPage(page);
    await galleryPage.goto();
});

test('should filter images by search term', async () => {
    await galleryPage.searchFor('book');
    const titles = await galleryPage.getCardTitles();
    const subtitles = await galleryPage.getImageKeywords();
    expect(titles.some(title => title.toLowerCase().includes('book'))).toBeTruthy();

    const expectedKeywords = ['study', 'pages', 'book'];
    expect(subtitles.some(keyword => expectedKeywords.some(expected => keyword.toLowerCase().includes(expected)))).toBeTruthy();
  });

test('should show correct image for single related keyword and then reset filters', async () => {
    const testCases = [
      { filter: 'book', imageTitle: 'Book', expectedCount: 1 },
      { filter: 'mountains', imageTitle: 'Mountains', expectedCount: 1 },
      { filter: 'coffee', imageTitle: 'Coffee', expectedCount: 1 },
    ];
  
    for (const { filter, imageTitle, expectedCount } of testCases) {
      await galleryPage.selectFilter(filter);
      expect(await galleryPage.isImageVisible(imageTitle)).toBeTruthy();
      expect(await galleryPage.getVisibleImages()).toBe(expectedCount);
      await galleryPage.resetFilters();
    }
  });
  

test('should show book image when filtering by multiple related keywords', async () => {
    await galleryPage.selectMultipleFilters(['book', 'pages', 'study']);
    
    expect(await galleryPage.isImageVisible('Book')).toBeTruthy();
    expect(await galleryPage.getVisibleImages()).toBe(1);
});

test('should not show mountains image when filtering by multiple unrelated keywords', async () => {
    await galleryPage.selectMultipleFilters(['mountains','snow','cold','coffee']);
    
    expect(await galleryPage.imageNotVisible('Mountains')).toBeTruthy();
    expect(await galleryPage.getVisibleImages()).toBe(0);

});

  test('should have working add image button', async () => {
    await expect(galleryPage.addImageButton).toBeVisible();
    await expect(galleryPage.addImageButton).toBeEnabled();
  });