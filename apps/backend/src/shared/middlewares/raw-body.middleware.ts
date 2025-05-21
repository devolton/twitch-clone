import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import type {NextFunction, Request, Response} from "express"
import getRawBody from "raw-body";

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.readable) {
            return next(new BadRequestException('Invalid data'));
        }
        getRawBody(req, {encoding: "utf8"}).then((body) => {
            req.body = body;
            next();
        }).catch((err) => {
            throw new BadRequestException("Error during get raw data");
            next(err)
        })
    }

}