import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const PRINTERS = gql`
    query getPrinters { printers {id,name,ipAddress} }
`;

export function Printers() {
  const { loading, error, data } = useQuery(PRINTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.printers.map(({ name, ipAddress }) => (
    <div key={name}>
      <p>
        {name}: {ipAddress}
      </p>
    </div>
  ));
}
