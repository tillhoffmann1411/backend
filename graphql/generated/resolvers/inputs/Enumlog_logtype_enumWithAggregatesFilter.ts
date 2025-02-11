import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumlog_logtype_enumFilter } from "../inputs/NestedEnumlog_logtype_enumFilter";
import { NestedEnumlog_logtype_enumWithAggregatesFilter } from "../inputs/NestedEnumlog_logtype_enumWithAggregatesFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { log_logtype_enum } from "../../enums/log_logtype_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumlog_logtype_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => log_logtype_enum, {
    nullable: true
  })
  equals?: "misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange" | undefined;

  @TypeGraphQL.Field(_type => [log_logtype_enum], {
    nullable: true
  })
  in?: Array<"misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange"> | undefined;

  @TypeGraphQL.Field(_type => [log_logtype_enum], {
    nullable: true
  })
  notIn?: Array<"misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlog_logtype_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumlog_logtype_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlog_logtype_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumlog_logtype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlog_logtype_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumlog_logtype_enumFilter | undefined;
}
