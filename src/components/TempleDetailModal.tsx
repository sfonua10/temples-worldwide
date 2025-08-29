import { useEffect, useRef } from 'react'
import type { Temple } from '../types/temple'
import { OverviewCard } from './OverviewCard'
import { LocationCard } from './LocationCard'
import { FacilitiesCard } from './FacilitiesCard'
import { HistoryCard } from './HistoryCard'
import { ImageGallery } from './ImageGallery'
import './TempleDetailModal.css'

interface TempleDetailModalProps {
  temple: Temple | null
  onClose: () => void
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void
}

export function TempleDetailModal({ temple, onClose, onNavigate }: TempleDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (temple && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [temple])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!temple) return

      switch (e.key) {
        case 'Escape':
        case 'Backspace':
          onClose()
          break
        case 'ArrowLeft':
          onNavigate?.('left')
          break
        case 'ArrowRight':
          onNavigate?.('right')
          break
        case 'ArrowUp':
          onNavigate?.('up')
          break
        case 'ArrowDown':
          onNavigate?.('down')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [temple, onClose, onNavigate])

  if (!temple) return null




  return (
    <div className="temple-detail-modal" ref={modalRef}>
      <div className="modal-backdrop" onClick={onClose} />
      
      <div className="modal-content">
        <button 
          ref={closeButtonRef}
          className="modal-close-button" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-hero-section">
          <ImageGallery temple={temple} />
          <div className="hero-content">
            <h1 className="temple-title">{temple.name}</h1>
            <p className="temple-location">
              {temple.location.city}, {temple.location.state || temple.location.region || temple.location.province}
            </p>
          </div>
        </div>

        <div className="modal-info-section">
          <div className="cards-container">
            <OverviewCard temple={temple} />
            <LocationCard temple={temple} />
            <FacilitiesCard temple={temple} />
            <HistoryCard temple={temple} />
          </div>

          <div className="navigation-hint">
            <span>Press <kbd>ESC</kbd> to close</span>
            <span>Use <kbd>←</kbd> <kbd>→</kbd> to navigate temples</span>
          </div>
        </div>
      </div>
    </div>
  )
}