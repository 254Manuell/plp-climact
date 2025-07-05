import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

const allowedRoles = ["premium", "enterprise", "admin"]

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  // Fetch user role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()
  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 403 })
  }
  if (!allowedRoles.includes(userData.role)) {
    return NextResponse.json({ error: "Upgrade to premium to access downloadable reports." }, { status: 403 })
  }
  // Parse request body
  const { format, startDate, endDate, location } = await req.json()
  // TODO: Fetch pollution data for the user/date range/location
  // TODO: Generate PDF or CSV
  if (format === "csv") {
    // Placeholder CSV
    const csv = "timestamp,location,pm25,no2,co,aqi,status\n2024-01-01T12:00:00Z,Nairobi,55,40,30,80,Good"
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=air_quality_report.csv`,
      },
    })
  } else if (format === "pdf") {
    // Placeholder PDF (return a simple PDF file)
    const pdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 100 Td (Air Quality Report) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000211 00000 n \ntrailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n285\n%%EOF")
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=air_quality_report.pdf`,
      },
    })
  } else {
    return NextResponse.json({ error: "Invalid format. Use 'pdf' or 'csv'." }, { status: 400 })
  }
} 