import { useState, useEffect } from 'react'
import './AccessibilitySettings.css'

interface AccessibilitySettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const [textSize, setTextSize] = useState('normal')
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTextSize = localStorage.getItem('accessibility-text-size') || 'normal'
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true'
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true'

    setTextSize(savedTextSize)
    setHighContrast(savedHighContrast)
    setReducedMotion(savedReducedMotion)

    // Apply settings to document
    applyAccessibilitySettings(savedTextSize, savedHighContrast, savedReducedMotion)
  }, [])

  const applyAccessibilitySettings = (size: string, contrast: boolean, motion: boolean) => {
    const root = document.documentElement
    
    // Remove existing classes
    root.classList.remove('text-size-small', 'text-size-normal', 'text-size-large', 'text-size-xl')
    root.classList.remove('high-contrast')
    root.classList.remove('reduced-motion')
    
    // Apply text size
    root.classList.add(`text-size-${size}`)
    
    // Apply high contrast
    if (contrast) {
      root.classList.add('high-contrast')
    }
    
    // Apply reduced motion
    if (motion) {
      root.classList.add('reduced-motion')
    }
  }

  const handleTextSizeChange = (size: string) => {
    setTextSize(size)
    localStorage.setItem('accessibility-text-size', size)
    applyAccessibilitySettings(size, highContrast, reducedMotion)
  }

  const handleHighContrastToggle = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem('accessibility-high-contrast', newValue.toString())
    applyAccessibilitySettings(textSize, newValue, reducedMotion)
  }

  const handleReducedMotionToggle = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem('accessibility-reduced-motion', newValue.toString())
    applyAccessibilitySettings(textSize, highContrast, newValue)
  }

  const resetToDefaults = () => {
    setTextSize('normal')
    setHighContrast(false)
    setReducedMotion(false)
    
    localStorage.setItem('accessibility-text-size', 'normal')
    localStorage.setItem('accessibility-high-contrast', 'false')
    localStorage.setItem('accessibility-reduced-motion', 'false')
    
    applyAccessibilitySettings('normal', false, false)
  }

  if (!isOpen) return null

  return (
    <div className="accessibility-settings-overlay">
      <div className="accessibility-settings-backdrop" onClick={onClose} />
      
      <div className="accessibility-settings-panel">
        <div className="settings-header">
          <h2>Accessibility Settings</h2>
          <button className="close-button" onClick={onClose} aria-label="Close settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <h3>Text Size</h3>
            <p className="setting-description">Adjust text size for better readability on your TV screen</p>
            <div className="text-size-options">
              {[
                { value: 'small', label: 'Small' },
                { value: 'normal', label: 'Normal' },
                { value: 'large', label: 'Large' },
                { value: 'xl', label: 'Extra Large' }
              ].map((option) => (
                <button
                  key={option.value}
                  className={`text-size-button ${textSize === option.value ? 'active' : ''}`}
                  onClick={() => handleTextSizeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <h3>High Contrast</h3>
            <p className="setting-description">Increase contrast for better visibility</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={handleHighContrastToggle}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Enable high contrast mode</span>
            </label>
          </div>

          <div className="setting-group">
            <h3>Reduce Motion</h3>
            <p className="setting-description">Minimize animations and motion effects</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={handleReducedMotionToggle}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Reduce motion and animations</span>
            </label>
          </div>

          <div className="settings-actions">
            <button className="reset-button" onClick={resetToDefaults}>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}