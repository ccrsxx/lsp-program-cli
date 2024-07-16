import type { Request, Response } from 'express';
import type { NormalizedResponse } from '../utils/types/express.js';

export function ping(_req: Request, res: Response<NormalizedResponse>): void {
  res.status(200).json({ message: 'Ping successfully' });
}
