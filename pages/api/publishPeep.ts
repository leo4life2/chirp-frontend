// pages/api/publishPeep.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
  
    const API_KEY = process.env.IPFS_INFURA_API_KEY;
    const API_SECRET = process.env.IPFS_INFURA_API_SECRET;
  
    if (!API_KEY || !API_SECRET) {
      return res.status(500).json({ error: 'API key and/or secret not configured' });
    }
  
    const peepContent = req.body.content;
  
    const formData = new FormData();
    formData.append('file', new Blob([JSON.stringify({ content: peepContent })], { type: 'application/json' }));
  
    try {
      const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
        },
        body: formData
      });
  
      const data = await response.json();
      return res.status(200).json(data);
  
    } catch (error) {
      console.error("Error publishing peep:", error);
      return res.status(500).json({ error: 'Failed to publish peep' });
    }
  }
  