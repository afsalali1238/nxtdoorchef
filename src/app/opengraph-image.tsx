import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'NextDoorChef'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F9F6F0',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 40 }}>🍽️</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#1A1A1A',
            marginBottom: 20,
          }}
        >
          NextDoor<span style={{ color: '#E8960A' }}>Chef</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#666666',
          }}
        >
          Discover authentic home chefs near you in Dubai
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
