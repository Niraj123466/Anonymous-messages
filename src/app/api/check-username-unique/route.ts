// app/api/check-username-unique/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

// Mark the route as dynamic to suppress DYNAMIC_SERVER_USAGE warning
export const dynamic = 'force-dynamic';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // Validate username
    const validation = UsernameQuerySchema.safeParse({ username });
    if (!validation.success) {
      const usernameErrors = validation.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await UserModel.findOne({
      username: validation.data.username,
      isVerified: true,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    // Username is available
    return NextResponse.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
