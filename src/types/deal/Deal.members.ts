import { DealMemberRole } from './Deal.enums';

export type DealMember = {
  id: string;
  dealId: string; // deal_id
  memberId: string; // member_id
  addedBy: string; // added_by
  role: DealMemberRole;
  addedAt: string; // added_at
  updatedAt: string; // updated_at
};

// For showing in UI
export type DealMemberWithProfile = DealMember & {
  profile: {
    name: string;
    email: string;
    profilePhoto: string;
  };
};

export type Contributor = {
  id: string;
  name: string;
  email: string;
  title: string;
  profilePhoto: string;
  role: string;
}

// For invite form
export type InviteMemberForm = Partial<Contributor> & {
  email?: string;
};
