import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'components/Loading/Loading';
import Alert from 'react-s-alert';
import { InsertLink } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import Button from '../../components/CustomButtons/Button.jsx';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import tableStyle from '../../assets/jss/material-dashboard-pro-react/components/tableStyle';
import listPageStyle from '../../assets/jss/material-dashboard-pro-react/views/listPageStyle';
import Card from '../../components/Card/Card.jsx';
import CardText from '../../components/Card/CardText.jsx';
import CardHeader from '../../components/Card/CardHeader.jsx';
import CardBody from '../../components/Card/CardBody';
import { deleteSurveyByIdAction, resetSurveyStatus, setSurveysAction } from '../../actions/surveys';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import { eUserType } from 'constants.js';

class Survey extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      isLoading,
      isError,
      errorMessage,
      surveys,
      isDeletedSurveyById,
    } = props;
    const {
      isLoading: cachedLoading,
      isError: cachedError,
      errorMessage: cachedErrorMessage,
      surveys: cachedSurveys,
      isDeletedSurveyById: cachedIsDeletedSurveyById,
    } = state;

    if (
      isLoading !== cachedLoading
      || isError !== cachedError
      || errorMessage !== cachedErrorMessage
      || surveys !== cachedSurveys
      || isDeletedSurveyById !== cachedIsDeletedSurveyById
    ) {
      return {
        isLoading,
        isError,
        errorMessage,
        surveys,
        isDeletedSurveyById,
      };
    }

    return null;
  }

  state = {
    isLoading: false,
    isError: false,
    errorMessage: '',
    surveys: null,
    isDeletedSurveyById: null,
  };

  componentDidMount() {
    const { userDetail } = this.props;
    const assessorId = userDetail.userType === eUserType.provider
      ? userDetail.providerInformation.businessId
      : userDetail.id;
    this.props.setSurveysAction(assessorId);
  }

  componentDidUpdate(prevProps) {
    const {
      setSurveysAction: setSurveys,
      resetSurveyStatus: resetSurveyStatusAction,
    } = this.props;
    const { isDeletedSurveyById } = prevProps;
    const { isDeletedSurveyById: cachedIsDeletedSurveyById } = this.state;
    if (cachedIsDeletedSurveyById && cachedIsDeletedSurveyById !== isDeletedSurveyById) {
      const { userDetail } = this.props;
      const assessorId = userDetail.userType === eUserType.provider
        ? userDetail.providerInformation.businessId
        : userDetail.id;
      resetSurveyStatusAction();
      setSurveys(assessorId);
    }
  }

  handleEditSurvey = id => () => {
    console.log('Edit Survey', id);
  };

  handleDeleteSurvey = id => () => {
    const { deleteSurveyByIdAction: deleteSurveyById } = this.props;
    const { surveys } = this.state;
    const newSurveys = surveys.filter(survey => survey.id !== id);
    this.setState({ surveys: newSurveys }, () => deleteSurveyById(id));
  };

  handleCopyLink = event => {
    event.preventDefault();
    Alert.success('Survey link is copied to your clipboard!')
  };

  render() {
    const { classes } = this.props;
    const { surveys, isLoading } = this.state;

    return (
      <div>
        {isLoading && <Loading />}
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardText color="rose">
                  <h4 className={classes.cardTitle}>Assessments</h4>
                </CardText>
                <Link to="/assessments/new">
                  <Button
                    size="sm"
                    className={classes.buttonDisplay}
                  >
                    New Assessment
                  </Button>
                </Link>
              </CardHeader>
              <CardBody>
                {surveys && surveys.length > 0 && (
                  <Paper>
                    <Table aria-labelledby="businessCategories">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.cellHeaderBold} size="small">No</TableCell>
                          <TableCell className={classes.cellHeaderBold}>Name</TableCell>
                          <TableCell className={classes.cellHeaderBold} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {surveys.map((survey, index) => (
                          <TableRow key={survey.id} classes={{ root: classes.row }}>
                            <TableCell size="small">{index + 1}</TableCell>
                            <TableCell>{survey.title}</TableCell>
                            <TableCell align="center">
                              <CopyToClipboard text={survey.url}>
                                <Button
                                  color="success"
                                  simple justIcon
                                  onClick={this.handleCopyLink}
                                >
                                  <Tooltip
                                    id="tooltip-top"
                                    title="Copy Link"
                                    placement="bottom"
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <InsertLink />
                                  </Tooltip>
                                </Button>
                              </CopyToClipboard>
                              {/*<Tooltip*/}
                              {/*  id="tooltip-top"*/}
                              {/*  title="Edit"*/}
                              {/*  placement="bottom"*/}
                              {/*  classes={{ tooltip: classes.tooltip }}*/}
                              {/*>*/}
                              {/*  <Button*/}
                              {/*    color="success"*/}
                              {/*    simple justIcon*/}
                              {/*    onClick={this.handleEditSurvey(survey.id)}*/}
                              {/*  >*/}
                              {/*    <Edit className={classes.underChartIcons} />*/}
                              {/*  </Button>*/}
                              {/*</Tooltip>*/}
                              <Button
                                onClick={this.handleDeleteSurvey(survey.id)}
                                color="danger"
                                simple
                                justIcon
                              >
                                <Tooltip
                                  id="tooltip-top"
                                  title="Remove"
                                  placement="bottom"
                                  classes={{ tooltip: classes.tooltip }}
                                >
                                  <Delete className={classes.underChartIcons} />
                                </Tooltip>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

const mapStateToProps = ({ common, surveys, user }) => ({
  isLoading: common.isLoading,
  isError: common.isError,
  errorMessage: common.errorMessage,
  surveys: surveys.surveys,
  isDeletedSurveyById: surveys.isDeletedSurveyById,
  userDetail: user.userDetail
});

export default connect(
  mapStateToProps,
  {
    setSurveysAction,
    deleteSurveyByIdAction,
    resetSurveyStatus,
  },
)(withStyles(
  theme => ({
    ...tableStyle(theme),
    ...listPageStyle,
  }), { withTheme: true }
)(Survey));
