import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';

// This query looks similar to the feed query that’s used in LinkList. However, this time it takes in an argument called filter that will be used to constrain the list of links you want to retrieve.

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

class Search extends Component {
  state = {
    links: [],
    filter: ''
  };

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }

  //   The implementation is almost trivial. You’re executing the FEED_SEARCH_QUERY manually and retrieving the links from the response that’s returned by the server. Then these links are put into the component’s state so that they can be rendered.

  _executeSearch = async () => {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    const links = result.data.feed.links;
    this.setState({ links });
  };
}

// Perfect, the query is defined! But this time we actually want to load the data every time the user hits the search-button - not upon the initial load of the component.
// That’s the purpose of the withApollo function. This function injects the ApolloClient instance that you created in index.js into the Search component as a new prop called client.
// This client has a method called query which you can use to send a query manually instead of using the graphql higher-order component.
export default withApollo(Search);
