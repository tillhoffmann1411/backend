import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumexpert_data_allowed_enumFilter } from "../inputs/NestedEnumexpert_data_allowed_enumFilter";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumexpert_data_allowed_enumFilter {
  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: true
  })
  equals?: "pending" | "yes" | "no" | undefined;

  @TypeGraphQL.Field(_type => [expert_data_allowed_enum], {
    nullable: true
  })
  in?: Array<"pending" | "yes" | "no"> | undefined;

  @TypeGraphQL.Field(_type => [expert_data_allowed_enum], {
    nullable: true
  })
  notIn?: Array<"pending" | "yes" | "no"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumexpert_data_allowed_enumFilter, {
    nullable: true
  })
  not?: NestedEnumexpert_data_allowed_enumFilter | undefined;
}
