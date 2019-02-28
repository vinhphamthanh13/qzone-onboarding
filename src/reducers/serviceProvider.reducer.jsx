import {provider} from '../constants/Provider.constants'
import {organization} from '../constants/Organization.constants'
import {location} from '../constants/Location.constants'

const initialState = {

    serviceProviders: [],
    serviceProvider: [],
    serviceProviderLoading: false,
    serviceProviderError: null,

    providers: [],
    providerLoading: false,
    providerLoadingError: false,

    organizations: [],
    organizationLoading: false,
    organizationLoadingError: false,

    locations: [],
    locationLoading: false,
    locationLoadingError: false,

}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case serviceProvider.FETCH_SERVICE_PROVIDERS_LOADING:
            return { ...state, serviceProviderLoading: true }
        case serviceProvider.FETCH_SERVICE_PROVIDERS_SUCCESS:
            return { ...state, serviceProviders: action.payload.data, serviceProviderLoading: false }
        case serviceProvider.FETCH_SERVICE_PROVIDERS_FAILURE:
            return { ...state, serviceProviders: [], serviceProviderError: action.payload.error, serviceProviderLoading: false }

        case serviceProvider.CREATE_SERVICE_PROVIDER_LOADING:
        case serviceProvider.EDIT_SERVICE_PROVIDER_LOADING:
            return { ...state, serviceProviderLoading: true }
        case serviceProvider.CREATE_SERVICE_PROVIDER_SUCCESS:
        case serviceProvider.EDIT_SERVICE_PROVIDER_SUCCESS:
            return { ...state, serviceProvider: action.payload.data, serviceProviderLoading: false }
        case serviceProvider.CREATE_SERVICE_PROVIDER_FAILURE:
        case serviceProvider.EDIT_SERVICE_PROVIDER_FAILURE:
            return { ...state, serviceProvider:[], serviceProviderError: action.payload.error, serviceProviderLoading: false }

        case serviceProvider.FETCH_SERVICE_PROVIDER_LOADING:
            return { ...state, serviceProviderLoading: true }
        case serviceProvider.FETCH_SERVICE_PROVIDER_SUCCESS:
            return { ...state, serviceProvider: action.payload.data, serviceProviderLoading: false }
        case serviceProvider.FETCH_SERVICE_PROVIDER_FAILURE:
            return { ...state, serviceProvider:[], getServiceProviderError: action.payload.error, serviceProviderLoading: false }

        case provider.FETCH_PROVIDERS_LOADING:
            return { ...state, providerLoading: true }
        case provider.FETCH_PROVIDERS_SUCCESS:
            return { ...state, providers: action.payload.data, providerLoading: false }
        case provider.FETCH_PROVIDERS_FAILURE:
            return { ...state, providers: [], providerLoadingError: action.payload.error, providerLoading: false }

      case organization.FETCH_ORGANIZATIONS_LOADING:
            return { ...state, organizationLoading: true }
      case organization.FETCH_ORGANIZATIONS_SUCCESS:
            return { ...state, organizations: action.payload.data, organizationLoading: false }
      case organization.CREATE_ORGANIZATION_FAILURE:
            return { ...state, organizations: [], organizationLoadingError: action.payload.error, organizationLoading: false }

      case location.FETCH_LOCATIONS_LOADING:
        return { ...state, locationLoading: true }
      case location.FETCH_LOCATIONS_SUCCESS:
        return { ...state, locations: action.payload.data, locationLoading: false }
      case location.FETCH_LOCATIONS_FAILURE:
        return { ...state, locations: [], locationLoadingError: action.payload.error, locationLoading: false }

      default:
            return state;
    }
}

export default reducer;
