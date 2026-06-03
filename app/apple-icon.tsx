import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          borderRadius: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Green badge */}
        <div
          style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #16a34a, #4ade80)',
            borderRadius: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            fontWeight: 900,
            color: '#000000',
            letterSpacing: '-1px',
          }}
        >
          M
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#4ade80',
            letterSpacing: '-0.3px',
            marginTop: '8px',
          }}
        >
          MIT
        </div>
      </div>
    ),
    { ...size }
  );
}
