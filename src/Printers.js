import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { AddPrinter } from './AddPrinter'

import {
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Container,
    CircularProgress
} from '@material-ui/core';

import {
    Delete
} from '@material-ui/icons'

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

  if (loading) return <Container style={{ textAlign: 'center' }}><CircularProgress/></Container>;
  if (error) return <p>Error :(</p>;

  return <Container>
  
      <AddPrinter refetch={refetch}/>
      {
        data.printers.map(({ id, name, ipAddress, status }) => (
            <ListItem key={name}>
                <ListItemText
                    primary={name + ' - ' + status}
                    secondary={ipAddress}
                />
                <ListItemIcon>
                    <IconButton
                        onClick={() => {
                            deletePrinter({ variables: { id } })
                            .then(res => refetch())
                        }}
                    >
                        <Delete/>
                    </IconButton>
                </ListItemIcon>
            </ListItem>
        ))
      }

  </Container>
}
