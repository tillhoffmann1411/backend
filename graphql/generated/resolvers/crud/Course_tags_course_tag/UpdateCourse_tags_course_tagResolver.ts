import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateCourse_tags_course_tagArgs } from "./args/UpdateCourse_tags_course_tagArgs";
import { Course_tags_course_tag } from "../../../models/Course_tags_course_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tags_course_tag)
export class UpdateCourse_tags_course_tagResolver {
  @TypeGraphQL.Mutation(_returns => Course_tags_course_tag, {
    nullable: true
  })
  async updateCourse_tags_course_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateCourse_tags_course_tagArgs): Promise<Course_tags_course_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_tags_course_tag.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
