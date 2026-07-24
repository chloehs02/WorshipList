import type { UserProfile, TeamMember } from "@/types";

export const currentUser: UserProfile = {
  id: "u1",
  name: "Samantha Reyes",
  email: "samantha@gracechapel.org",
  role: "leader",
  instrument: "Acoustic Guitar",
  teamId: "t1",
  avatarUrl: null,
};

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Samantha Reyes", email: "samantha@gracechapel.org", instrument: "Acoustic Guitar", role: "leader" },
  { id: "u2", name: "Daniel Cho", email: "daniel@gracechapel.org", instrument: "Keys", role: "member" },
  { id: "u3", name: "Priya Nair", email: "priya@gracechapel.org", instrument: "Vocals", role: "member" },
  { id: "u4", name: "Marcus Bell", email: "marcus@gracechapel.org", instrument: "Bass", role: "member" },
  { id: "u5", name: "Elena Ruiz", email: "elena@gracechapel.org", instrument: "Drums", role: "member" },
  { id: "u6", name: "Josh Tanaka", email: "josh@gracechapel.org", instrument: "Electric Guitar", role: "member" },
];
