import React from "react";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Search from "@material-ui/icons/Search";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import {ClipLoader} from 'react-spinners';
import {css} from '@emotion/core';

import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardText from "../../components/Card/CardText.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import {fetchProvidersByBusinessAdminId} from '../../actions/provider';
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import listPageStyle from "../../assets/jss/material-dashboard-pro-react/views/listPageStyle.jsx"

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
class ProviderList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.providers })
  }

  componentDidMount() {
    let sub = localStorage.getItem('userSub');
    this.props.fetchProvidersByBusinessAdminId(sub);
  }

  render() {
    const { classes, fetchProvidersLoading, fetchProviderError, providers } = this.props;
    let data = [];
    if (fetchProvidersLoading) {
      return < ClipLoader
        className={override}
        sizeUnit={"px"}
        size={100}
        color={'#123abc'}
        loading={fetchProvidersLoading}
      />
    }
    else if (fetchProviderError) {
      return <div className="alert alert-danger">Error: {providers}</div>
    }
    else {
        data = (
        <GridContainer>
          {this.state.data.map((provider, index) => {
            return (
              <GridItem xs={12} sm={12} md={3}>
                <Card product className={classes.cardHover} >
                  {/* <CardHeader image className={classes.cardHeaderHover}>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img src={priceImage1} alt="..." />
                    </a>
                  </CardHeader> */}
                  <CardBody>
                    <div className={classes.cardHoverUnder}>
                      <Tooltip
                        id="tooltip-top"
                        title="Remove"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button
                          color="danger"
                          simple
                          justIcon>
                          <Delete className={classes.underChartIcons} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        id="tooltip-top"
                        title="Edit"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Link to={`/provider/edit/${provider.id}`}>
                          <Button color="success" simple justIcon >
                            <Edit className={classes.underChartIcons} />
                          </Button>
                        </Link>
                      </Tooltip>
                    </div>
                    <h4 className={classes.cardProductTitle}>
                      {provider.givenName} {/*provider.familyName*/}
                    </h4>
                    <p className={classes.cardProductDesciprion}>
                      {provider.id}
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
            )
          })}
        </GridContainer>

      )
    }
    return (

      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardText color="rose">
                  <h4 className={classes.cardTitle}>Provider List</h4>
                </CardText>
                <div className="centerDiv">
                  <div className="search" md={3}>
                    <CustomInput
                      formControlProps={{
                        className: classes.top + " " + classes.search
                      }}
                      inputProps={{
                        placeholder: "Search",
                        inputProps: {
                          "aria-label": "Search",
                          className: classes.searchInput
                        }
                      }}
                    />
                    <Button
                      color="white"
                      aria-label="edit"
                      justIcon
                      round
                      className={classes.top + " " + classes.searchButton} >
                      <Search
                        className={classes.headerLinksSvg + " " + classes.searchIcon}
                      />
                    </Button>
                  </div>
                </div>
                <Link to={`/provider/create`}>
                  <Button size="sm" className={classes.buttonDisplay}>
                    New Provider
                  </Button>
                </Link>

              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>
        {data}
         </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    providers: state.provider.providers,
    fetchProvidersLoading: state.provider.fetchProvidersLoading,
    fetchProvidersError: state.provider.fetchProvidersError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProvidersByBusinessAdminId: (sub) => dispatch(fetchProvidersByBusinessAdminId(sub)),
  }
}

export default compose(
  withStyles(listPageStyle),
  connect(mapStateToProps, mapDispatchToProps),
)(ProviderList);
