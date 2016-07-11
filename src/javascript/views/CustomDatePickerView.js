import template from 'custom-date-picker-view';
import BaseView from 'BaseView';
import CalendarView from 'CalendarView';

import 'stylesheets/custom-date-picker-view';

export default BaseView.extend({
  className: 'custom-date-picker-view',
  selectedDateField: null,
  monthOffset: -1,
  firstMonthView: null,
  secondMonthView: null,

  events: {
    'click .next-month-button': 'showNextMonth',
    'click .previous-month-button': 'showPreviousMonth',
    'click .start-date-input': 'chooseStartDate'
  },

  render() {
    this.$el.html(template(this.model.toJSON()));
    this.renderMonths();
    this.chooseStartDate();
  },

  renderMonths: function() {
    this.removeCalendarViews();
    this.firstMonthView = this.addMonthView(this.monthOffset);
    this.secondMonthView = this.addMonthView(this.monthOffset + 1);
  },

  removeCalendarViews() {
    if (this.firstMonthView) {
      this.removeChildView(this.firstMonthView);
      this.removeChildView(this.secondMonthView);
    }
  },

  addMonthView(monthOffset) {
    var calendarView = new CalendarView({
      model: this.model,
      monthOffset: monthOffset
    });

    calendarView.on('select-date', this.dateSelected, this);
    calendarView.on('hover-date', this.dateHovered, this);

    if (monthOffset <= this.monthOffset) {
      return this.prependChildView(calendarView, this.$el.find('.calendar-slider'));
    } else {
      return this.appendChildView(calendarView, this.$el.find('.calendar-slider'));
    }
  },

  showNextMonth() {
    this.removeChildView(this.firstMonthView);
    this.firstMonthView = this.secondMonthView;
    this.secondMonthView = this.addMonthView(++this.monthOffset + 1);
  },

  showPreviousMonth() {
    this.removeChildView(this.secondMonthView);
    this.secondMonthView = this.firstMonthView;
    this.firstMonthView = this.addMonthView(--this.monthOffset);
  },

  chooseStartDate() {
    this.selectedDateField = 'start';
    this.$el.removeClass('end-field-selected');
    this.$el.addClass('start-field-selected');
    this.$el.find('.start-date-input-field').val('');
    this.model.set('startDate', null);
    this.renderMonths();
  },

  dateHovered(dateString) {
    this.$el.find('.' + this.selectedDateField + '-date-input-field').val(dateString);
  },

  dateSelected(dateString) {
    this.model.setDateFromString(this.selectedDateField, dateString);
    if (this.selectedDateField === 'start') {
      this.selectedDateField = 'end';
      this.$el.removeClass('start-field-selected');
      this.$el.addClass('end-field-selected');
      this.renderMonths();
    } else {
      this.trigger('selected-end-date', this.model);
    }
  }

});
