var moment = require('moment');
require('moment-range');
var _ = require('underscore');

module.exports = {

  getToday: function() {
    return moment();
  },

  formatDate: function(date, format = 'MM / DD / YY') {
    return date ? date.format(format) : null;
  },

  dateFromString: (dateString, format = 'MM/DD/YY') => moment(dateString, format),

  getDateRange: function(range) {
    var today = this.getToday();
    var startDate = today.clone();
    var endDate;

    if (range === 'last-week') {
      startDate.subtract(today.weekday() + 6, 'days');
      endDate = startDate.clone().add(6, 'days');
    } else if (range === 'last-month') {
      startDate.subtract(1, 'month').startOf('month');
      endDate = startDate.clone().endOf('month');
    } else if (range === 'last-thirty-days') {
      startDate.subtract(30, 'days');
      endDate = today.clone();
    } else if (range === 'last-seven-days') {
      startDate.subtract(7, 'days');
      endDate = today.clone();
    } else if (range === 'last-quarter') {
      startDate.subtract(1, 'quarter').startOf('quarter');
      endDate = startDate.clone().endOf('quarter');
    } else if (range === 'this-quarter') {
      startDate.startOf('quarter');
      endDate = startDate.clone().endOf('quarter');
    } else if (range === 'last-year') {
      startDate.subtract(1, 'year').startOf('year');
      endDate = startDate.clone().endOf('year');
    } else if (range === 'this-year') {
      startDate.startOf('year');
      endDate = startDate.clone().endOf('year');
    } else if (range === 'custom') {
      return;
    } else {
      return null;
    }

    return [startDate, endDate];
  },


  getCalendarForMonth: function(options) {
    options = options || {};
    var today = this.getToday();
    var currentDate = today.clone().add(options.offset || 0, 'months').startOf('month');
    var firstDayIndex = currentDate.weekday();
    var lastDayIndex = firstDayIndex + currentDate.daysInMonth() - 1;
    var formatDate = _.bind(this.formatDate, this);
    var minDate = options.minDate || null;
    var maxDate = options.maxDate || null;

    return {
      month: currentDate.format('MMMM'),
      year: currentDate.format('YYYY'),
      firstDay: currentDate.clone(),
      lastDay: currentDate.clone().endOf('month'),
      daySlots: _.times(42, function(index) {

        if (index >= firstDayIndex && index <= lastDayIndex) {
          var date = currentDate.clone();
          var notBeforeMinDate = !minDate || date.isSameOrAfter(minDate);
          var notAfterMaxDate = !maxDate || date.isSameOrBefore(maxDate);
          currentDate.add(1, 'days');
          return {
            day: date.date(),
            date: formatDate(date),
            enabled: date.isBefore(today) && notBeforeMinDate && notAfterMaxDate
          };
        }

      })
    };
  },

  isBefore(date, minDate) {
    return date.isBefore(minDate);
  },

  isAfter(date, maxDate) {
    return date.isAfter(maxDate);
  },

  getPreviousTimePeriod(startDate, endDate) {
    const numberOfDaysInRange =  moment.range(startDate, endDate).diff('days');
    return [
      startDate.clone().subtract(numberOfDaysInRange, 'days'),
      endDate.clone().subtract(numberOfDaysInRange + 1, 'days')
    ];
  },

  getArrayOfDatesForRange(startDate, endDate) {
    let dates = [];
    moment.range(startDate, endDate).by('days', (moment) => {
      dates.push(moment.format('YYYY-MM-DD'));
    });
    return dates;
  },

  getYears(startDate, endDate) {
    return _.uniq([startDate.year(), endDate.year()]);
  },

  year(offset = 0) {
    return this.getToday().add(offset, 'years').year();
  },

  firstDayOfYearOffset(offset) {
    return this.getToday().add(offset, 'years').startOf('year');
  },

  lastDayOfYearOffset(offset) {
    return this.getToday().add(offset, 'years').endOf('year');
  },

  lastDayOfYearOffsetNotInTheFuture(offset) {
    const afterToday = this.lastDayOfYearOffset(offset).isAfter(this.getToday(), 'days');
    return afterToday ? this.getToday() : this.lastDayOfYearOffset(offset);
  }

};
