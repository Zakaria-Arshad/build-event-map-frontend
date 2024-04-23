import { useEvents } from './EventContext'
import "./FetchedEventBox.css"

function FetchedEventBox( { event }) {
    const { eventInfo, addEvent } = useEvents()

    return (
        <div className="eventBox">
            <p>{event.title}</p>
            <p>{event["venue.name"]}</p>
            <button onClick={() => addEvent(event)}>Add to map</button>
        </div>

    )
}
export default FetchedEventBox