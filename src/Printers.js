import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const PRINTERS = gql`
    query GetPrinters { printers {id,name,ipAddress} }
`;

const ADD_PRINTER = gql`
    mutation AddPrinter($name: String!, $ipAddress: String!, $status: String!) {
    addPrinter(name: $name, ipAddress: $ipAddress, status: $status) {
        id
        name
        ipAddress
        status
    }
}`

const DELETE_PRINTER = gql`
  mutation DeletePrinter($id: String!) {
    removePrinter(id: $id) {
        bool
    }
  }
`;

export function Printers() {
  const { loading, error, data } = useQuery(PRINTERS);
  const [deletePrinter, deletePrinterRes] = useMutation(DELETE_PRINTER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.printers.map(({ id, name, ipAddress }) => (
    <div key={name}>
      <p>
        {name}: {ipAddress}
      </p>
      <button onClick={() => {
          deletePrinter({ variables: { id } });
      }}>Delete</button>
    </div>
  ));
}
