import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, func } from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'lodash';

import { fetchNormalEventByBusinessId, createNewEvent } from 'actions/calendar';
import {
  EVENT_LEVEL,
  EVENT_TYPE,
  EVENT_REPEAT_TYPE,
  REPEAT_END_TYPE
} from 'constants/Calendar.constants';
import { providerType, optionType } from 'types/global';
import Calendar from './CalendarV2';
import AddEventDialog from './AddEventDialog';
import CalendarLoading from './CalendarLoading';

class ManageCalendar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initialState = {
      isOpenAddDialog: false,
      addEventData: {
        eventType: '',
        repeat: {
          repeatEnd: {}
        },
        special: {}
      },
      eventLevel: EVENT_LEVEL.ORGANIZATION
    };
    this.state = { ...this.initialState, isLoading: false };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('userSub');
    if (this.userId) {
      this.setState({ isLoading: true });
      this.props
        .fetchNormalEventByBusinessId(this.userId)
        .finally(() => this.setState({ isLoading: false }));
    }
  }

  closeAddDialog = () => this.setState(this.initialState);

  onClickNewEvent = (schedulerData, providerId, providerName, startTime, endTime) => {
    this.setState(() => {
      let addEventData = {
        eventType: Object.values(EVENT_TYPE)[0],
        description: '',
        repeat: {
          type: Object.values(EVENT_REPEAT_TYPE)[0],
          repeatEnd: {}
        },
        special: {}
      };
      addEventData = {
        ...addEventData,
        ...(providerId === undefined
          ? {
            startTime: moment(),
            endTime: moment().add(1, 'hour')
          }
          : {
            providerId,
            providerName,
            startTime,
            endTime
          })
      };

      return {
        eventLevel: providerId ? EVENT_LEVEL.PROVIDER : EVENT_LEVEL.ORGANIZATION,
        isOpenAddDialog: true,
        addEventData
      };
    });
  };

  generateRepeatPayload = repeat => {
    let repeatPayload = { isAllowRepeat: true };

    if (repeat.type === EVENT_REPEAT_TYPE.DAILY) {
      repeatPayload = {
        ...repeatPayload,
        repeatType: EVENT_REPEAT_TYPE.DAILY,
        repeat: {
          repeatDaily: {
            repeatEvery: repeat.every
          }
        }
      };
    }

    if (repeat.type === EVENT_REPEAT_TYPE.WEEKLY) {
      repeatPayload = {
        ...repeatPayload,
        repeatType: EVENT_REPEAT_TYPE.WEEKLY,
        repeat: {
          repeatWeekly: {
            repeatEveryNumWeeks: repeat.every,
            repeatOn: repeat.everyDate.join(',')
          }
        }
      };
    }

    if (isEmpty(repeat.repeatEnd)) {
      repeatPayload = {
        ...repeatPayload,
        repeatEndType: REPEAT_END_TYPE.NEVER
      };
    } else {
      if (repeat.repeatEnd.afterOccur !== undefined) {
        repeatPayload = {
          ...repeatPayload,
          repeatEndType: REPEAT_END_TYPE.AFTER_NUM_OCCUR,
          repeatEnd: {
            afterNumOccurrences: repeat.repeatEnd.afterOccur
          }
        };
      }

      if (repeat.repeatEnd.onDate !== undefined) {
        repeatPayload = {
          ...repeatPayload,
          repeatEndType: REPEAT_END_TYPE.ON_DATE,
          repeatEnd: {
            repeatEndOn: moment(repeat.repeatEnd.onDate)
              .startOf('day')
              .unix()
          }
        };
      }
    }

    return repeatPayload;
  };

  generateSpecialPayload = special => {
    const {
      additionalInfo,
      avgServiceTime,
      breakTimeStart,
      breakTimeEnd,
      geoLocationId,
      numberOfParallelCustomer,
      serviceId
    } = special;

    return {
      additionalInfo: additionalInfo.length === 0 ? undefined : additionalInfo,
      avgServiceTime,
      breakTime: {
        breakStart: moment(breakTimeStart).unix(),
        breakEnd: moment(breakTimeEnd).unix()
      },
      geoLocationId,
      numberOfParallelCustomer,
      serviceId,
      businessAdminId: this.userId
    };
  };

  generatePayload = addEventData => {
    const {
      providerId,
      startTime,
      endTime,
      eventType,
      description,
      repeat,
      special
    } = addEventData;

    let payload = {
      description,
      providerId,
      slot: {
        startTime: moment(startTime).unix(),
        endTime: moment(endTime).unix()
      },
      type: eventType
    };

    if (eventType === EVENT_TYPE.SPECIAL) {
      payload = { ...payload, ...this.generateSpecialPayload(special) };
    }

    if (repeat.type !== EVENT_REPEAT_TYPE.NEVER) {
      payload = { ...payload, ...this.generateRepeatPayload(repeat) };
    } else {
      payload = { ...payload, isAllowRepeat: false };
    }
    return payload;
  };

  createNewEvent = addEventData => {
    if (this.state.eventLevel === EVENT_LEVEL.ORGANIZATION) {
      this.createOrgNewEvent(addEventData);
      return;
    }

    this.closeAddDialog();
    this.setState({ isLoading: true });
    const payload = this.generatePayload(addEventData);
    this.props.createNewEvent(payload).finally(() => this.setState({ isLoading: false }));
  };

  createOrgNewEvent = addEventData => {
    const fetchMap = this.props.providers.map(provider => {
      const payload = this.generatePayload({
        ...addEventData,
        providerId: provider.id
      });
      return this.props.createNewEvent(payload);
    });

    this.closeAddDialog();
    this.setState({ isLoading: true });
    Promise.all(fetchMap).finally(() => this.setState({ isLoading: false }));
  };

  updateEventLevel = eventLevel => this.setState({ eventLevel });

  render() {
    const { providers, serviceOptions } = this.props;
    const { isOpenAddDialog, eventLevel, addEventData, isLoading } = this.state;

    return (
      <>
        <div>
          <Calendar providers={providers} onClickNewEvent={this.onClickNewEvent} />
          <CalendarLoading isLoading={isLoading} />
        </div>
        {isOpenAddDialog && (
          <AddEventDialog
            eventLevel={eventLevel}
            providers={providers}
            isOpenAddDialog={isOpenAddDialog}
            closeAddDialog={this.closeAddDialog}
            addEventData={addEventData}
            createNewEvent={this.createNewEvent}
            updateEventLevel={this.updateEventLevel}
            serviceOptions={serviceOptions}
          />
        )}
      </>
    );
  }
}

ManageCalendar.propTypes = {
  providers: arrayOf(providerType).isRequired,
  fetchNormalEventByBusinessId: func.isRequired,
  createNewEvent: func.isRequired,
  serviceOptions: arrayOf(optionType).isRequired,
};

const mapStateToProps = state => ({
  providers: state.calendarManage.providers,
  isLoading: state.calendarManage.isLoading,
  serviceOptions: state.calendarManage.serviceOptions
});

const mapDispatchToProps = dispatch => ({
  fetchNormalEventByBusinessId: businessId => dispatch(fetchNormalEventByBusinessId(businessId)),
  createNewEvent: newEvent => dispatch(createNewEvent(newEvent))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCalendar);
