import type {
  AdminMember as ApiAdminMember,
  AdminMemberUpdate as ApiAdminMemberUpdate,
  Issue as ApiIssue,
  IssueLabel as ApiIssueLabel,
  IssueList as ApiIssueList,
  Member as ApiMember,
  Profile as ApiProfile,
  ProfileUpdate as ApiProfileUpdate,
  Project as ApiProject,
} from "@gov-portal/api-client";
import type {
  AdminMemberDto,
  AdminMemberUpdate,
  IssueDto,
  IssueLabelDto,
  IssueListDto,
  ProfileUpdate,
  ProjectDto,
  PublicMemberDto,
  SelfMemberDto,
} from "@gov-portal/shared";

type MutuallyAssignable<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false;

type Assert<Condition extends true> = Condition;

/**
 * Keeps the runtime-validated service DTOs structurally aligned with the
 * OpenAPI-generated boundary types. Constraint-level parity remains covered by
 * the OpenAPI linter and the Zod validation tests.
 */
export type ApiContractCompatibility = [
  Assert<MutuallyAssignable<PublicMemberDto, ApiMember>>,
  Assert<MutuallyAssignable<SelfMemberDto, ApiProfile>>,
  Assert<MutuallyAssignable<AdminMemberDto, ApiAdminMember>>,
  Assert<MutuallyAssignable<ProfileUpdate, ApiProfileUpdate>>,
  Assert<MutuallyAssignable<AdminMemberUpdate, ApiAdminMemberUpdate>>,
  Assert<MutuallyAssignable<ProjectDto, ApiProject>>,
  Assert<MutuallyAssignable<IssueDto, ApiIssue>>,
  Assert<MutuallyAssignable<IssueLabelDto, ApiIssueLabel>>,
  Assert<MutuallyAssignable<IssueListDto, ApiIssueList>>,
];
