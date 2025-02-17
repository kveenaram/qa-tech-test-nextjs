import { test, expect, APIRequestContext } from '@playwright/test';
import { ImagesClient } from '../../api/ImagesClient';

test.describe('DELETE /api/images Tests', () => {
  let imagesClient: ImagesClient;
  let createdImageId: string;
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });

    // Create test image
    const createResponse = await apiContext.post('/api/images', {
      data: {
        title: 'Test Delete Image',
        image: 'https://example.com/image.jpg',
        keywords: ['test'],
        uploadDate: new Date().toISOString()
      }
    });

    if (!createResponse.ok()) {
      const errorBody = await createResponse.text();
      throw new Error(`Image creation failed: ${errorBody}`);
    }

    const createdImage = await createResponse.json();
    createdImageId = createdImage.id;
  });

  test('Should delete existing image', async () => {
    const response = await apiContext.delete(`/api/images?id=${createdImageId}`);
    expect(response.status()).toBe(200);
  });

  test('Should return 404 for non-existent ID', async () => {
    const response = await apiContext.delete('/api/images?id=non-existent-123');
    
    expect(response.status()).toBe(404);
    const body = await response.text();
    if (body) { // Handle empty response case
      expect(JSON.parse(body)).toEqual({
        message: 'Image not found'
      });
    }
  });

  test('Should return 404 for invalid ID format', async () => {
    const response = await apiContext.delete('/api/images?id=invalid@id');
    
    expect(response.status()).toBe(404);
    const body = await response.text();
    if (body) {
      expect(JSON.parse(body)).toEqual({
        message: 'Image not found'
      });
    }
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});