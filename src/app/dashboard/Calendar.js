'use client';

import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup for the calendar's localization
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar({ studyBlocks }) {
  // THE FIX:
  // We map over the study blocks from the database.
  // The 'start_time' and 'end_time' are strings in UTC format.
  // By passing them into `new Date()`, we create a new Date object
  // that the browser automatically converts to the user's LOCAL timezone.
  const events = studyBlocks.map(block => ({
    ...block,
    start: new Date(block.start_time),
    end: new Date(block.end_time),
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow" style={{ height: '70vh' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ flex: 1 }}
      />
    </div>
  );
}
