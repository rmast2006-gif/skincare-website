import { Request, Response } from 'express';
import Visit from '../models/Visit';

export const trackVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔥 TRACK VISIT CALLED');

    const dateString = new Date().toISOString().split('T')[0];

    await Visit.findOneAndUpdate(
      { date: dateString },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Visit tracked' });
  } catch (error) {
    console.error('❌ TRACK ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const visits = await Visit.find().sort({ date: 1 });
    const totalVisits = visits.reduce((sum, visit) => sum + visit.count, 0);
    const dailyVisits = visits.map((visit) => ({ date: visit.date, visitors: visit.count }));

    res.status(200).json({
      totalVisits,
      dailyVisits,
    });
  } catch (error) {
    console.error('❌ ANALYTICS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};