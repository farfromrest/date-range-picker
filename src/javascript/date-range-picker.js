import DateRangeModel from 'DateRangeModel';
import CustomDatePickerView from 'CustomDatePickerView';

export default () => {
  const model = new DateRangeModel();
  const view = new CustomDatePickerView({model});

  return {
    view,
    model
  };

};
