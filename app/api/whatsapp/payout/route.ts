import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawHostId = searchParams.get("host_id");
    const rawBookingId = searchParams.get("booking_id");

    if (!rawHostId && !rawBookingId) {
      return NextResponse.json(
        { error: "Host ID atau Booking ID diperlukan" },
        { status: 400 }
      );
    }

    // Normalisasi input (contoh: "Host 101", "HOST101" -> "HOST-101")
    const normalizeKey = (key: string | null) => {
      if (!key) return "";
      let clean = key.toUpperCase().trim().replace(/\s+/g, "");
      if (clean.startsWith("HOST") && !clean.includes("-")) {
        clean = clean.replace("HOST", "HOST-");
      }
      if (clean.startsWith("BK") && !clean.includes("-")) {
        clean = clean.replace("BK", "BK-2026-");
      }
      return clean;
    };

    const searchKey = normalizeKey(rawHostId) || normalizeKey(rawBookingId);

    // Mock Data Host
    const mockPayouts: Record<string, any> = {
      "HOST-101": {
        booking_id: "BK-2026-001",
        host_name: "Pak Budi / Encik Rashid",
        property_name: "Ubud Sanctuary Villa / Penang Heritage Villa",
        payout_status: "Sedang diproses",
        amount: "IDR 12.500.000 / MYR 3,450",
        bank_name: "BCA / Maybank",
        account_ending: "4109",
        expected_date: "Besok sebelum jam 17:00",
        delay_reason: "Proses kliring bank karena hari libur nasional"
      },
      "BK-2026-001": {
        booking_id: "BK-2026-001",
        host_name: "Pak Budi / Encik Rashid",
        property_name: "Ubud Sanctuary Villa / Penang Heritage Villa",
        payout_status: "Sedang diproses",
        amount: "IDR 12.500.000 / MYR 3,450",
        bank_name: "BCA / Maybank",
        account_ending: "4109",
        expected_date: "Besok sebelum jam 17:00",
        delay_reason: "Proses kliring bank karena hari libur nasional"
      }
    };

    const payoutData = mockPayouts[searchKey];

    if (!payoutData) {
      return NextResponse.json({
        success: false,
        message: `Data pencairan dana tidak ditemukan untuk ID ${searchKey}.`
      });
    }

    return NextResponse.json({
      success: true,
      data: payoutData
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
