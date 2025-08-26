import React from 'react'
import Mission from "./Mission"
import Vision from "./Vision"

export default function MissionAndVision() {
  return (
    <div>
      <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #ffeeba' }}>
        <strong>Warning:</strong> This section is temporarily hidden from the website. We'll bring it back soon!
      </div>
      <Mission/>
      <Vision/>
    </div>
  )
}
