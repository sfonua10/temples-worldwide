import type { Temple } from '../types/temple'
import './InfoCard.css'

interface FacilitiesCardProps {
  temple: Temple
}

export function FacilitiesCard({ temple }: FacilitiesCardProps) {
  const facilities = temple.details

  if (!facilities) return null

  const availableFacilities = [
    { key: 'visitorCenter', label: 'Visitor Center', value: facilities.visitorCenter },
    { key: 'distribution', label: 'Distribution Center', value: facilities.distribution },
    { key: 'patronHousing', label: 'Patron Housing', value: facilities.patronHousing },
    { key: 'cafeteria', label: 'Cafeteria', value: facilities.cafeteria },
    { key: 'clothing', label: 'Clothing Rental', value: facilities.clothing }
  ].filter(facility => facility.value === true)

  if (availableFacilities.length === 0) return null

  return (
    <div className="info-card facilities-card">
      <div className="card-header">
        <h3>Available Facilities</h3>
      </div>
      
      <div className="card-content">
        <div className="facilities-grid">
          {availableFacilities.map((facility) => (
            <div key={facility.key} className="facility-item">
              <div className="facility-icon">✓</div>
              <span className="facility-label">{facility.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}