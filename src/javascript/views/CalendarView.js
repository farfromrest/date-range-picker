var template = require('../../templates/calendar-view');
import BaseView from 'BaseView';
var DateHelper = require('DateHelper');

require('../../stylesheets/calendar-view');

export default BaseView.extend({
  className: 'calendar-view',

  events: {
    'click .calendar-day-button': 'clickedCalendarDay',
    'mouseenter .calendar-day-button': 'hoveredOverCalendarDay',
    'mouseleave .calendar-day-button': 'hoveredOffCalendarDay'
  },

  initialize: function(options) {
    this.monthOffset = options.monthOffset;
    BaseView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    var startDate = this.model.get('startDate');
    var minDate = this.model.get('minDate');
    var maxDate = this.model.get('maxDate');
    var today = DateHelper.formatDate(DateHelper.getToday());

    var calendar = DateHelper.getCalendarForMonth({
      offset: this.monthOffset,
      minDate: startDate || minDate,
      maxDate
    });

    this.$el.html(template(calendar));

    if (startDate) {
      this.$el.find('[data-date="' + DateHelper.formatDate(startDate) + '"]').addClass('selected');
    }
    this.$el.find('[data-date="' + today + '"]').addClass('today');
  },

  hoveredOverCalendarDay: function(event) {
    this.trigger('hover-date', event.currentTarget.dataset.date);
  },

  hoveredOffCalendarDay: function() {
    this.trigger('hover-date', null);
  },

  clickedCalendarDay: function(event) {
    this.trigger('select-date', event.currentTarget.dataset.date);
  }

});
