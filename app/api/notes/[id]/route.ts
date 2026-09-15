import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'https://notehub-api.goit.study';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();

    const backendResponse = await fetch(`${BACKEND_URL}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Cookie': cookieStore.toString(), // Передаем все куки (accessToken и refreshToken)
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();

    const backendResponse = await fetch(`${BACKEND_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookieStore.toString(), // Передаем все куки
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete note' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}