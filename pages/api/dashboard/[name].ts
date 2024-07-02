// pages/api/dashboard/[name].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { DashboardService } from '@/services/DashboardService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing dashboard name' });
  }

  if (req.method === 'GET') {
    try {
      const { dashboard, charts } = await DashboardService.getDashboardByName(name);
      return res.status(200).json({ dashboard, charts });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}