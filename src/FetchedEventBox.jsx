import { useEvents } from './EventContext'
import "./FetchedEventBox.css"

function FetchedEventBox( { event }) {
    const { allEvents, addEvent, deleteEvent } = useEvents()

    return (
        <div className="eventBox">
            <div className="content">
                <strong>{event.title}</strong>
                <p>{event["venue_name"]}</p>
                <p>Date: {new Date(event.datetime_utc).toLocaleString()}</p>
            </div>
            <button className="add-to-map-button" onClick={() => addEvent(event)}>Add to map</button>
        </div>

    )
}
export default FetchedEventBox