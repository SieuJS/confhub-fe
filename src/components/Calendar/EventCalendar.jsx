import { useState, useEffect } from 'react';
import { Calendar, Views, momentLocalizer, dateFnsLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useNote from '../../hooks/useNote';
import ListNotesInModal from './ListNotesInModal';
import { formatDate } from '../../utils/formatDate';
import DetailInforNoteModal from './DetailInforNoteModal';
import format from 'date-fns/format';
import './customcalendar.css'
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

function EventCalendar() {
    const { t, i18n } = useTranslation()
    const { user } = useAuth()
    const { notes, getAllNotes, updateNote, deleteNote } = useNote()
    
    const [showListModal, setShowListModal] = useState(false)
    const [dateClicked, setDateClicked] = useState('')
    const [existEvents, setExistEvents] = useState([]);

    //detailed modal
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [detailNote, setDetailNote] = useState(null)
    useEffect(() => {
        getAllNotes()
    }, [])



    useEffect(() => {
        if (!notes) {
            getAllNotes()
        }
    }, [user])

    const messages={
        allDay: t('allDay'),
        previous: t('previous'),
        next: t('next'),
        today: t('today'),
        month: t('month'),
        week: t('week'),
        day: t('day'),
        agenda: t('agenda'),
        date: t('date'),
        time: t('time'),
        event: t('event'),
        showMore: function showMore(total) {
            return '+' + total + ` ${t('note')}`;
          }
      }
      
    const handleDateClick = (event) => {
        const dateEvents = notes.filter((note) => moment(note.start_date).isSame(event.start, 'day'));

        setExistEvents(dateEvents)

    };

    const handleSelectEvent = (event) => {
        const formated = formatDate(event.start_date)
        setDetailNote(event)
        setDateClicked(formated)
        setShowDetailModal(!showDetailModal)

    }
    const handleSelectSlot = (slotinfo) => {
        const formated = formatDate(slotinfo.start)
        const noteMatch = notes.filter(
            note => {
                const startDate = new Date(note.start_date.getFullYear(), note.start_date.getMonth(), note.start_date.getDate());
                const endDate = new Date(note.end_date.getFullYear(), note.end_date.getMonth(), note.end_date.getDate());
                
                const slotDate = new Date(slotinfo.start.getFullYear(), slotinfo.start.getMonth(), slotinfo.start.getDate());
                return slotDate >= startDate && slotDate <= endDate;

            }
        );

        setExistEvents(noteMatch)
        setDateClicked(formated)
        setShowListModal(!showListModal)
    }

    const customEventPropGetter = (event) => {
        return { className: event.subStyle };
    };

    const renderEventContent = (event) => {
        return (
            <div
                className={`event-cell text-color-black text-start mx-2 fs-7 m-0 d-flex flex-column ${event.subStyle}`}
                onClick={handleDateClick}>
                <span> {event.event.subStyle !== 'note-event' && `${event.event.acronym} -`} {event.event.date_type}</span>
                {
                    (event.event.note !== '' && event.event.note !== 'default' && event.event.note) && <span className=''>{`Note: ${event.event.note}`}</span>
                }
            </div>
        );
    };
    return (
        <div className="mb-3">
            <Calendar
                defaultView={Views.MONTH}
                views={['month']}
                localizer={localizer}
                events={notes}
                messages={messages}
                startAccessor="start_date"
                endAccessor="end_date"
                style={{ height: 600 }}
                eventPropGetter={customEventPropGetter}
                components={{
                    event: renderEventContent,
                }}
                popup={true}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                allDayAccessor="allDay"
            />

            {
                showListModal &&
                <ListNotesInModal
                    show={showListModal}
                    notesList={existEvents}
                    dateClicked={dateClicked}
                    onDelete={deleteNote}
                    onClose={() => setShowListModal(false)}
                    showDetailModal={showDetailModal}
                    setShowDetailModal={setShowDetailModal}
                    setDetailNote={setDetailNote}
                    onReloadList={getAllNotes}
                />
            }

            {
                showDetailModal &&
                <DetailInforNoteModal
                    show={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    note={detailNote}
                    onDelete={deleteNote}
                    onUpdate={updateNote}
                    onReloadList={getAllNotes}
                />
            }
        </div>
    );
}

export default EventCalendar;