// eslint-disable-next-line camelcase
import {Certificate_of_conduct, Course, Screener, Student} from "../generated";
import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";


// eslint-disable-next-line camelcase
@Resolver(of => Certificate_of_conduct)
export class ExtendedFieldsCertificateOfConductResolver {
    @FieldResolver(returns => [Student])
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async student(@Root() certificate: Certificate_of_conduct) {
        return await prisma.student.findMany({
            where: {
                id: certificate.studentId
            }
        });
    }
}