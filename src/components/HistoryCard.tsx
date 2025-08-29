import type { Temple } from '../types/temple'
import './InfoCard.css'

interface HistoryCardProps {
  temple: Temple
}

export function HistoryCard({ temple }: HistoryCardProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const history = temple.history
  if (!history) return null

  const hasHistoryData = history.groundbreaking || history.publicOpenHouse || 
                        history.rededication || history.renovation

  if (!hasHistoryData) return null

  return (
    <div className="info-card history-card">
      <div className="card-header">
        <h3>Temple History</h3>
      </div>
      
      <div className="card-content">
        <div className="timeline">
          {history.groundbreaking && (
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-label">Groundbreaking</span>
                <span className="timeline-date">{formatDate(history.groundbreaking)}</span>
              </div>
            </div>
          )}
          
          {temple.dedicationDate && (
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-label">Dedication</span>
                <span className="timeline-date">{formatDate(temple.dedicationDate)}</span>
              </div>
            </div>
          )}
          
          {history.publicOpenHouse && (
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-label">Public Open House</span>
                <span className="timeline-date">
                  {formatDate(history.publicOpenHouse.start)} - {formatDate(history.publicOpenHouse.end)}
                </span>
              </div>
            </div>
          )}
          
          {history.rededication && (
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-label">Rededication</span>
                <span className="timeline-date">{formatDate(history.rededication)}</span>
              </div>
            </div>
          )}
          
          {history.renovation?.start && (
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-label">Renovation</span>
                <span className="timeline-date">
                  {formatDate(history.renovation.start)} 
                  {history.renovation.end && ` - ${formatDate(history.renovation.end)}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}