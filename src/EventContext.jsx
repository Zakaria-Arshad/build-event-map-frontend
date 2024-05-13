import React, { createContext, useState, useContext } from 'react';


// when a component subscribes to this context, React checks for nearest provider in the tree.
const EventContext = createContext()


// any children wrapped by the Provider are allowed to use the state and functions
// component that allows consuming components to subscribe to context changes.
export const EventProvider = ({ children }) => { 
    const [allEvents, setAllEvents] = useState([])

    const addEvent = ( insertedEvent ) => { // need to handle adding an item that's already in it
        if (insertedEvent && typeof insertedEvent === 'object') {
            setAllEvents(items => [...items, insertedEvent]);
        } else {
            console.error("Attempted to add invalid event:", insertedEvent);
        }
    }

    const addAllEvents = (events) => {
        setAllEvents(events); 
    }

    const deleteEvent = ( eventToDelete ) => {
        const newEvents = allEvents.filter((event) => event.datetime_utc != eventToDelete.datetime_utc)
        setAllEvents(newEvents)
    }

    return (
        <EventContext.Provider value={{allEvents, addEvent, addAllEvents, deleteEvent}}>
            {children}
        </EventContext.Provider>
    )
}

// instead of using useContext(EventContext) directly in every component
// just call useEvents
export const useEvents = () => useContext(EventContext) // custom hook