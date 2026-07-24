import type { Setlist } from "@/types";
import { mockSongs } from "./mock-songs";

const byId = (id: string) => mockSongs.find((s) => s.id === id)!;

export const mockSetlists: Setlist[] = [
  {
    id: "sl1",
    title: "Sunday Morning Gathering",
    date: "2026-07-27",
    serviceType: "Sunday Service",
    notes: "First Sunday of the month — communion after the response song.",
    createdBy: "u1",
    createdByName: "Samantha Reyes",
    sharedWith: ["u2", "u3", "u4", "u5", "u6"],
    songs: [
      { id: "ss1", setlistId: "sl1", songId: "s7", orderNumber: 1, song: byId("s7") },
      { id: "ss2", setlistId: "sl1", songId: "s9", orderNumber: 2, song: byId("s9") },
      { id: "ss3", setlistId: "sl1", songId: "s8", orderNumber: 3, song: byId("s8"), notes: "Slow intro on piano" },
      { id: "ss4", setlistId: "sl1", songId: "s6", orderNumber: 4, song: byId("s6") },
      { id: "ss5", setlistId: "sl1", songId: "s1", orderNumber: 5, song: byId("s1"), keyOverride: "A" },
    ],
  },
  {
    id: "sl2",
    title: "Midweek Prayer Night",
    date: "2026-07-30",
    serviceType: "Prayer Night",
    notes: "Keep it simple — acoustic only.",
    createdBy: "u2",
    createdByName: "Daniel Cho",
    sharedWith: ["u1", "u3"],
    songs: [
      { id: "ss6", setlistId: "sl2", songId: "s2", orderNumber: 1, song: byId("s2") },
      { id: "ss7", setlistId: "sl2", songId: "s3", orderNumber: 2, song: byId("s3") },
    ],
  },
  {
    id: "sl3",
    title: "Christmas Eve Candlelight",
    date: "2025-12-24",
    serviceType: "Special Service",
    notes: "Candles handed out during Silent Night — dim stage lights.",
    createdBy: "u1",
    createdByName: "Samantha Reyes",
    sharedWith: ["u2", "u3", "u4", "u5", "u6"],
    songs: [
      { id: "ss8", setlistId: "sl3", songId: "s5", orderNumber: 1, song: byId("s5") },
      { id: "ss9", setlistId: "sl3", songId: "s4", orderNumber: 2, song: byId("s4") },
      { id: "ss10", setlistId: "sl3", songId: "s10", orderNumber: 3, song: byId("s10") },
    ],
  },
];

export function getSetlistById(id: string) {
  return mockSetlists.find((s) => s.id === id);
}
