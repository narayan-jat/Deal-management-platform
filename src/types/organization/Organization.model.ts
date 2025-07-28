
export enum OrganizationRole {
  ADMIN,
  MEMBER,
  LEADER,
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
  createdAt: string;
  updatedAt: string;
}
