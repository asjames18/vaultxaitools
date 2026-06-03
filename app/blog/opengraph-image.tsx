import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Tutorials & Blog — Melanated In Tech';
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
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
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
            📚 Tutorials &amp; Blog
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
            Learn AI &amp; Tech{'\n'}
            <span style={{ color: '#4ade80' }}>Step by Step</span>
          </div>
          <div style={{ fontSize: '22px', color: '#6b7280', maxWidth: '700px' }}>
            Practical tutorials on AI, automation, prompt engineering, and software development.
          </div>
        </div>

        {/* Bottom tags */}
        <div style={{ display: 'flex', gap: '10px', zIndex: 1 }}>
          {['Prompt Engineering', 'AI Agents', 'Automation', 'No-Code', 'Dev Tips'].map((t) => (
            <div
              key={t}
              style={{
                padding: '7px 16px',
                background: 'rgba(74, 222, 128, 0.08)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                borderRadius: '100px',
                fontSize: '14px',
                color: '#4ade80',
                fontWeight: 500,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
