export type SongCategory =
  | "Praise"
  | "Worship"
  | "Hymn"
  | "Contemporary"
  | "Christmas"
  | "Communion"
  | "Response";

export type PermissionType = "viewer" | "editor";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: "leader" | "member" | "admin";
  instrument?: string | null;
  teamId?: string | null;
}

export interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string;
  key: string;
  bpm: number | null;
  capo: number;
  category: SongCategory;
  /** ChordPro-style body: chords inline in brackets, e.g. "[G]Amazing [C]grace" */
  chordSheet: string;
  notes?: string;
  tags?: string[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  timesPlayed?: number;
  duration?: string;
}

export interface SetlistSong {
  id: string;
  setlistId: string;
  songId: string;
  orderNumber: number;
  song: Song;
  keyOverride?: string;
  notes?: string;
}

export interface Setlist {
  id: string;
  title: string;
  date: string;
  serviceType?: string;
  notes?: string;
  createdBy: string;
  createdByName: string;
  songs: SetlistSong[];
  sharedWith?: string[];
}

export interface SharedPermission {
  id: string;
  songId: string;
  userId: string;
  userEmail: string;
  permissionType: PermissionType;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  instrument: string;
  role: "leader" | "member";
}
