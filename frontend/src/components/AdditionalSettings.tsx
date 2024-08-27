import React from "react";

interface AdditionalSettingsProps {
  filter: {
    bedrooms: string;
    bathrooms: string;
    garage: string;
    priceMin: string;
    priceMax: string;
    areaMin: string;
    areaMax: string;
  };
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

const AdditionalSettings: React.FC<AdditionalSettingsProps> = ({ filter, onFilterChange, onClose }) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const settingsStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    height: '80%',
    overflowY: 'auto',
    zIndex: 1001
  };

  const closeButtonStyle: React.CSSProperties = {
    marginTop: '20px'
  };
  return (
    <div className="overlay" style={overlayStyle}>
      <div className="additional-settings" style={settingsStyle}>
        <label id="bedrooms-label">Bedrooms:</label>
        <input type="number" id="bedrooms-input" name="bedrooms" value={filter.bedrooms} onChange={onFilterChange} />
        <label id="bathrooms-label">Bathrooms:</label>
        <input type="number" id="bathrooms-input" name="bathrooms" value={filter.bathrooms} onChange={onFilterChange} />
        <label id="garage-label">Garage:</label>
        <input type="number" id="garage-input" name="garage" value={filter.garage} onChange={onFilterChange} />
        <label id="priceMin-label">Min Price:</label>
        <input type="number" id="priceMin-input" name="priceMin" value={filter.priceMin} onChange={onFilterChange} />
        <label id="priceMax-label">Max Price:</label>
        <input type="number" id="priceMax-input" name="priceMax" value={filter.priceMax} onChange={onFilterChange} />
        <label id="areaMin-label">Min Area (sq ft):</label>
        <input type="number" id="areaMin-input" name="areaMin" value={filter.areaMin} onChange={onFilterChange} />
        <label id="areaMax-label">Max Area (sq ft):</label>
        <input type="number" id="areaMax-input" name="areaMax" value={filter.areaMax} onChange={onFilterChange} />
        <button className="close-settings" onClick={onClose} style={closeButtonStyle}>Close</button>
      </div>
    </div>
  );
};

export default AdditionalSettings;
