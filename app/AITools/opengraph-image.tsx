import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AI Tools Directory — Melanated In Tech';
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
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(74, 222, 128, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Top: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #22c55e, #4ade80)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 900,
              color: '#000',
            }}
          >
            MIT
          </div>
          <span style={{ fontSize: '22px', fontWeight: 600, color: '#9ca3af' }}>
            Melanated In Tech
          </span>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1 }}>
          <div style={{ fontSize: '20px', color: '#4ade80', fontWeight: 600 }}>
            🤖 AI Tools Directory
          </div>
          <div
            style={{
              fontSize: '62px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-2px',
            }}
          >
            Discover &amp; Compare{'\n'}
            <span style={{ color: '#4ade80' }}>the Best AI Tools</span>
          </div>
          <div style={{ fontSize: '22px', color: '#6b7280', maxWidth: '700px' }}>
            Curated AI tools, automation platforms, and development resources — vetted and ready to use.
          </div>
        </div>

        {/* Bottom categories */}
        <div style={{ display: 'flex', gap: '10px', zIndex: 1 }}>
          {['AI Tools', 'AI Agents', 'Automation', 'Dev Tools', 'Productivity', 'Content'].map((c) => (
            <div
              key={c}
              style={{
                padding: '7px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                fontSize: '14px',
                color: '#d1d5db',
                fontWeight: 500,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
