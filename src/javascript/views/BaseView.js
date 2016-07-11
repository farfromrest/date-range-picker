import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

export default Backbone.View.extend({

  initialize: function() {
    this.childViews = [];
    this.on('not-clicked-on', this.clickedOff, this);
    this.delegateEvents(_.extend({}, this.events, {'mousedown': 'wasChildClickedOn'}));
    this.render();
  },

  appendChildView: function(childView, $parentView) {
    $(childView.$el).appendTo( $parentView || this.$el);
    this.childViews.push(childView);
    return childView;
  },

  prependChildView: function(childView, $parentView) {
    $(childView.$el).prependTo( $parentView || this.$el);
    this.childViews.unshift(childView);
    return childView;
  },

  removeChildView: function(childView) {
    var index = this.childViews.indexOf(childView);
    if (index > -1) {
      this.childViews[index].remove();
      this.childViews.splice(index, 1);
    }
  },

  removeChildViews: function() {
    _.each(this.childViews, function(childView) {
      if (childView !== null) {
        childView.remove();
      }
    });
  },

  remove: function() {
    this.removeChildViews();
    Backbone.View.prototype.remove.apply(this, arguments);
  },

  wasChildClickedOn: function(event) {
    var $target = $(event.target);
    // event.stopPropagation();

    _.each(this.childViews, function(childView) {
      if (childView === null) {
        return;
      }
      var className = childView.className.split(' ')[0];
      if ($target.parents('.' + className).length === 0 && !$target.hasClass(className)){
        childView.trigger('not-clicked-on', event);
      }
    });
  }

});
