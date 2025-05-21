import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../../core/prisma/prisma.service";
import type {User} from "../../../../../prisma/generated";
import {encode} from 'hi-base32'
import * as qrcode from 'qrcode'
import {randomBytes} from 'crypto';
import {TOTP} from "otpauth";
import {EnableTotpInput} from "./inputs/enable-totp.input";
import {TotpModel} from "./models/totp.model";

@Injectable()
export class TotpService {
    constructor(private readonly prisma: PrismaService) {
    }

    async generate(user: User): Promise<TotpModel> {
        const secret = encode(randomBytes(15)).replace(/=/g, ' ').substring(0, 24);
        const totp = new TOTP({
            issuer: "DevoltonLabs",
            label: `${user.email}`,
            algorithm: "SHA1",
            digits: 6,
            secret
        });
        const otpauthUrl = totp.toString();
        const qrcodeUrl = await qrcode.toDataURL(otpauthUrl);
        return {qrcodeUrl, secret};
    }

    async enable(user: User, input: EnableTotpInput): Promise<boolean> {
        const {secret, pin} = input;
        const totp = new TOTP({
            issuer: "DevoltonLabs",
            label: `${user.email}`,
            algorithm: "SHA1",
            digits: 6,
            secret
        });
        const delta = totp.validate({token: pin});
        if (!delta) {
            throw new BadRequestException("Invalid code");
        }
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isTotpEnabled: true,
                totpSecret: secret
            }
        });
        return true;
    }

    async disable(user: User): Promise<boolean> {
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isTotpEnabled: false,
                totpSecret: null
            }
        });
        return true;
    }

}
