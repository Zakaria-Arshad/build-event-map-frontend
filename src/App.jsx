import './App.css'
import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useEvents } from './EventContext'
import FetchedEventBox from './FetchedEventBox'

function App() {
  const { allEvents, addEvent, addAllEvents, deleteEvent } = useEvents() // eventInfo = all events, addEvent = function
  const [fetchedEvents, setFetchedEvents] = useState([])
  const [currentMapId, setCurrentMapId] = useState("No map ID");
  const [searchValue, setSearchValue] = useState("");
  const [generatedSchedule, setGeneratedSchedule] = useState("");
  const [isLoading, setIsLoading] = useState(false); // isLoading for fetching events
  const [fetchMapValue, setFetchMapValue] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  }, [allEvents, fetchedEvents]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value); // update state with the input's new value
  };

  const handleFetchMapChange = (event) => {
    setFetchMapValue(event.target.value)
  }

  const handleSubmit = async(event) => {
    event.preventDefault()
    if (searchValue !== "") {
      fetchEvents()
    }
    setSearchValue("")
  }

  const handleMarkerClick = (event, eventData) => {
    setSelectedEvent(eventData);
  };

  const deleteMarker = () => {
    deleteEvent(selectedEvent)
    handleInfoWindowClose()
  }

  const handleInfoWindowClose = () => {
    setSelectedEvent(null);
  };

  const fetchEvents = async () => {
    setIsLoading(true);  // Start loading
    try {
        const response = await fetch(`${apiURL}/fetch-events/${searchValue}`);
        const data = await response.json();
        console.log("fetchedEvents", data);
        setFetchedEvents(data);
    } catch (error) {
        console.error('Failed to fetch events:', error);
    } finally {
        setIsLoading(false);  // Stop loading
    }
};

  const generateSchedule = async () => {
    if (allEvents.length !== 0) {
    const response = await fetch(`${apiURL}/generate-schedule`, {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({"events": allEvents})
    })

    if (!response.ok){
      console.log("Error", response.statusText)
      setGeneratedSchedule("An error occured. Please try again shortly.")
    } else {
    const newData = await response.json()
    console.log(newData)
    setGeneratedSchedule(newData)
    }
    } else {
       setGeneratedSchedule("No events to be scheduled")
    }
  }

  const fetchMap = async (event) => {
    event.preventDefault()
    const response = await fetch (`${apiURL}/fetch-map/${fetchMapValue}`) // test map
    console.log(response, response.ok)
    if (response.ok) {
      const data = await response.json()
      if (data.events !== undefined) {
      console.log("fetched map events", data.events)
      addAllEvents(data.events)
      }
    }
    
  }

  const submitMap = async() => {
    if (allEvents.length !== 0) {
      const response = await fetch(`${apiURL}/create-map`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({"events": allEvents})
      })
      const insertedIdObject = await response.json()
      console.log(insertedIdObject.inserted_id)
      setCurrentMapId(insertedIdObject.inserted_id);
    }
  }
  
  return (
    <>
    <div className="front-screen-container">
      <div className="title-container">
        <h1 className="title">Build your Event Map. </h1>
        <h3 className="subtitle">Plan your journey with AI.</h3>
        <h3 className="greeting">Hello, Hiring Manager :)</h3>
        <FontAwesomeIcon icon={faArrowDown} className="arrow-down" size="3x"/>
      </div>
    </div>
    <div className="app-container">
      <div className="map-container">
        <APIProvider apiKey={apiKey}>
          <Map
            style={{ width: '55vw', height: '50vh' }}
            defaultCenter={{ lat: 39.8097343, lng: -95.5556199 }}
            defaultZoom={4}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            {allEvents.map(event => (
              <Marker
                key={event.datetime_utc}
                position={{
                  lat: event['venue_location'].lat,
                  lng: event['venue_location'].lon
                }}
                onClick={(e) => handleMarkerClick(e, event)}
              />
            ))}
            {selectedEvent && (
              <InfoWindow
                position={{
                  lat: selectedEvent['venue_location'].lat,
                  lng: selectedEvent['venue_location'].lon
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  <h2>{selectedEvent.title}</h2>
                  <p>Date: {new Date(selectedEvent.datetime_utc).toLocaleString()}</p>
                  <p>Location: {selectedEvent['venue_name']}</p>
                  <button onClick={() => deleteMarker()}>Delete Event</button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
    <div className="bottom-container">
      <div className="map-inputs-container">
        <form onSubmit={fetchMap} className="fetch-map">
          <label className="already-have-a-map">
            <b>Already have a map?:</b>
              <input className="input-bar-2" placeholder="Fetch Map with ID" onChange={handleFetchMapChange}/>
          </label>
          <button className="fetch-map-button" onClick={fetchMap}>Fetch Map</button>
        </form>
        <div className="map-id">
        <p ><b>Current Map ID: </b> {currentMapId}</p>
        </div>
      </div>
      <div className="submit-and-generate-container">
        <button className="submit-button" onClick={submitMap}>Submit Map</button>
        <button className="generate-button" onClick={generateSchedule}>Generate Schedule</button>
      </div>
      <pre className="pre-schedule">{generatedSchedule}</pre>
      </div>
      </div>
      <div className="search-bar-and-fetched-events">
        <form onSubmit={handleSubmit} className="search-bar">
            <input className="input-bar" placeholder="Enter search here..." onChange={handleSearchChange}/>
        </form>
        <div className="fetched-events-container">
          {fetchedEvents.length === 0 && <div className="no-fetched-events"><p className="no-fetched-text">No events found or fetched. Enter a search and press "enter"!</p></div>}
          {isLoading && <div className="no-fetched-events"> <p className="no-fetched-text">Fetching... </p></div>}
          {fetchedEvents.map((element, index) => (
            <FetchedEventBox 
              key={index} 
              event={element}>
            </FetchedEventBox>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default App
