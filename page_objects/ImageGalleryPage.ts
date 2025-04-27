import { Page, Locator } from '@playwright/test';

export class ImageGalleryPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly imagecardTitles: Locator;
  readonly imageCardSubtitles: Locator; 
  readonly filterDropdown: Locator;
  readonly imageListItems: Locator;
  readonly activeFilters: Locator;
  readonly addImageButton: Locator; 

    constructor(page: Page) {
        this.page = page;
        this.searchInput = this.page.getByPlaceholder('Search');
        this.filterDropdown = this.page.getByRole('combobox');
        this.imageListItems = page.locator('li.MuiImageListItem-root');
        this.imagecardTitles = page.locator('.css-1sdhmys-MuiImageListItemBar-title');
        this.imageCardSubtitles = page.locator('.MuiImageListItemBar-subtitle');
        this.addImageButton = page.getByRole('button', { name: 'ADD IMAGE' });
        this.activeFilters = page.locator('li[role="option"][aria-selected="true"]');
    }

    async goto() {
        await this.page.goto('http://localhost:3000');
    }

    async getImages() {
        return this.page.$$('.MuiImageListItem-img');
    }

    async getCardTitles() {
        return await this.imagecardTitles.allInnerTexts();
    }

    async getImageKeywords() {
        return await this.imageCardSubtitles.allInnerTexts();
    }

    async searchFor(text: string) {
        await this.searchInput.fill(text);
        await this.searchInput.press('Enter');
    }

    async selectFilter(option: string) {
        await this.filterDropdown.click();
        await this.page.getByText(option, { exact: true }).click();

         // Click away to close dropdown (optional, depending on your UI behavior)
         await this.page.waitForTimeout(3000);
         await this.page.keyboard.press('Escape');
    }

    async selectMultipleFilters(options: string[]) {
        await this.filterDropdown.click();
        for (const option of options) {
            await this.page.getByText(option, { exact: true }).click();
        }
        // Click away to close dropdown (optional, depending on your UI behavior)
        await this.page.waitForTimeout(3000);
        await this.page.keyboard.press('Escape');
    }

    async getVisibleImages() {
        return await this.imageListItems.count();
    }

    async isImageVisible(title: string) {
        const titleElements = await this.imagecardTitles.allInnerTexts();
        return titleElements.includes(title);
    }

    async imageNotVisible(title: string) { 
        const imageElement = this.imageListItems.filter({ hasText: title });
        return await imageElement.count() === 0;
    }

    async resetFilters() {
        const activeFilterOptions = await this.activeFilters.all();
        for (const filter of activeFilterOptions) {
            await filter.click();
            // Add a small delay to handle any UI updates
            await this.page.waitForTimeout(100);
        }
    }

    async clearSearch() {
        await this.searchInput.clear();
    }
}