import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Printers } from './Printers'

import './App.css';

const client = new ApolloClient({
  uri: 'https://ywu7r0e3k0.execute-api.ap-south-1.amazonaws.com/dev/graphql',
});


function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app 🚀</h2>
        <Printers/>
      </div>
    </ApolloProvider>
  );
}

export default App;