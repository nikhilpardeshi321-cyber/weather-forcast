"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const router = (0, express_1.Router)();
router.post('/cities', analyticsController_1.postCitiesAnalytics);
router.get('/city/:name', analyticsController_1.getCityAnalytics);
exports.default = router;
