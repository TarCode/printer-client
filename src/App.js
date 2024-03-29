import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Printers } from './containers/Printers'
import './App.css';

const client = new ApolloClient({
  uri: 'https://ywu7r0e3k0.execute-api.ap-south-1.amazonaws.com/dev/graphql',
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Printers/>
    </ApolloProvider>
  );
}

export default App;