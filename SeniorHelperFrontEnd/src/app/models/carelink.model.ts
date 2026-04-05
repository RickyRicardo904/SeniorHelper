export interface CareLinkModel {
  userId: number;
  caregiverName: string; // for display
  role: string;          // e.g., "Caregiver" or "Family"
  connectedSince: string; // ISO date string
}
