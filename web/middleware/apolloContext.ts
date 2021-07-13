import { Role } from "../../graphql/roles";
import { prisma } from "../../common/prisma";

export default function ApolloContext({ req }) {
    const token = req.headers.authorization || '';

    let roles: Role[] = [];

    if (token === process.env.ADMIN_AUTH_TOKEN) {
        roles.push(Role.ADMIN);
    }

    const user = { roles };

    return { user, prisma };
}