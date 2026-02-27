export type BookingAvailabilityDay = {
  date: string;
  bookedSlots: string[];
  availableSlots: string[];
  bookingsCount: number;
  isFullyBooked: boolean;
};

export type BookingAvailability = {
  month: string;
  slots: string[];
  dates: BookingAvailabilityDay[];
};
