import { NextResponse } from 'next/server';
import { carApiNames } from '@/lib/Carapi';
// GET /api/cars/models?make=Toyota&year=2018
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make')?.trim();
  const year = searchParams.get('year');

  if (!make) {
    return NextResponse.json({ message: 'make is required.' }, { status: 400 });
  }
  if (year && !/^\d{4}$/.test(year)) {
    return NextResponse.json({ message: 'Invalid year.' }, { status: 400 });
  }

  try {
    const params = year ? { make, year } : { make };
    const models = await carApiNames('/api/models/v2', params);
    return NextResponse.json({ models });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Could not load car models.' }, { status: 502 });
  }
}