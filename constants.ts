export const MONTHS = [
  "April", "May", "June", "July", "August", "September", 
  "October", "November", "December", "January", "February", "March"
];

// Map of Financial Year Start Year -> Interest Rate
// FY2022-23 starts in 2022
export const HISTORICAL_INTEREST_RATES: Record<number, number> = {
  2021: 8.10,
  2022: 8.15, // FY 2022-23
  2023: 8.25, // FY 2023-24
  2024: 8.25, // FY 2024-25 (Projected/Current)
  2025: 8.25, // Future projection
};

export const DEFAULT_INTEREST_RATE = 8.25;

export const DEFAULT_PROFILE = {
  employerName: "",
  joiningDate: "2022-04-06",
  endDate: "",
  targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
};