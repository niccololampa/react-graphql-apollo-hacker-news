import React, { Component } from 'react';
import '../styles/App.css';
import LinkList from './LinkList';
import CreateLink from './CreateLink';

class App extends Component {
  render() {
    return (
      <div>
        <LinkList />
        <CreateLink />
      </div>
    );
  }
}

export default App;

// endpoint
// https://us1.prisma.sh/niccolo-lampa-2b1f85/nl-react-graphql-apollo-hacker-news/dev
