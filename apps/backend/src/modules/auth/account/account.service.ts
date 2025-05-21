import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {CreateUserInput} from "./inputs/create-user-input";
import {hash, verify} from "argon2";
import {VerificationService} from "../verification/verification.service";
import {User} from "../../../../prisma/generated";
import {ChangeEmailInput} from "./inputs/change-email.input";
import {ChangePasswordInput} from "./inputs/change-password.input";

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService,
                private readonly verificationService: VerificationService,) {
    }

    public async me(id: number) {
        const user = await this.prisma.user.findFirst({
            where:
                {
                    id
                }
        });
        if(!user) {
            throw new NotFoundException("User not found");
        }
        return user;

    }

    public async create(input: CreateUserInput) {
        const {username, email, password} = input;
        const isUsernameExist = await this.prisma.user.findUnique({
            where: {
                username
            }
        });
        if (isUsernameExist) {
            throw new ConflictException("Username already exist");
        }
        const isEmailExist = await this.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (isEmailExist) {
            throw new ConflictException("Email already exist");
        }
        const user = await this.prisma.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                displayName: username,
                stream:{
                    create:{
                        title:`Stream ${username}`
                    }
                }
            }
        });
        await this.verificationService.sendVerificationToken(user);
        return true;

    }
    async changeEmail(user:User,input:ChangeEmailInput) {
        const {email} = input;
        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data: {
                email
            }
        });
        return true;
    }
    async changePassword(user:User,input:ChangePasswordInput) {
        const {oldPassword,newPassword} = input;
        const isValidPassword = await verify(user.password,oldPassword);
        if(!isValidPassword) {
            throw new UnauthorizedException("Incorrect old password");
        }
        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                password:await hash(newPassword),
            }
        })
        return true;
    }
}
