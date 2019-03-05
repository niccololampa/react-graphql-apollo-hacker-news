import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

// You’re importing the required dependencies from the installed packages.
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';

// for security token
// Now that users are able to login and obtain a token that authenticates them against the GraphQL server, you actually need to make sure that the token gets attached to all requests that are sent to the API.
import { setContext } from 'apollo-link-context';
import { AUTH_TOKEN } from './constants';

// Here you create the httpLink that will connect your ApolloClient instance with the GraphQL API, your GraphQL server will be running on http://localhost:4000.

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

// for security
//This middleware will be invoked every time ApolloClient sends a request to the server. Apollo Links allow you to create middlewares that let you modify requests before they are sent to the server.
// how it works in our code: first, we get the authentication token from localStorage if it exists; after that, we return the headers to the context so httpLink can read them.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
// Now you instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
const client = new ApolloClient({
  // link: httpLink,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// ReactDOM.render(<App />, document.getElementById('root'));

// Finally you render the root component of your React app.
// The App is wrapped with the higher - order component ApolloProvider that gets passed the client as a prop.

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
