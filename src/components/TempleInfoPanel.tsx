import type { Temple } from '../types/temple'
import './TempleInfoPanel.css'

interface TempleInfoPanelProps {
  temple: Temple | null
  onClose: () => void
}

export function TempleInfoPanel({ temple, onClose }: TempleInfoPanelProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'To be announced'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className={`temple-info-panel ${temple ? 'open' : ''}`}>
      {temple && (
        <>
          <button 
            className="close-button" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            aria-label="Close panel"
          >
            ×
          </button>
          <div className="temple-info-content">
            <h2>{temple.name}</h2>
          
          <div className="info-section">
            <h3>Location</h3>
            <p>{temple.location.city}, {temple.location.state || temple.location.region || temple.location.province}</p>
            <p>{temple.location.country}</p>
          </div>

          <div className="info-section">
            <h3>Address</h3>
            <p>{temple.address}</p>
          </div>

          <div className="info-section">
            <h3>Dedication Date</h3>
            <p>{formatDate(temple.dedicationDate)}</p>
          </div>

          <div className="info-section">
            <h3>Status</h3>
            <p className={`status status-${temple.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {temple.status}
            </p>
          </div>
        </div>
        </>
      )}
    </div>
  )
}