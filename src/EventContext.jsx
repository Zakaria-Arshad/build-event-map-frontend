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

    return (
        <EventContext.Provider value={{eventInfo, addEvent}}>
            {children}
        </EventContext.Provider>
    )
}

export const useEvents = () => useContext(EventContext) // custom hook