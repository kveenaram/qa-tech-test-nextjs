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
    console.log('Found keywords:', subtitles);

    expect(titles.some(title => title.toLowerCase().includes('book'))).toBeTruthy();
   // expect(subtitles.some(keyword => keyword.toLowerCase().includes('study'))).toBeTruthy();
    

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
      // 1. Apply the filter
      await galleryPage.selectFilter(filter);
  
      // 2. Verify the correct image is visible
      expect(await galleryPage.isImageVisible(imageTitle)).toBeTruthy();
  
      // 3. Verify the total number of visible images
      expect(await galleryPage.getVisibleImages()).toBe(expectedCount);
  
      // 4. Reset filters for the next iteration
      await galleryPage.resetFilters();
  
      // 5. verify the default number of images after reset, e.g., 3
      expect(await galleryPage.getVisibleImages()).toBe(3);
    }
  });
  

test('should show book image when filtering by multiple related keywords', async () => {
    await galleryPage.selectMultipleFilters(['book', 'pages', 'study']);
    
    // Verify only book image is visible
    expect(await galleryPage.isImageVisible('Book')).toBeTruthy();
    expect(await galleryPage.getVisibleImages()).toBe(1);
});

test('should not show mountains image when filtering by multiple unrelated keywords', async () => {
    await galleryPage.selectMultipleFilters(['mountains','snow','cold','coffee']);
    
    // No images displayed
    expect(await galleryPage.imageNotVisible('Mountains')).toBeTruthy();
    expect(await galleryPage.getVisibleImages()).toBe(0);

});

  test('should have working add image button', async () => {
    await expect(galleryPage.addImageButton).toBeVisible();
    await expect(galleryPage.addImageButton).toBeEnabled();
  });