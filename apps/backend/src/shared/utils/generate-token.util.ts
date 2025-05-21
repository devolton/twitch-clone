import {PrismaService} from "../../core/prisma/prisma.service";
import {$Enums, User} from "../../../prisma/generated";
import TokenType = $Enums.TokenType;
import {v4 as uuidv4} from 'uuid'


export async function generateToken(
    prisma: PrismaService,
    user: User,
    type: TokenType,
    isUUid: boolean = true,
) {
    let token: string;
    if (isUUid) {
        token = uuidv4();
    } else {
        token = (Math.floor(Math.random() * (1000000 - 100000) + 100000)).toString();
    }
    const expiresIn = new Date(new Date().getTime() + 300000);
    const existingToken = await prisma.token.findFirst({
        where: {
            type,
            user: {
                id: user.id
            }

        }
    });
    if (existingToken) {
        await prisma.token.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const newToken = await prisma.token.create({
        data: {
            token,
            expiresIn,
            type,
            user: {
                connect: {
                    id: user.id
                }
            },
        },
        include: {
            user: {
                include: {
                    notificationSettings: true
                }
            },

        }
    })
    return newToken;

}