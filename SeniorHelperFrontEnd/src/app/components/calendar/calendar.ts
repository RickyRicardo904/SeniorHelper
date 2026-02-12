import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface DayCell {
  date: Date;
  inMonth: boolean;
  iso: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar implements OnInit {
  today = new Date();
  displayMonth = this.today.getMonth();
  displayYear = this.today.getFullYear();
  monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];

  weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  weeks: DayCell[][] = [];

  // sample events keyed by ISO date (yyyy-mm-dd)
  events: Record<string,string[]> = {
    // add some sample events near today
    [this.isoDate(this.today)]: ['Doctor appt 10:00', 'Call with Alex 16:00']
  };

  ngOnInit(): void {
    this.buildCalendar();
  }

  prevMonth() {
    if (this.displayMonth === 0) {
      this.displayMonth = 11;
      this.displayYear -= 1;
    } else {
      this.displayMonth -= 1;
    }
    this.buildCalendar();
  }

  nextMonth() {
    if (this.displayMonth === 11) {
      this.displayMonth = 0;
      this.displayYear += 1;
    } else {
      this.displayMonth += 1;
    }
    this.buildCalendar();
  }

  buildCalendar() {
    const firstOfMonth = new Date(this.displayYear, this.displayMonth, 1);
    const startDay = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();

    // previous month filler
    const prevMonthLastDay = new Date(this.displayYear, this.displayMonth, 0).getDate();

    const cells: DayCell[] = [];

    // leading days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(this.displayYear, this.displayMonth - 1, prevMonthLastDay - i);
      cells.push({ date, inMonth: false, iso: this.isoDate(date) });
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.displayYear, this.displayMonth, d);
      cells.push({ date, inMonth: true, iso: this.isoDate(date) });
    }

    // trailing next month days to fill last week
    while (cells.length % 7 !== 0) {
      const nextIndex = cells.length - (startDay + daysInMonth);
      const date = new Date(this.displayYear, this.displayMonth + 1, nextIndex + 1);
      cells.push({ date, inMonth: false, iso: this.isoDate(date) });
    }

    // split into weeks
    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
  }

  isoDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  isToday(cell: DayCell) {
    return this.isoDate(cell.date) === this.isoDate(this.today);
  }

  hasEvents(cell: DayCell) {
    return (this.events[cell.iso] || []).length > 0;
  }
}
