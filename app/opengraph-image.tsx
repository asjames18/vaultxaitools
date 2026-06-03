import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Melanated In Tech — Learn Tech. Build Skills. Create Opportunities.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(74, 222, 128, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orb top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Top: Logo + Brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, #22c55e, #4ade80)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 900,
              color: '#000',
              letterSpacing: '-0.5px',
            }}
          >
            MIT
          </div>
          <span
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.3px',
            }}
          >
            Melanated In Tech
          </span>
        </div>

        {/* Center: Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1, maxWidth: '900px' }}>
          <div
            style={{
              fontSize: '68px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-2px',
            }}
          >
            Learn Tech.{' '}
            <span style={{ color: '#4ade80' }}>Build Skills.</span>
            {'\n'}Create Opportunities.
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#9ca3af',
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: '720px',
            }}
          >
            AI tools, automation, software development, and emerging technology — all in one place.
          </div>
        </div>

        {/* Bottom: Pill tags */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', zIndex: 1 }}>
          {['AI Tools', 'Automation', 'AI Agents', 'Dev Tools', 'Tutorials'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 18px',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '100px',
                fontSize: '16px',
                color: '#4ade80',
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
