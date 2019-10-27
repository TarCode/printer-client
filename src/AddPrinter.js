import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core'

const ADD_PRINTER = gql`
    mutation AddPrinter($name: String!, $ipAddress: String!, $status: StatusType!) {
    addPrinter(name: $name, ipAddress: $ipAddress, status: $status) {
        id
        name
        ipAddress
        status
    }
}`

export function AddPrinter(props) {
  const [addPrinter, { data, loading, error }] = useMutation(ADD_PRINTER);

  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [openAdd, setOpenAdd] = useState(false);


  if (error) return <p>Error :(</p>;

  return ( 
    <div>
        <Button onClick={() => setOpenAdd(true)}>Add Printer</Button>

        <Dialog fullWidth maxWidth='sm' open={openAdd} onClose={() => setOpenAdd(false)}>
          <DialogTitle>Add Printer</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth
              value={name} 
              onChange={e => setName(e.target.value)} 
              label='Name'
            />
            <br/>
            <TextField 
              fullWidth
              value={ipAddress} 
              onChange={e => setIpAddress(e.target.value)} 
              label='IP Address'
            />
            <br/>
            <a
              onClick={() => {
                if (status === "ACTIVE") {
                  setStatus("INACTIVE")
                } else {
                  setStatus("ACTIVE")
                }
              }}
            >
              {status}
            </a>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button variant='contained' disabled={loading || !name || !ipAddress} onClick={() => {
                addPrinter({ variables: {name, ipAddress, status} })
                .then(() => {
                  setName("");
                  setIpAddress("");
                  props.refetch();
                  setOpenAdd(false);
                })
            }}>
              {
                loading ?
                "Loading...." :
                "Add"
              }
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}
