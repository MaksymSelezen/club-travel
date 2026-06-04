import { MONTHS, MONTH_TITLES, WEEKDAYS } from './constants.js';

export function initDatePicker(root) {
  const dateField = root.querySelector('[data-tour-search-date]');
  const dateBox = root.querySelector('[data-tour-search-date-box]');
  const dateInput = root.querySelector('[data-tour-search-date-input]');
  const calendar = root.querySelector('[data-tour-search-calendar]');

  if (!dateField || !dateBox || !dateInput || !calendar) return;

  let selectedDate = getTodayDate();
  let viewDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );

  const closeCalendar = () => {
    calendar.hidden = true;
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyDays = (new Date(year, month, 1).getDay() + 6) % 7;
    const selectedIso = formatIsoDate(selectedDate);
    const todayIso = formatIsoDate(getTodayDate());

    const emptyCells =
      '<span class="tour-search__calendar_day_empty"></span>'.repeat(emptyDays);

    const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const iso = formatIsoDate(new Date(year, month, day));
      const classes = ['tour-search__calendar_day'];

      if (iso === selectedIso) {
        classes.push('tour-search__calendar_day_selected');
      }

      if (iso === todayIso) {
        classes.push('tour-search__calendar_day_today');
      }

      return `<button class="${classes.join(
        ' ',
      )}" type="button" data-tour-search-calendar-day="${iso}">${day}</button>`;
    }).join('');

    calendar.innerHTML = `
      <div class="tour-search__calendar_header">
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-prev>‹</button>
        <span class="tour-search__calendar_month">${MONTH_TITLES[month]} ${year}</span>
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-next>›</button>
      </div>

      <div class="tour-search__calendar_weekdays">
        ${WEEKDAYS.map(
          day => `<span class="tour-search__calendar_weekday">${day}</span>`,
        ).join('')}
      </div>

      <div class="tour-search__calendar_grid">
        ${emptyCells}
        ${dayCells}
      </div>
    `;
  };

  const syncInput = () => {
    dateInput.value = formatInputDate(selectedDate);
    dateInput.dataset.date = formatIsoDate(selectedDate);
  };

  dateBox.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    calendar.hidden = !calendar.hidden;

    if (!calendar.hidden) {
      renderCalendar();
    }
  });

  calendar.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.closest('[data-tour-search-calendar-prev]')) {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      renderCalendar();
      return;
    }

    if (event.target.closest('[data-tour-search-calendar-next]')) {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      renderCalendar();
      return;
    }

    const dayButton = event.target.closest('[data-tour-search-calendar-day]');

    if (!dayButton) return;

    selectedDate = parseIsoDate(dayButton.dataset.tourSearchCalendarDay);
    viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    syncInput();
    renderCalendar();
    closeCalendar();
  });

  document.addEventListener('click', event => {
    if (!dateField.contains(event.target)) {
      closeCalendar();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCalendar();
    }
  });

  syncInput();
  renderCalendar();
}

function getTodayDate() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function parseIsoDate(value) {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatInputDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
