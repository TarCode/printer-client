import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { AddPrinter } from './AddPrinter'
import { UpdatePrinter } from './UpdatePrinter';
import { DeletePrinter } from './DeletePrinter';

import {
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Container,
    CircularProgress,
    Chip
} from '@material-ui/core';

import {
    Delete,
    Edit
} from '@material-ui/icons'

const PRINTERS = gql`
    query GetPrinters { printers {id,printerName,ipAddress, printerStatus} }
`;

export function Printers() {
  const { loading, error, data, refetch } = useQuery(PRINTERS);
  const [toDelete, setToDelete] = useState(null);
  const [toUpdate, setToUpdate] = useState(null);

  if (loading) return (
    <Container style={{ textAlign: 'center', marginTop: '40vh' }}>
        <CircularProgress/>
    </Container>
  );

  if (error) return <p>Error :(</p>;

  return <Container>
      <AddPrinter refetch={refetch}/>
      <p>Welcome to the printer management dashboard</p>
      {
        data.printers.map(({ id, printerName, ipAddress, printerStatus }) => (
            <ListItem key={printerName}>
                <ListItemText
                    primary={printerName.toUpperCase()}
                    secondary={ipAddress}
                />
                <ListItemIcon>
                    <Chip label={printerStatus} variant="default" style={{
                        backgroundColor: printerStatus === 'ACTIVE' ? 'green' : 'red',
                        color: '#ffffff'
                    }} />
                </ListItemIcon>
                <ListItemIcon>
                    <IconButton
                        onClick={() => {
                            setToUpdate({id, printerName, ipAddress, printerStatus})
                        }}
                    >
                        <Edit/>
                    </IconButton>
                </ListItemIcon>
                <ListItemIcon>
                    <IconButton
                        onClick={() => {
                            setToDelete({id, printerName})
                        }}
                    >
                        <Delete/>
                    </IconButton>
                </ListItemIcon>
            </ListItem>
        ))
      }

      {toUpdate && <UpdatePrinter toUpdate={toUpdate} setToUpdate={setToUpdate} refetch={refetch}/>}

      {toDelete && <DeletePrinter toDelete={toDelete} setToDelete={setToDelete} refetch={refetch}/>}
  </Container>
}
