import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@material-ui/core';



const DELETE_PRINTER = gql`
  mutation DeletePrinter($id: String!) {
    removePrinter(id: $id) {
        message
    }
  }
`;

export function DeletePrinter(props) {
  const [deletePrinter, delProps] = useMutation(DELETE_PRINTER);
  const {toDelete, setToDelete} = props;

  return <Dialog
    fullWidth
    maxWidth='sm'
    open={toDelete ? true : false}
    onClose={() => setToDelete(null)}
    >
        <DialogTitle>Delete {toDelete.printerName}</DialogTitle>
        <DialogContent>
            Are you sure you want to delete {toDelete.printerName}?
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
                        props.refetch();
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
