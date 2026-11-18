import { NextResponse } from 'next/server';

// Retired: the former endpoint trusted booking and amount identifiers supplied
// by the browser. New checkout uses a server-created order and capture route.
export async function POST() {
  return NextResponse.json(
    { error: 'This payment verification endpoint is retired. Please restart checkout.' },
    { status: 410 }
  );
}
