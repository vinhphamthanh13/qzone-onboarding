import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import SweetAlert from 'react-bootstrap-sweetalert'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormControl, FormLabel } from '@material-ui/core';
import defaultImage from "../../assets/img/default-avatar.png";
import Button from '../../components/CustomButtons/Button.jsx';
import Card from '../../components/Card/Card.jsx';
import CardHeader from '../../components/Card/CardHeader.jsx';
import CardText from '../../components/Card/CardText.jsx';
import CardBody from '../../components/Card/CardBody.jsx';
import CardFooter from '../../components/Card/CardFooter.jsx';
import validationFormStyle from '../../assets/jss/material-dashboard-pro-react/views/validationFormStyle.jsx';
import { createProvider } from '../../actions/provider';
import { fetchTimezoneOptions } from '../../actions/timezoneOptions';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import PhoneInput from 'react-phone-number-input';
import { fetchOrganizationsOptionByBusinessAdminId } from '../../actions/organizationOptions';
import Select from 'react-select';
import { BeatLoader } from 'react-spinners';
import { css } from '@emotion/core';
import ImageUpload from "../../components/CustomUpload/ImageUpload"
import { weekDays, defaultWorkingHours } from 'constants.js';
const override = css`
  margin: 0 auto;
  border-color: red;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const ProviderSchema = Yup.object().shape({
  email: Yup.string()
    .required('This field is required')
    .email('Please write correct format'),
  givenName: Yup.string()
    .required('This field is required')
    .min(3, 'Name should be atleast 3 letters')
    .max(40, 'Too Long'),
  telephone: Yup.string().required('Please enter a valid phone Number')
});

class ProviderCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createProviderError: [],
      businessAdminId: null,
      imagePreviewUrl: defaultImage,
      imageChange: false,
      showOtherAlert:false,
      message:'',
      data: {
        email: '',
        familyName: '',
        givenName: '',
        telephone: '',
        userStatus: 'FORCE_CHANGE_PASSWORD',
        userSub: null,
        userType: 'PROVIDER',
        provider: 'aws',
        providerInformation: {
          description: '',
          qualifications: '',
          tags: '',
          organizationId: null,
          timeZoneId: null,
          isAdmin: false,
          businessId: null,
          image: null,
        },
      }
    };
  }

  componentDidMount() {
    localStorage.removeItem('createProvider');
    this.props.fetchTimezoneOptions();
    const userSub = localStorage.getItem('userSub');
    if (userSub) {
      this.props.fetchOrganizationsOptionByBusinessAdminId(userSub);
    }
    this.setState({ businessAdminId: userSub });
    localStorage.removeItem('imageObject');
  }

  componentWillReceiveProps(nextProps) {
    const createProvider = localStorage.getItem('createProvider');
    if (createProvider !== null) {
      this.setState({ data: JSON.parse(createProvider) });
    }
    if (nextProps.imageLoading) {
      this.setState({ imageChange: true });
    }
  }

  doubleClick = (fieldName) => {
    this.setState({ isEditMode: fieldName });
  }

  changeCheckbox = (event, stateName, type) => {
    const { emailPreference } = this.state.provider;
    const currentIndex = emailPreference.indexOf(event.target.value);
    const newChecked = [...emailPreference];
    if (event.target.checked) {
      newChecked.push(event.target.value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    const { provider } = this.state;
    provider.emailPreference = newChecked;
    this.setState({
      provider
    });
  }

  handleProvider = (values) => {
    let imageObject = localStorage.getItem('imageObject');
    if (imageObject !== null) {
      imageObject = JSON.parse(imageObject);
    }
    if(values.providerInformation.organizationId === undefined
      || values.providerInformation.organizationId.value === undefined) {
      this.setState({ message: 'Please select organization' })
      this.setState({ showOtherAlert: true })
      return;
    }
    if(values.providerInformation.timeZoneId === undefined
      || values.providerInformation.timeZoneId.label === undefined) {
      this.setState({ message: 'Please select timezone' })
      this.setState({ showOtherAlert: true })
      return;
    }
    values.userType = 'PROVIDER';
    values.providerInformation = {
      ...values.providerInformation,
      businessId: localStorage.getItem('userSub'),
      image: imageObject,
      organizationId: values.providerInformation.organizationId.value,
      timeZoneId: values.providerInformation.timeZoneId.label,
      workingHours: Object.keys(values.providerInformation.workingHours).map(day => {
        const startTime = values.providerInformation.workingHours[day].startTime.split(':');
        const endTime = values.providerInformation.workingHours[day].endTime.split(':');
        return {
          day,
          startTime: {
            hour: parseInt(startTime[0], 10),
            minute: parseInt(startTime[1], 10),
          },
          endTime: {
            hour: parseInt(endTime[0], 10),
            minute: parseInt(endTime[1], 10),
          },
        }
      }),
    };

    localStorage.setItem('createProvider', JSON.stringify(values));
    this.props.createProvider(values, this.props.history);
  }

  change = (event, stateName, value) => {
    if (value !== undefined) {
      this.setState({ [stateName]: (value) })
    } else if (event.target.type === "number") {
      this.setState({ [stateName]: (event.target.valueAsNumber) })
    } else {
      this.setState({ [stateName]: (event.target.value) })
    }
  }

  changeProfileImage = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let files = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
        //provider: provider
      });
    };
    reader.readAsDataURL(files);
  }

  selectTimeZoneAndOrg = (setFieldValue, key) => (value) => {
    setFieldValue(key, value);
  }

  render() {
    const {
      classes,
      timezones,
      organizations,
      createProviderLoading,
      createProviderError
    } = this.props;
    if (createProviderLoading) {
      return (
        <BeatLoader
          css={override}
          sizeUnit="px"
          size={22}
          color="#e91e63"
          loading={createProviderLoading}
        />
      );
    }
    return (
      <Formik
        initialValues={{
          email: this.state.data.email,
          familyName: this.state.data.familyName,
          givenName: this.state.data.givenName,
          telephone: this.state.data.telephone,
          userStatus: 'FORCE_CHANGE_PASSWORD',
          provider: 'aws',
          userSub: this.state.data.userSub,
          userType: 'PROVIDER',
          providerInformation: {
            description: this.state.data.providerInformation.description,
            qualifications: this.state.data.providerInformation.qualifications,
            tags: this.state.data.providerInformation.tags,
            organizationId: {},
            timeZoneId: {},
            isAdmin: false,
            businessId: this.state.data.providerInformation.businessId,
            workingHours: { ...defaultWorkingHours }
          },
          imagePreviewUrl: this.props.imageObject || (this.state.image ? this.state.image.fileUrl : this.state.imagePreviewUrl)
        }}
        validationSchema={ProviderSchema}
        onSubmit={this.handleProvider}
        render={({
          values,
          errors,
          status,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
            <Card>
              <CardHeader color="rose" text>
                <CardText color="rose">
                  <h4 className={classes.cardTitle}>Create Provider</h4>
                </CardText>
              </CardHeader>
              <CardBody>
                {createProviderError !== null ? (
                  <CardFooter className={classes.justifyContentCenter}>
                    <div style={{ color: 'red' }}> {createProviderError.message}</div>
                  </CardFooter>) : (
                    <CardFooter className={classes.justifyContentCenter} />
                  )}
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${classes.labelHorizontalRadioCheckbox}`}
                    >
                      Time Zone
                  </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <Select
                        options={timezones}
                        value={values.providerInformation.timeZoneId}
                        name="providerInformation.timeZoneId"
                        onChange={this.selectTimeZoneAndOrg(setFieldValue, 'providerInformation.timeZoneId')}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={`${classes.labelHorizontal} ${classes.labelHorizontalRadioCheckbox}`}>Service Organization</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <Select
                        options={organizations}
                        value={values.providerInformation.organizationId}
                        name="providerInformation.organizationId"
                        onChange={this.selectTimeZoneAndOrg(setFieldValue, 'providerInformation.organizationId')}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem sm={3}>
                    <FormLabel className={classes.labelHorizontal}>
                      Working Hours
                    </FormLabel>
                  </GridItem>
                  <GridItem sm={9}>
                    <GridContainer>
                      {weekDays.map((day) => (
                        <GridItem className={classes.workingHours} xs={3} lg={2} key={`providerInformation.workingHours[${day}]`}>
                          <label>{day}</label>
                          <CustomInput
                            inputProps={{
                              placeholder: "Start Time",
                              type: "time",
                              name: `providerInformation.workingHours[${day}].startTime`
                            }}
                            onChange={handleChange}
                            value={values.providerInformation.workingHours[day].startTime}
                          />
                          <CustomInput
                            inputProps={{
                              placeholder: "End Time",
                              type: "time",
                              name: `providerInformation.workingHours[${day}].endTime`
                            }}
                            onChange={handleChange}
                            value={values.providerInformation.workingHours[day].endTime}
                          />
                        </GridItem>
                      ))}
                    </GridContainer>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelHorizontal}>Given Name</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <CustomInput
                      id="givenName"
                      name="givenName"
                      onChange={handleChange}
                      value={values.givenName}
                    />
                    {errors.givenName && touched.givenName ? (
                      <div style={{ color: 'red' }}>{errors.givenName}</div>
                    ) : null}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelHorizontal}>Family Name</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <CustomInput
                      id="familyName"
                      name="familyName"
                      onChange={handleChange}
                      value={values.familyName}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelHorizontal}>Email</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <CustomInput
                      id="email"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <div style={{ color: 'red' }}>{errors.email}</div>
                    ) : null}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelHorizontal}>Telephone</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <PhoneInput
                      id="telephone"
                      placeholder="e.g.+61 3 xxxx xxxx"
                      country="AU"
                      name="telephone"
                      value={values.telephone}
                      onChange={e => setFieldValue('telephone', e)}
                    />
                    {errors.telephone && touched.telephone ? (
                      <div style={{ color: 'red' }}>{errors.telephone}</div>
                    ) : null}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelHorizontal}>Description</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <CustomInput
                      id="providerInformation.description"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 3
                      }}
                      value={values.providerInformation.description}
                      onChange={handleChange}
                    />
                    {errors.description && touched.description && (
                      <div style={{ color: 'red' }}>{errors.description}</div>
                    )}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} md={12}>
                    <ImageUpload imagePreviewUrl={values.imagePreviewUrl} />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="rose" onClick={handleSubmit}>
                  Create
              </Button>
                <Button color="rose" onClick={this.props.history.goBack}>
                  Exit
              </Button>
              </CardFooter>
              <SweetAlert
                title={this.state.message}
                show={this.state.showOtherAlert}
                onConfirm={() => this.setState({ showOtherAlert: false })}
                onCancel={() => this.setState({ showOtherAlert: false })}
              />
            </Card>
          )}
      />
    );
  }
}

ProviderCreate.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => {
  return {
    imageError: state.image.imageError,
    imageLoading: state.image.imageLoading,
    timezones: state.options.timezone.tzOptions,
    organizations: state.options.organization.orgOptions,
    createProviderLoading: state.provider.createProviderLoading,
    createProviderError: state.provider.createProviderError
  };
};

const mapDispatchToProps = {
  createProvider,
  fetchTimezoneOptions,
  fetchOrganizationsOptionByBusinessAdminId,
};

export default compose(
  withStyles(validationFormStyle),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProviderCreate);
