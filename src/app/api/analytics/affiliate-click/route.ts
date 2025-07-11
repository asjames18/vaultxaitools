import { NextResponse } from 'next/server';

export async function POST(request) {
  // Affiliate click tracking is temporarily disabled.
  return NextResponse.json({ message: 'Affiliate tracking is disabled.' }, { status: 200 });
}

export async function GET(request) {
  // The original GET function is commented out as the POST function is disabled.
  return NextResponse.json({ message: 'Affiliate click retrieval is disabled.' }, { status: 200 });
} 