import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { AddPrinter } from './AddPrinter'

const PRINTERS = gql`
    query GetPrinters { printers {id,name,ipAddress, status} }
`;

const DELETE_PRINTER = gql`
  mutation DeletePrinter($id: String!) {
    removePrinter(id: $id) {
        message
    }
  }
`;

export function Printers() {
  const { loading, error, data, refetch } = useQuery(PRINTERS);
  const [deletePrinter] = useMutation(DELETE_PRINTER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <div>
      <AddPrinter refetch={refetch}/>
      {
        data.printers.map(({ id, name, ipAddress, status }) => (
            <div key={name}>
            <p>
                {name}: {ipAddress} - {status}
            </p>
            <button onClick={() => {
                deletePrinter({ variables: { id } })
                .then(res => { refetch();})
            }}>Delete</button>
            </div>
        ))
      }
  </div>
}
