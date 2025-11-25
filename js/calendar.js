$(document).ready(function () {
    let currentDate = new Date();
    let events = [];

    // Initial load
    fetchEvents();

    // Event Listeners
    $('#prevMonth').click(function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    $('#nextMonth').click(function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    $('#addEventBtn').click(function () {
        $('#eventModal').fadeIn(200);
        // Set default date to today
        document.getElementById('eventDate').valueAsDate = new Date();
    });

    $('.close-modal').click(function () {
        $('#eventModal').fadeOut(200);
    });

    $(window).click(function (event) {
        if ($(event.target).is('#eventModal')) {
            $('#eventModal').fadeOut(200);
        }
    });

    $('#addEventForm').submit(function (e) {
        e.preventDefault();
        saveEvent();
    });

    function fetchEvents() {
        $.getJSON('js/events.json', function (data) {
            events = data;
            renderCalendar();
        }).fail(function () {
            console.log("Could not load events.json, initializing empty calendar.");
            events = [];
            renderCalendar();
        });
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Update header
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        $('#currentMonth').text(`${monthNames[month]} ${year}`);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDayIndex = firstDay.getDay(); // 0 = Sunday
        const totalDays = lastDay.getDate();

        const grid = $('#calendarGrid');
        grid.empty();

        // Previous month filler days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayIndex - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            grid.append(`<div class="calendar-day other-month"><span class="day-number">${dayNum}</span></div>`);
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= totalDays; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            let dayHtml = `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                <span class="day-number">${i}</span>
                <div class="day-events"></div>
            </div>`;

            grid.append(dayHtml);
        }

        // Next month filler days
        const totalCells = startDayIndex + totalDays;
        const remainingCells = 42 - totalCells; // 6 rows * 7 cols
        for (let i = 1; i <= remainingCells; i++) {
            grid.append(`<div class="calendar-day other-month"><span class="day-number">${i}</span></div>`);
        }

        renderEvents();
    }

    function renderEvents() {
        events.forEach(event => {
            const eventDate = new Date(event.start);
            const dateStr = eventDate.toISOString().split('T')[0];

            const dayCell = $(`.calendar-day[data-date="${dateStr}"] .day-events`);

            if (dayCell.length) {
                const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const eventHtml = `<div class="event-item ${event.type}" title="${event.title} (${timeStr})">
                    ${timeStr} ${event.title}
                </div>`;
                dayCell.append(eventHtml);
            }
        });
    }

    function saveEvent() {
        const formData = {
            title: $('#eventTitle').val(),
            date: $('#eventDate').val(),
            start: $('#eventStart').val(),
            end: $('#eventEnd').val(),
            type: $('#eventType').val(),
            description: $('#eventDesc').val()
        };

        // Construct full ISO strings
        const startDateTime = `${formData.date}T${formData.start}`;
        const endDateTime = `${formData.date}T${formData.end}`;

        const newEvent = {
            title: formData.title,
            start: startDateTime,
            end: endDateTime,
            type: formData.type,
            description: formData.description
        };

        // Send to backend
        $.ajax({
            url: '/api/events',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newEvent),
            success: function (response) {
                $('#eventModal').fadeOut(200);
                $('#addEventForm')[0].reset();

                // Add to local events array and re-render
                if (response.event) {
                    events.push(response.event);
                } else {
                    // Fallback if backend doesn't return the object
                    events.push(newEvent);
                }
                renderCalendar();
                alert('Activity saved successfully!');
            },
            error: function (xhr, status, error) {
                console.error("Error saving event:", error);
                // Fallback for static site (demo mode)
                alert('Note: Backend not available. Event will be shown but not persisted after reload.');
                events.push(newEvent);
                renderCalendar();
                $('#eventModal').fadeOut(200);
            }
        });
    }
});
