import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { AddPrinter } from './AddPrinter'
import { UpdatePrinter } from './UpdatePrinter';

import {
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Container,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip
} from '@material-ui/core';

import {
    Delete,
    Edit
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
  const [deletePrinter, delProps] = useMutation(DELETE_PRINTER);
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
        data.printers.map(({ id, name, ipAddress, status }) => (
            <ListItem key={name}>
                <ListItemText
                    primary={name.toUpperCase()}
                    secondary={ipAddress}
                />
                <ListItemIcon>
                    <Chip label={status} variant="default" style={{
                        backgroundColor: status === 'ACTIVE' ? 'green' : 'red',
                        color: '#ffffff'
                    }} />
                </ListItemIcon>
                <ListItemIcon>
                    <IconButton
                        onClick={() => {
                            setToUpdate({id, name, ipAddress, status})
                        }}
                    >
                        <Edit/>
                    </IconButton>
                </ListItemIcon>
                <ListItemIcon>
                    <IconButton
                        onClick={() => {
                            setToDelete({id, name})
                        }}
                    >
                        <Delete/>
                    </IconButton>
                </ListItemIcon>
            </ListItem>
        ))
      }

      {toUpdate && <UpdatePrinter toUpdate={toUpdate} setToUpdate={setToUpdate}/>}

      {
            toDelete &&
            <Dialog
                fullWidth
                maxWidth='sm'
                open={toDelete ? true : false}
                onClose={() => setToDelete(null)}
            >
                <DialogTitle>Delete {toDelete.name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {toDelete.name}?
                    <br/><br/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setToDelete(null)}>
                        No
                    </Button>
                    <Button
                        disabled={delProps.loading}
                        variant="contained"
                        color='primary'
                        onClick={() => {
                            deletePrinter({ variables: { id: toDelete.id } })
                            .then(res => {
                                refetch();
                                setToDelete(null);
                            })
                        }}
                    >
                        {
                            delProps.loading ?
                            "Deleting..." :
                            "Yes"
                        }
                    </Button>
                </DialogActions>
            </Dialog>
      }
  </Container>
}
