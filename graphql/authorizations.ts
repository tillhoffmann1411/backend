import { ModelsEnhanceMap, Pupil, ResolversEnhanceMap, Student, Subcourse, Course, Lecture } from "./generated";
import { Authorized, createMethodDecorator } from "type-graphql";

import { AuthChecker } from "type-graphql";
import { GraphQLContext } from "./context";
import assert from "assert";
import { getLogger } from "log4js";
import { isOwnedBy, ResolverModel, ResolverModelNames } from "./ownership";

/* -------------------------- AUTHORIZATION FRAMEWORK ------------------------------------------------------- */

export enum Role {
    /* Access via Retool */
    ADMIN = "ADMIN",
    /* Shortcut role for Screeners, Pupils and Students: */
    USER = "USER",
    /* Access via Screener Admin Interface */
    SCREENER = "SCREENER",
    /* Access via User Interface */
    PUPIL = "PUPIL",
    STUDENT = "STUDENT",
    /* Accessible to everyone */
    UNAUTHENTICATED = "UNAUTHENTICATED",
    /* User owns the entity as defined in graphql/ownership */
    OWNER = "OWNER",
    /* No one should have access */
    NOBODY = "NOBODY"
}

const authLogger = getLogger("GraphQL Authentication");

/* The auth checker performs the authorization check for the @Authorized() annotation before the resolver runs
    It checks whether the user session created in graphql/context has all the roles required */
export const authChecker: AuthChecker<GraphQLContext> = async ({ context, info, root }, requiredRoles) => {
    assert(requiredRoles.length, "Roles must be passed to AUTHORIZED");
    assert(requiredRoles.every(role => role in Role), "Roles must be of enum Role");
    assert(context.user?.roles, "Roles must have been initialized in context");

    return await accessCheck(context, requiredRoles as Role[], info.parentType?.name as ResolverModelNames, root);
};

/* Inside mutations, determining Ownership is hard because the actual value is retrieved by it's primary key during
   mutation execution. Thus with AuthorizedDeferred one can move the access check into the mutation, and call
   hasAccess once the value is ready, like:

   @AuthorizedDeferred(Role.OWNER)
   courseCancel(@Ctx() context, @Arg() courseId: number) {
       const course = await getCourse(courseId);
       await hasAccess(context, "Course", course);
       // ...
   }

   Note that this leaks the information whether an entity exists, though as we use artificial primary keys this should not reveal
    anything of value
*/
export function AuthorizedDeferred(...requiredRoles: Role[]) {
    assert(requiredRoles.length, "Roles must be passed to AUTHORIZED");

    return createMethodDecorator<GraphQLContext>(({ args, root, info, context }, next) => {
        context.deferredRequiredRoles = requiredRoles;
        return next();
    });
}

export async function hasAccess<Name extends ResolverModelNames>(context: GraphQLContext, modelName: Name, value: ResolverModel<Name>): Promise<void | never> {
    assert(context.deferredRequiredRoles, "hasAccess may only be used in @AuthorizedDeferred methods");
    const success = await accessCheck(context, context.deferredRequiredRoles, modelName, value);
    if (!success) {
        throw new Error("Not Authorized");
    }
}

async function accessCheck(context: GraphQLContext, requiredRoles: Role[], modelName: ResolverModelNames | undefined, root: any) {
    if (requiredRoles.some(requiredRole => context.user.roles.includes(requiredRole as Role))) {
        return true;
    }

    /* If the user could access this field if they are owning the entity,
       we have to compare the user to the root value of this resolver
       and use the ownership check */
    if (requiredRoles.includes(Role.OWNER)) {
        assert(modelName, "Type must be resolved to determine ownership");
        assert(root, "root value must be bound to determine ownership");

        const ownershipCheck = isOwnedBy[modelName];
        assert(!!ownershipCheck, `Entity ${modelName} must have ownership definition if Role.OWNER is used`);

        const isOwner = await ownershipCheck(context.user, root);
        authLogger.debug(`Ownership check, result: ${isOwner} for ${modelName}`, context.user, root);

        if (isOwner) {
            return true;
        }
    }

    return false;
}

/* ------------------------------ AUTHORIZATION ENHANCEMENTS -------------------------------------------------------- */

const allAdmin = { _all: [Authorized(Role.ADMIN)] };
const adminOrOwner = [Authorized(Role.ADMIN, Role.OWNER)];
const onlyOwner = [Authorized(Role.OWNER)];
const nobody = [Authorized(Role.NOBODY)];

/* Utility to ensure that field authorizations are present except for the public fields listed */
const withPublicFields = <Entity = "never", PublicFields extends keyof Entity = never> (otherFields: { [key in Exclude<keyof Entity, PublicFields>]: PropertyDecorator[] }) => otherFields;

/* Although we do not expose all Prisma entities, we make sure authorization is present for all queries and mutations
   We use query and mutation authorizations as our main authorization strategy,
    as users usually have access to none or all fields.
    E.g. for pupils(take: 10) { id firstname } we do not check 10 times whether the user has access to id and firstname,
     but once whether he has access to "pupils".
    This however also means that through FieldResolver associations, one can leak user data in powerful ways,
     so always make sure to apply proper authorizations to those
*/
export const authorizationEnhanceMap: Required<ResolversEnhanceMap> = {
    Course: allAdmin,
    Pupil: allAdmin,
    Match: allAdmin,
    Lecture: allAdmin,
    Log: allAdmin,
    Subcourse: allAdmin,
    Student: allAdmin,
    Screening: allAdmin,
    Screener: allAdmin,
    Project_match: allAdmin,
    Bbb_meeting: allAdmin,
    Course_attendance_log: allAdmin,
    Course_instructors_student: allAdmin,
    Course_tag: allAdmin,
    Course_tags_course_tag: allAdmin,
    Expert_data: allAdmin,
    Expert_data_expertise_tags_expertise_tag: allAdmin,
    Expertise_tag: allAdmin,
    Instructor_screening: allAdmin,
    Jufo_verification_transmission: allAdmin,
    Mentor: allAdmin,
    Participation_certificate: allAdmin,
    Project_coaching_screening: allAdmin,
    Project_field_with_grade_restriction: allAdmin,
    School: allAdmin,
    Subcourse_instructors_student: allAdmin,
    Subcourse_participants_pupil: allAdmin,
    Subcourse_waiting_list_pupil: allAdmin,
    Concrete_notification: allAdmin,
    Course_guest: allAdmin,
    Course_participation_certificate: allAdmin,
    Notification: allAdmin,
    Pupil_tutoring_interest_confirmation_request: allAdmin,
    Certificate_of_conduct: allAdmin
};

/* Some entities are generally accessible by multiple users, however some fields of them are
   only supposed to be accessed by some users.
   By annotating the fields with extra checks, for every entity where the field is resolved the check is performed.
   Thus when running pupils(take: 10) { authToken } this will perform the ownership check for all 10 pupils retrieved
    (and will fail if one of them is not owned by the user)

   For various reasons query authorizations should be preferred, and field authorizations should only be used for
    extra sensitive data */
export const authorizationModelEnhanceMap: ModelsEnhanceMap = {
    // ATTENTION: Pupil entities can be seen by other users, e.g. through the Match -> pupil edge
    Pupil: {
        fields: withPublicFields<Pupil, "id" | "firstname" | "lastname" | "active" | "grade" | "isJufoParticipant" | "isParticipant" | "isProjectCoachee" | "isPupil" | "languages" | "projectFields">({
            // authentication data shall only be accessible to the user itself
            authToken: onlyOwner,
            authTokenSent: onlyOwner,
            authTokenUsed: onlyOwner,

            email: adminOrOwner,
            verification: adminOrOwner,
            verifiedAt: adminOrOwner,
            wix_id: adminOrOwner,
            newsletter: adminOrOwner,
            openMatchRequestCount: adminOrOwner,
            openProjectMatchRequestCount: adminOrOwner,
            matchingPriority: adminOrOwner,
            learningGermanSince: adminOrOwner,
            createdAt: adminOrOwner,
            registrationSource: adminOrOwner,
            school: adminOrOwner,
            schoolId: adminOrOwner,
            schooltype: adminOrOwner,
            state: adminOrOwner,
            teacherEmailAddress: adminOrOwner,

            // these should look differently in a clean data model
            // by blacklisting them we prevent accidental usage
            lastUpdatedSettingsViaBlocker: nobody,
            msg: nobody,
            projectMemberCount: nobody,
            updatedAt: nobody,
            wix_creation_date: nobody,

            // these have cleaner variants in the data model:
            subjects: nobody, // -> subjectsFormatted

            // these are associations which are wrongly in the TypeGraphQL generation
            // we do not have them enabled, also they are very technical and shall be replaced by semantic ones
            participation_certificate: nobody,
            project_match: nobody,
            pupil_tutoring_interest_confirmation_request: nobody,
            course_attendance_log: nobody,
            course_participation_certificate: nobody,
            subcourse_participants_pupil: nobody,
            subcourse_waiting_list_pupil: nobody,
            match: nobody
        })
    },

    // ATTENTION: Student entities can be seen by other users, e.g. through the Match -> student edge
    Student: {
        fields: withPublicFields<Student, "id" | "firstname" | "lastname" | "active" | "isStudent" | "isInstructor" | "isProjectCoach" | "isUniversityStudent" | "languages">({
            // authentication data shall only be accessible to the user itself
            authToken: onlyOwner,
            authTokenSent: onlyOwner,
            authTokenUsed: onlyOwner,

            email: adminOrOwner,
            phone: adminOrOwner,
            verification: adminOrOwner,
            verifiedAt: adminOrOwner,
            newsletter: adminOrOwner,
            openMatchRequestCount: adminOrOwner,
            state: adminOrOwner,
            university: adminOrOwner,
            module: adminOrOwner,
            moduleHours: adminOrOwner,
            createdAt: adminOrOwner,
            openProjectMatchRequestCount: adminOrOwner,
            certificate_of_conduct: adminOrOwner,

            // these have cleaner variants in the data model:
            subjects: nobody, // -> subjectsFormatted

            // these should look differently in a clean data model
            // by blacklisting them we prevent accidental usage
            msg: nobody,
            feedback: nobody,
            wasJufoParticipant: nobody,
            hasJufoCertificate: nobody,
            jufoPastParticipationConfirmed: nobody,
            jufoPastParticipationInfo: nobody,
            lastSentInstructorScreeningInvitationDate: nobody,
            lastSentJufoAlumniScreeningInvitationDate: nobody,
            lastSentScreeningInvitationDate: nobody,
            lastUpdatedSettingsViaBlocker: nobody,
            registrationSource: nobody,
            sentInstructorScreeningReminderCount: nobody,
            sentJufoAlumniScreeningReminderCount: nobody,
            sentScreeningReminderCount: nobody,
            supportsInDaZ: nobody,
            updatedAt: nobody,
            wix_creation_date: nobody,
            wix_id: nobody,

            // these are associations which are wrongly in the TypeGraphQL generation
            // we do not have them enabled, also they are very technical and shall be replaced by semantic ones
            screening: nobody,
            lecture: nobody,
            match: nobody,
            participation_certificate: nobody,
            project_coaching_screening: nobody,
            project_field_with_grade_restriction: nobody,
            project_match: nobody,
            subcourse_instructors_student: nobody,
            course: nobody,
            course_guest: nobody,
            course_instructors_student: nobody,
            course_participation_certificate: nobody,
            jufo_verification_transmission: nobody,
            expert_data: nobody,
            instructor_screening: nobody

        })

    },
    Subcourse: {
        fields: withPublicFields<Subcourse, "id" | "published" | "cancelled" | "course" | "courseId" | "createdAt" | "updatedAt" | "joinAfterStart" | "minGrade" | "maxGrade" | "maxParticipants">({
            course_participation_certificate: nobody,
            lecture: nobody,
            subcourse_instructors_student: nobody,
            subcourse_participants_pupil: nobody,
            subcourse_waiting_list_pupil: nobody
        })
    },
    Course: {
        fields: withPublicFields<Course, "id" | "name" | "outline" | "category" | "allowContact" | "courseState" | "publicRanking" | "description" | "createdAt" | "updatedAt">({
            screeningComment: adminOrOwner,
            correspondentId: adminOrOwner,

            course_guest: nobody,
            course_instructors_student: nobody,
            course_tags_course_tag: nobody,
            subcourse: nobody,
            student: nobody,
            imageKey: nobody
        })
    },
    Lecture: {
        fields: withPublicFields<Lecture, "id" | "start" | "duration" | "createdAt" | "updatedAt">({
            course_attendance_log: nobody,
            subcourseId: nobody,
            subcourse: nobody,
            student: nobody,
            instructorId: nobody
        })
    },
    Participation_certificate: {
        fields: {
            // these are Buffers and are not supposed to be retrieved directly by anyone (only rendered into a PDF)
            signatureParent: nobody,
            signaturePupil: nobody
        }
    }
};
