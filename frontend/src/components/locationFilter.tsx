import React ,{useState, useEffect} from "react";
import AdditionalSettings from "./AdditionalSettings.tsx";
import { FilterSetting } from "../../../shared/types.ts";

// use local storage maybe?
const EXPIRY_TIME = 1000 * 20
const LocationFilter: React.FC = () => {
    const initializations = () => {
        // setTimeout if localStorage is not available
        const savedFilter = localStorage.getItem('filter');
        const savedTimestamp = localStorage.getItem('filterTimestamp');
        const currentTime = new Date().getTime();
        if (savedFilter && savedTimestamp) {
            if (currentTime - parseInt(savedTimestamp) < EXPIRY_TIME) {
                return JSON.parse(localStorage.getItem('filter') as string)
            }
        
            else {
                localStorage.removeItem('filter');
                localStorage.removeItem('filterTimestamp');
                console.log("initiliase")
 
            }
        }
        return {state: "", suburb: "", zip: "", bedrooms: "", bathrooms: "", garage: "",priceMin: "",
        priceMax: "",
        areaMin: "",
        areaMax: "",};
    }
    
    const [filter, setFilter] = useState<FilterSetting>(initializations);
    const [showSettings, setShowSettings] = useState(false)

    const handleFilterChange = (event:  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const target = event.target;
        const name = target.name;
        //console.log('hello', name);
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: target.value
    }));
    };
    const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log(filter);
        fetch("http://localhost:5000/hi", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }
    useEffect(() => {
      localStorage.setItem('filter', JSON.stringify(filter));
    }, [filter]);
    const handleSettingOnclick = (event) => {
        setShowSettings(!showSettings)
    }
    const toggleSettings = () => {
        setShowSettings(!showSettings)
    }

  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentTime = new Date().getTime();
      localStorage.setItem('filterTimestamp', currentTime.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);



    return (
      <div>
        <label id = "state-label">State:</label>
        <select id="state-input" name = "state" value={filter?.state} onChange={handleFilterChange}>
          <option value="">All Locations</option>
          <option value="NSW">New South Wales</option>
          <option value="VIC">Victoria</option>
          <option value="QLD">Queensland</option>
          <option value="SA">South Australia</option>
          <option value="WA">Western Australia</option>
          <option value="TAS">Tasmania</option>
          <option value="NT">Northern Territory</option>
          <option value="ACT">Australian Capital Territory</option>
        </select>
        <label id = "suburb-label">Suburb:</label>
        <input type="text" id = "suburb-input" name = "suburb" value={filter.suburb} onChange={handleFilterChange}/>
        <label id = "zip-label">Zip:</label>
        <input type="text" id = "zip-input" name = "zip" value={filter.zip} onChange={handleFilterChange}/>
        <button className="settings" type="button" onClick={handleSettingOnclick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    </svg>
        </button>
        {showSettings && (
        <AdditionalSettings
        filter={filter}
        onFilterChange={handleFilterChange}
        onClose={toggleSettings}
      />)}
        <button name = "submit-button" onClick={handleSubmit}>Search!</button>
      </div>
    );
  };
  
  export default LocationFilter;