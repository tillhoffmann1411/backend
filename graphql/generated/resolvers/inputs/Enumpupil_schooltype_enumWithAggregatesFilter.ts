import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_schooltype_enumFilter } from "../inputs/NestedEnumpupil_schooltype_enumFilter";
import { NestedEnumpupil_schooltype_enumWithAggregatesFilter } from "../inputs/NestedEnumpupil_schooltype_enumWithAggregatesFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumpupil_schooltype_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: true
  })
  equals?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;

  @TypeGraphQL.Field(_type => [pupil_schooltype_enum], {
    nullable: true
  })
  in?: Array<"grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_schooltype_enum], {
    nullable: true
  })
  notIn?: Array<"grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_schooltype_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_schooltype_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_schooltype_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumpupil_schooltype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_schooltype_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumpupil_schooltype_enumFilter | undefined;
}
