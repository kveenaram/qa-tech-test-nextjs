import { test, expect } from '@playwright/test';
import { ImagesClient } from '../../api/ImagesClient';

test.describe('POST /api/images Tests', () => {
  let imagesClient: ImagesClient;

  test.beforeEach(async ({ request }) => {
    imagesClient = new ImagesClient(request);
  });

  test('Should create a new image with valid data', async () => {
    const payload = {
      title: 'Sunset at the Beach',
      tags: 'nature, beach, sunset', 
      keywords: ['nature', 'beach', 'sunset'],
      image: 'https://example.com/image.jpg', 
      uploadDate: new Date().toISOString() 
    };

    const response = await imagesClient.createImage(payload);
    const responseBody = await response.json();
    console.log(responseBody); 
    expect(response.status()).toBe(201);

    // Verify the response body
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.title).toBe(payload.title);
    // Only check for `tags` if it is returned by the API
    if (responseBody.tags !== undefined) {
      expect(responseBody.tags).toBe(payload.tags);
    }
    expect(responseBody.keywords).toEqual(payload.keywords);
  });

  test('Should return 400 when title is missing', async () => {
    const payload = {
      tags: 'nature, beach, sunset',
      keywords: ['nature', 'beach', 'sunset'],
      image: 'https://example.com/image.jpg', // Add this if required
      uploadDate: new Date().toISOString() // Add this if required
    };

    const response = await imagesClient.createImage(payload);
    expect(response.status()).toBe(400);

    const errorResponse = await response.json();
    expect(errorResponse.error).toBe('Missing title, image, keywords or upload date');
  });

  test('Should return 400 when keywords are missing', async () => {
    const payload = {
      title: 'Sunset at the Beach',
      tags: 'nature, beach, sunset',
      image: 'https://example.com/image.jpg', 
      uploadDate: new Date().toISOString() 
    };

    const response = await imagesClient.createImage(payload);
    expect(response.status()).toBe(400);

    const errorResponse = await response.json();
    expect(errorResponse.error).toBe('Missing title, image, keywords or upload date');
  });
});