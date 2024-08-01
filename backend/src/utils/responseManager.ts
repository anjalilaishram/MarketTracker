
// backend/src/utils/responseManager.ts

import { Response } from "express";

class ResponseManager {
    success(res: Response, data: any, message: string = "Success") {
        res.status(200).json({
            status: "success",
            message,
            data,
        });
    }

    error(res: Response, error: any, message: string = "Error") {
        res.status(500).json({
            status: "error",
            message,
            error: error.message || error,
        });
    }
}

export default new ResponseManager();

