# CBI REST API Services

The CBI services are the core interface for communicating with CBI. The Services are organized around REST with predictable resource oriented URLs. Standard HTTP verbs, codes and authentication methods are used alongside JSON to ensure ease of implementation.

JSON is returned by all API responses. API errors will result in a JSON response as well as a corresponding HTTP response code. For more on errors take a look at errors.

## Pagination

Almost all listing endpoints include a way to perform pagination. The default pagination method offered by CBI is offset pagination, which allows navigation to an arbitrary point in a list of results as well as via next and prev attributes. The default page size is 100 but can be changed by adding a limit query parameter to the request URL.

## Filters

Most listing pages also include a way to filter and/or sort the returned list of objects. All filtering and sorting is done via query parameters in the GET request.

Each endpoint’s documentation contains a list of fields that are available for filtering and sorting. To filter by a field, include it in the URL as a standard query parameter with a ? delimiting the URL and the start of the query parameters and a & between each filtered field.

To sort results, an endpoint will often inlcude an orderby attribute. Check the specific endpoints documentation on what fields can be used for sorting.

## Errors

CBI errors return a response message (formatted in JSON) as well as a standard HTTP response code.

The JSON error respone generally includes a message string. If an error occurred on a specific attribute or key they will be outputted in the data object.

## Webhook Events

CBI has a collection of internal events that can be configured to fire off custom webhooks.

Webhooks should always be created with a secure and private secret key (See the webhook API endpoint docs for more about creating webhooks). The secret key can be used to identify valid CBI requests to your server. The secret should be checked in the Authorization header when receiving a webhook.

CBI expects a 200 OK HTTP response when webhooks are called. If a 200 response is not returned, CBI will retry the webhook up to a max of 12 times with a gradually increasing delay between each retry.

### Events

CBI support multiple webhook events

