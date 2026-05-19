import api from "./api";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Booking {
  id: number;
  customer_id: number;
  business_id: number;
  service_id: number | null;
  staff_id: number | null;
  slot_datetime: string;
  duration_minutes: number;
  status: BookingStatus;
  price: number | null;
  deposit_amount: number | null;
  deposit_paid: boolean;
  customer_notes: string | null;
  created_at: string;
}

export async function getMyBookings(status?: BookingStatus): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/bookings/my", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function cancelBooking(id: number): Promise<void> {
  await api.delete(`/bookings/${id}`);
}
