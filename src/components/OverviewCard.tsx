import type { Temple } from '../types/temple'
import './InfoCard.css'

interface OverviewCardProps {
  temple: Temple
}

export function OverviewCard({ temple }: OverviewCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'To be announced'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div className="info-card overview-card">
      <div className="card-header">
        <h3>Temple Overview</h3>
      </div>
      
      <div className="card-content">
        <div className="overview-grid">
          <div className="overview-item">
            <span className="label">Status</span>
            <span className={`temple-status status-${getStatusClass(temple.status)}`}>
              {temple.status}
            </span>
          </div>
          
          <div className="overview-item">
            <span className="label">Dedicated</span>
            <span className="value">{formatDate(temple.dedicationDate)}</span>
          </div>
          
          {temple.details?.architect && (
            <div className="overview-item">
              <span className="label">Architect</span>
              <span className="value">{temple.details.architect}</span>
            </div>
          )}
          
          {temple.details?.totalFloorArea && (
            <div className="overview-item">
              <span className="label">Floor Area</span>
              <span className="value">{temple.details.totalFloorArea}</span>
            </div>
          )}
          
          {temple.details?.numberOfOrdinanceRooms && (
            <div className="overview-item">
              <span className="label">Ordinance Rooms</span>
              <span className="value">{temple.details.numberOfOrdinanceRooms}</span>
            </div>
          )}
          
          {temple.details?.numberOfSeatingRooms && (
            <div className="overview-item">
              <span className="label">Sealing Rooms</span>
              <span className="value">{temple.details.numberOfSeatingRooms}</span>
            </div>
          )}
        </div>
        
        {temple.details?.description && (
          <div className="description">
            <p>{temple.details.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}