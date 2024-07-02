// src/pages/api/chart/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { ChartService } from '@/services/ChartService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, from, to } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await ChartService.getChartById(id as string, from as string, to as string);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching chart:', error);
      return res.status(500).json({ error: error });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
