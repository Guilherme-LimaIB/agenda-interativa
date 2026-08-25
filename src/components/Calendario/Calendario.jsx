import { dateFnsLocalizer, Calendar as ReactBigCalendar } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales: { 'pt-BR': ptBR },
})

export function Calendario({ eventos, onSelectDate, onClickEvento }) {
  const eventosCalendario = eventos.map((evento) => ({
    id: evento.id,
    title: evento.titulo,
    start: new Date(evento.data_inicio),
    end: new Date(evento.data_fim),
    resource: evento,
  }))

  return (
    <div className="h-[calc(100vh-64px)] p-4">
      <ReactBigCalendar
        localizer={localizer}
        events={eventosCalendario}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={onSelectDate}
        onSelectEvent={(event) => onClickEvento(event.resource)}
        culture="pt-BR"
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          noEventsInRange: 'Nenhum evento neste período.',
        }}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.resource.cor || '#3B82F6' },
        })}
      />
    </div>
  )
}
