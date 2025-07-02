/* eslint-disable @typescript-eslint/no-explicit-any */

import { fakerID_ID as faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

type FakerConfig = {
  faker_type: string;
  faker_helper?: string[];
  field_name: string;
};

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);
  const length = isNaN(limitParam) ? 10 : limitParam;

  let config: FakerConfig[] = [];

  try {
    config = await req.json();
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: 'Invalid or empty JSON body' },
      { status: 400 }
    );
  }

  if (!Array.isArray(config) || config.length === 0) {
    return NextResponse.json(
      { error: 'Invalid or empty config array' },
      { status: 400 }
    );
  }

  const results = Array.from({ length }, () => {
    const item: Record<string, any> = {};

    for (const { faker_type, faker_helper, field_name } of config) {
      let value: any;

      for (const nsKey of Object.keys(faker)) {
        const namespace = (faker as any)[nsKey];
        if (
          namespace &&
          typeof namespace === 'object' &&
          typeof namespace[faker_type] === 'function'
        ) {
          try {
            let args: any[] = [];

            if (faker_helper != null) {
              if (faker_type === "arrayElement") {
                args = [faker_helper];
              } else if (Array.isArray(faker_helper)) {
                args = [...faker_helper];
              } else {
                args = [faker_helper];
              }
            }

            value = namespace[faker_type](...args);
            break;
          } catch (e) {
            value = `Error: ${(e as Error).message}`;
          }
        }
      }

      if (value === undefined && typeof (faker as any)[faker_type] === 'function') {
        try {
          let args: any[] = [];

          if (faker_helper != null) {
            if (faker_type === "arrayElement") {
              args = [faker_helper];
            } else if (Array.isArray(faker_helper)) {
              args = [...faker_helper];
            } else {
              args = [faker_helper];
            }
          }

          value = (faker as any)[faker_type](...args);
        } catch (e) {
          value = `Error: ${(e as Error).message}`;
        }
      }

      const field = field_name || faker_type || 'unknown';
      item[field] = value ?? `Invalid faker_type: ${faker_type}`;
    }

    return item;
  });

  return NextResponse.json(results, { status: 200 });
}