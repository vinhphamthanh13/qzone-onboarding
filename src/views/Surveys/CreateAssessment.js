import React from 'react';
import { func, objectOf, any } from 'prop-types';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Poll } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import validationFormStyle from 'assets/jss/material-dashboard-pro-react/modules/validationFormStyle';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CardBody from '../../components/Card/CardBody';
import SurveyForm from './SurveyForm';
import Loading from '../../components/Loading/Loading';
// import { createSurvey } from 'services/api/assessment';

class CreateAssessment extends React.Component {
  static propTypes = {
    classes: objectOf(any).isRequired,
    createSurvey: func.isRequired,
    history: objectOf(any).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      surveyInfo: {
        title: '',
        description: '',
        logo: '',
        privacy: false,
        survey: '',
        userId: '',
      },
      titleState: '',
      loading: true,
      descriptionState: '',
      mode: 'create',
      token: '',
    };
  }

  change = (event, stateName) => {
    if (isEmpty(event.target.value)) {
      this.setState({ [`${stateName}State`]: 'error' });
    } else {
      this.setState({ [`${stateName}State`]: 'success' });
    }
    const { surveyInfo } = this.state;
    surveyInfo[stateName] = (event.target.value || event.target.checked);
    this.setState({ surveyInfo });
  };

  changeQuestions = (newSurvey) => {
    const { createSurvey: createSurveyAction, history } = this.props;
    const { surveyInfo, token } = this.state;
    const { title, description } = surveyInfo;

    if (!isEmpty(title) && !isEmpty(description)) {
      createSurveyAction({
        ...surveyInfo,
        survey: JSON.stringify(newSurvey),
      }, token, () => { history.push('/admin/assessment/list'); });
    } else {
      this.setState(oldState => ({
        titleState: isEmpty(title) ? 'error' : 'success',
        descriptionState: isEmpty(description) ? 'error' : 'success',
        surveyInfo: { ...oldState.surveyInfo, survey: newSurvey },
      }));
    }
  };

  render() {
    const { classes } = this.props;
    const {
      surveyInfo, titleState, descriptionState, mode,
    } = this.state;
    const survey = {
      surveyInfo, titleState, descriptionState, mode,
    };
    return (
      <>
        {/*<Loading />*/}
        <Card>
          <CardHeader color="rose" text>
            <CardIcon color="rose">
              <Poll />
            </CardIcon>
            <h3 className={classes.cardIconTitle}>Add Assessment</h3>
            <Link to="/assessments" className={classes.linkDisplay}>
              <u>Back</u>
            </Link>
          </CardHeader>
          <CardBody>
            <SurveyForm
              survey={survey}
              change={this.change}
              classes={classes}
              changeQuestions={this.changeQuestions}
            />
          </CardBody>
        </Card>
      </>
    );
  }
}

export default compose(
  withStyles(validationFormStyle),
  connect(null, { createSurvey: () => {} }),
)(CreateAssessment);
