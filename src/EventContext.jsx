import React, { createContext, useState, useContext } from 'react';

const EventContext = createContext()

export const EventProvider = ({ children }) => { 
    const [eventInfo, setEventInfo] = useState([])

    const addEvent = ( insertedEvent ) => {
        if (insertedEvent && typeof insertedEvent === 'object') {
            setEventInfo(items => [...items, insertedEvent]);
        } else {
            console.error("Attempted to add invalid event:", insertedEvent);
        }
    }

    const deleteEvent = ( eventToDelete ) => {
        const newEvents = eventInfo.filter((event) => event.datetime_utc != eventToDelete.datetime_utc)
        setEventInfo(newEvents)
    }

    return (
        <EventContext.Provider value={{eventInfo, addEvent, deleteEvent}}>
            {children}
        </EventContext.Provider>
    )
}

export const useEvents = () => useContext(EventContext) // custom hook