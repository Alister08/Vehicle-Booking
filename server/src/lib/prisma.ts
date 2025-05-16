import {PrismaClient} from '@prisma/client'
const prismaClientSignlton = () =>{
    return new PrismaClient()
}

const globalForPrisma = globalThis as unknown as {prisma: PrismaClient | undefined};
const prisma  =   globalForPrisma.prisma ??  prismaClientSignlton();

export default prisma