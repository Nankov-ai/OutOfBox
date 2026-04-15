'use client'

import { useState } from 'react'

export default function AiBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div style={{
      background: '#0a0f1e',
      borderBottom: '1px solid rgba(99,102,241,.2)',
      padding: '.4rem clamp(1rem, 4vw, 2rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>
      <span style={{ fontSize: '.65rem', color: '#64748b', letterSpacing: '.06em', lineHeight: 1.5, fontFamily: 'monospace' }}>
        <strong style={{ color: 'rgba(99,102,241,.85)', fontWeight: 600 }}>Aviso AI Act (UE) 2024/1689 · Art. 50</strong>
        {' '}— Esta aplicação utiliza inteligência artificial generativa. As respostas são geradas automaticamente e podem conter imprecisões. Não substituem apoio psicológico ou aconselhamento profissional.
      </span>
      <button
        onClick={() => setVisible(false)}
        aria-label="Fechar aviso"
        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '.9rem', flexShrink: 0 }}
      >
        ✕
      </button>
    </div>
  )
}
