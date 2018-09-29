import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { InputAdornment, Checkbox, FormControlLabel } from "@material-ui/core";
import { Email, LockOutline, Check } from "@material-ui/icons";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import registerPageStyle from "../../assets/jss/material-dashboard-pro-react/views/registerPageStyle";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      registerEmail: "",
      registerEmailState: "",
      registerPassword: "",
      registerPasswordState: "",
      registerConfirmPassword: "",
      registerConfirmPasswordState: "",
      registerCheckbox: false,
      registerCheckboxState: ""
    };
    this.change = this.change.bind(this);
  }
  // handleToggle(value) {
  //   const { checked } = this.state;
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   this.setState({
  //     checked: newChecked
  //   });
  // }

  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }

  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }

  compare(string1, string2) {
    if (string1 === string2) {
      return true;
    }
    return false;
  }

  registerClick() {
    if (this.state.registerEmailState === "") {
      this.setState({ registerEmailState: "error" });
    }
    if (this.state.registerPasswordState === "") {
      this.setState({ registerPasswordState: "error" });
    }
    if (this.state.registerConfirmPasswordState === "" || this.state.registerPassword !== this.state.registerConfirmPassword) {
      this.setState({ registerConfirmPasswordState: "error" });
    }
    if (this.state.registerCheckboxState === "" ) {
      this.setState({ registerCheckboxState: "error" });
    }
    if (this.state.registerEmailState === "success" && this.state.registerPasswordState === "success" && this.state.registerConfirmPasswordState === "success" && this.state.registerCheckboxState === "success") {
      window.location = '/dashboard'
    }
  }

  change(event, stateName, type, stateNameEqualTo, maxValue) {
    
    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        this.setState({[stateName]: event.target.value})
        break;
      case "password":
        if (this.verifyLength(event.target.value, 3)) {
          this.setState({ [stateName + "State"]: "success" });
          if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
            this.setState({ [stateNameEqualTo + "State"]: "success" });
          } else {
            this.setState({ [stateNameEqualTo + "State"]: "error" });
          }
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        this.setState({[stateName]: event.target.value})
        break;
      case "equalTo":
        if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        this.setState({[stateName]: event.target.value})
        break;
      case "checkbox":
        if (event.target.checked) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        this.setState({[stateName]: event.target.value})
        break;
      default:
        break;
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form>
              <Card className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="rose">
                  <h4 className={classes.cardTitle}>Register</h4>
                  <div className={classes.socialLine}>
                    <Button
                      justIcon
                      href="https://www.twitter.com"
                      target="_blank"
                      color="transparent">
                      <i className={"fab fa-twitter"} />
                    </Button>
                    <Button
                      justIcon
                      href="https://www.facebook.com"
                      target="_blank"
                      color="transparent">
                      <i className={"fab fa-facebook"} />
                    </Button>
                    <Button
                      justIcon
                      href="https://www.plus.google.com"
                      target="_blank"
                      color="transparent">
                      <i className={"fab fa-google-plus-g"} />
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="Email"
                    success={this.state.registerEmailState === "success"}
                    error={this.state.registerEmailState === "error"}
                    id="registeremail"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event =>
                        this.change(event, "registerEmail", "email"),
                      type: "email",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    success={this.state.registerPasswordState === "success"}
                    error={this.state.registerPasswordState === "error"}
                    id="registerPassword"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event =>
                        this.change(event, "registerPassword", "password", "registerConfirmPassword"),
                      type: "password",
                      endAdornment: (
                        <InputAdornment position="end">
                          <LockOutline
                            className={classes.inputAdornmentIcon}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Confirm Password"
                    success={this.state.registerConfirmPasswordState === "success"}
                    error={this.state.registerConfirmPasswordState === "error"}
                    id="registerConfirmPassword"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event =>
                        this.change(event,"registerConfirmPassword", "equalTo","registerPassword"),
                      type: "password",
                      endAdornment: (
                        <InputAdornment position="end">
                          <LockOutline
                            className={classes.inputAdornmentIcon}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={event =>
                          this.change(event, "registerCheckbox", "checkbox")
                        }
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked
                        }}
                      />
                    }
                    classes={{
                      label:
                        classes.label +
                        (this.state.registerCheckboxState === "error"
                          ? " " + classes.labelError
                          : "")
                    }}
                    label={
                      <span>
                        I agree to the terms and conditions
                        
                      </span>
                    }
                  />
                  <div className={classes.center}>
                    <Button color="rose" simple size="lg" block onClick={this.registerClick.bind(this)}>
                      Get started
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(registerPageStyle)(RegisterPage);
