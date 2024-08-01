
// backend/src/controllers/configController.ts

import { Request, Response } from "express";
import { ConfigService } from "../services/configService";
import responseManager from "../utils/responseManager";

export const getConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        const config = await ConfigService.getConfig();
        responseManager.success(res, config);
    } catch (error) {
        responseManager.error(res, error);
    }
};

export const updateConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedConfig = await ConfigService.updateConfig(req.body);
        responseManager.success(res, updatedConfig);
    } catch (error) {
        responseManager.error(res, error);
    }
};

export const deleteConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        const { symbol } = req.body;
        const result = await ConfigService.deleteConfig(symbol);
        responseManager.success(res, result);
    } catch (error) {
        responseManager.error(res, error);
    }
};

