import DateHelper from 'DateHelper';
import Backbone from 'backbone';

export default Backbone.Model.extend({

  setDateFromString(key, dateString) {
    this.set(key + 'Date', DateHelper.dateFromString(dateString));
  }

});
