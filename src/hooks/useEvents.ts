import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event } from '../types';
import Papa from 'papaparse';

export const useEvents = (userId: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('useEvents.ts: Initialized with userId:', userId);

  useEffect(() => {
    setLoading(true);
    const globalEventsQuery = query(collection(db, 'globalEvents'));
    const personalEventsQuery = userId ? query(collection(db, 'users', userId, 'personal_events')) : null;

    const unsubscribeGlobal = onSnapshot(globalEventsQuery, (snapshot) => {
      const globalEvents = snapshot.docs.map(doc => {
        const data = doc.data();
        const eventName = data.name || data.event || data.title || 'Global Event';
        return {
          id: doc.id,
          title: eventName,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date || Date.now()),
          description: data.description || data.note || '',
          category: data.category || data.type || 'other',
          country: data.country || '',
          isPersonal: false,
          userId: data.userId || '',
          color: data.color || '#3b82f6',
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        } as Event;
      });
      console.log('useEvents.ts: Global events fetched:', globalEvents.length, globalEvents.map(e => ({ id: e.id, title: e.title })));
      setEvents(prevEvents => {
        const personalEvents = prevEvents.filter(event => event.isPersonal);
        return [...personalEvents, ...globalEvents];
      });
      setLoading(false);
    }, (error) => {
      console.error('useEvents.ts: Error fetching global events:', error);
      setLoading(false);
    });

    let unsubscribePersonal: (() => void) | null = null;
    if (personalEventsQuery && userId) {
      unsubscribePersonal = onSnapshot(personalEventsQuery, (snapshot) => {
        const personalEvents = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Personal Event',
            date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date || Date.now()),
            description: data.description || '',
            category: data.category || 'personal',
            country: data.country || '',
            isPersonal: true,
            userId: data.userId || userId,
            color: data.color || '#8b5cf6',
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
          } as Event;
        });
        console.log('useEvents.ts: Personal events fetched:', personalEvents.length, personalEvents.map(e => ({ id: e.id, title: e.title })));
        setEvents(prevEvents => {
          const globalEvents = prevEvents.filter(event => !event.isPersonal);
          return [...globalEvents, ...personalEvents];
        });
        setLoading(false);
      }, (error) => {
        console.error('useEvents.ts: Error fetching personal events:', error);
        setLoading(false);
      });
    } else {
      console.log('useEvents.ts: Skipping personal events query, userId is null');
      setLoading(false);
    }

    return () => {
      unsubscribeGlobal();
      if (unsubscribePersonal) unsubscribePersonal();
    };
  }, [userId]);

  const addEvent = async (eventData: {
    title: string;
    date: Date;
    description?: string;
    category: string;
    country?: string;
    isPersonal: boolean;
    userId: string;
    color?: string;
  }) => {
    if (!userId && eventData.isPersonal) {
      console.error('useEvents.ts: Cannot add personal event, userId is null');
      throw new Error('User not authenticated');
    }
    try {
      let docRef;
      if (eventData.isPersonal && userId) {
        const userRef = doc(db, 'users', userId);
        docRef = await addDoc(collection(userRef, 'personal_events'), {
          ...eventData,
          userId: userId,
          date: Timestamp.fromDate(eventData.date),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        docRef = await addDoc(collection(db, 'globalEvents'), {
          ...eventData,
          userId: userId || '',
          date: Timestamp.fromDate(eventData.date),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      console.log('useEvents.ts: Event added successfully to', eventData.isPersonal ? `users/${userId}/personal_events` : 'globalEvents', { id: docRef.id, ...eventData });
    } catch (error) {
      console.error('useEvents.ts: Error adding event to', eventData.isPersonal ? `users/${userId}/personal_events` : 'globalEvents', ':', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string, isPersonal: boolean) => {
    try {
      if (isPersonal && userId) {
        await deleteDoc(doc(db, 'users', userId, 'personal_events', eventId));
        console.log('useEvents.ts: Personal event deleted successfully:', eventId);
      } else {
        await deleteDoc(doc(db, 'globalEvents', eventId));
        console.log('useEvents.ts: Global event deleted successfully:', eventId);
      }
    } catch (error) {
      console.error('useEvents.ts: Error deleting event:', error);
      throw error;
    }
  };

  const uploadCSV = async (file: File, userId: string | null) => {
    return new Promise<void>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const events = results.data as any[];

          try {
            for (const event of events) {
              // Validate and parse date
              let parsedDate: Date;
              try {
                parsedDate = new Date(event.date);
                if (isNaN(parsedDate.getTime())) {
                  throw new Error(`Invalid date format for event: ${event.title}`);
                }
              } catch (error) {
                console.error('useEvents.ts: Invalid date format in CSV for event:', event.title, error);
                continue; // Skip invalid dates
              }

              const eventData: Event = {
                title: event.title || 'Untitled Event',
                description: event.description || '',
                date: parsedDate,
                category: event.category || 'other',
                country: event.country || '',
                isPersonal: false,
                userId: userId || '',
                color: '#3b82f6', // Default color for global events
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              await addDoc(collection(db, 'globalEvents'), {
                ...eventData,
                date: Timestamp.fromDate(eventData.date),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              console.log('useEvents.ts: Added global event from CSV:', eventData.title);
            }
            resolve();
          } catch (error) {
            console.error('useEvents.ts: Error uploading CSV to globalEvents:', error);
            reject(error);
          }
        },
        error: (err) => {
          console.error('useEvents.ts: Papa Parse error:', err);
          reject(err);
        },
      });
    });
  };

  return { events, addEvent, deleteEvent, uploadCSV, loading };
};