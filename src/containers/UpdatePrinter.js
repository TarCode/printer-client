import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from '@material-ui/core'


import { validateIPaddress } from '../utils'

const UPDATE_PRINTER = gql`
    mutation UpdatePrinter($id: String!, $name: String!, $ipAddress: String!, $status: StatusType!) {
    updatePrinter(id: $id, name: $name, ipAddress: $ipAddress, status: $status) {
        id
        name
        ipAddress
        status
    }
}`

export function UpdatePrinter(props) {
  const [updatePrinter, { loading, error }] = useMutation(UPDATE_PRINTER);

  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const { toUpdate, setToUpdate } = props;

  useEffect(() => {
    setName(props.toUpdate.name);
    setIpAddress(props.toUpdate.ipAddress);
    setStatus(props.toUpdate.status);
  }, [props.toUpdate.name, props.toUpdate.ipAddress, props.toUpdate.status]);

  const ipIsValid = validateIPaddress(ipAddress);


  if (error) return <p>Error :(</p>;

  return ( 
    <div>
        <Dialog 
          fullWidth 
          maxWidth='sm' 
          open={toUpdate ? true : false} 
          onClose={() => setToUpdate(null)}
        >
          <DialogTitle>Update Printer {toUpdate.name}</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth
              value={name} 
              onChange={e => setName(e.target.value)} 
              label='Name'
            />
            <br/><br/>
            <TextField 
              fullWidth
              value={ipAddress} 
              onChange={e => setIpAddress(e.target.value)} 
              label='IP Address'
            />
            <br/>
              {
                ipAddress.length > 0 && !ipIsValid ?
                <p style={{ color: 'red'}}>Please enter a valid IP address</p> :
                null
              }
            <br/>

            <FormControlLabel
              control={
                <Switch
                  checked={status === 'ACTIVE'}
                  onChange={() => {
                    if (status === 'ACTIVE') {
                      setStatus('INACTIVE')
                    } else {
                      setStatus('ACTIVE')
                    }
                  }}
                  value={status}
                  color="primary"
                />
              }
              label={status}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setToUpdate(null)}>
              Cancel
            </Button>
            <Button 
              variant='contained'
              color='primary'
              disabled={
                loading || 
                !name || 
                !ipAddress ||
                (ipAddress.length > 0 && !ipIsValid)
              } 
              onClick={() => {
                updatePrinter({ variables: {id: props.toUpdate.id, name, ipAddress, status} })
                .then(() => {
                  setName("");
                  setIpAddress("");
                  props.refetch();
                  setToUpdate(null);
                })
            }}>
              {
                loading ?
                "Loading...." :
                "Update"
              }
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}
