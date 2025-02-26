
// backend/src/controllers/dataController.ts

import { Request, Response } from "express";
import { DataService } from "../services/dataService";
import responseManager from "../utils/responseManager";

export const getLiveData = async (req: Request, res: Response): Promise<void> => {
    try {
        const symbol = req.params.symbol;
        const liveData = await DataService.getLiveData(symbol);
        responseManager.success(res, liveData);
    } catch (error) {
        responseManager.error(res, error);
    }
};

export const getHistoricalData = async (req: Request, res: Response): Promise<void> => {
    try {
        const symbol = req.params.symbol;
        const startTime = parseInt(req.query.startTime as string, 10);
        const endTime = parseInt(req.query.endTime as string, 10);
        const historicalData = await DataService.getHistoricalData(symbol, startTime, endTime);
        responseManager.success(res, historicalData);
    } catch (error) {
        responseManager.error(res, error);
    }
};