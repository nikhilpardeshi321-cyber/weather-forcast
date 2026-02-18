import { Router } from 'express';
import { postCitiesAnalytics, getCityAnalytics } from '../controllers/analyticsController';

const router = Router();

router.post('/cities', postCitiesAnalytics);
router.get('/city/:name', getCityAnalytics);

export default router;
