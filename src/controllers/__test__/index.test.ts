import { jest } from '@jest/globals';
import type { Request, Response } from 'express';

const indexController = await import('../index.js');

describe('Index controller', () => {
  describe('Welcome message', () => {
    it('should return 200 status code with message and documentation link', () => {
      const mockRequest = {} as Request;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      indexController.ping(mockRequest, mockResponse);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Ping successfully'
      });
    });
  });
});
