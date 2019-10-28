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
    mutation UpdatePrinter($id: String!, $printerName: String!, $ipAddress: String!, $printerStatus: StatusType!) {
    updatePrinter(id: $id, printerName: $printerName, ipAddress: $ipAddress, printerStatus: $printerStatus) {
        id
    }
}`

export function UpdatePrinter(props) {
  const [updatePrinter, { loading, error }] = useMutation(UPDATE_PRINTER);

  const [printerName, setPrinterName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [printerStatus, setPrinterStatus] = useState("ACTIVE");

  const { toUpdate, setToUpdate } = props;

  useEffect(() => {
    setPrinterName(props.toUpdate.printerName);
    setIpAddress(props.toUpdate.ipAddress);
    setPrinterStatus(props.toUpdate.printerStatus);
  }, [props.toUpdate.printerName, props.toUpdate.ipAddress, props.toUpdate.printerStatus]);

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
          <DialogTitle>Update Printer {toUpdate.printerName}</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth
              value={printerName} 
              onChange={e => setPrinterName(e.target.value)} 
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
                  checked={printerStatus === 'ACTIVE'}
                  onChange={() => {
                    if (printerStatus === 'ACTIVE') {
                      setPrinterStatus('INACTIVE')
                    } else {
                      setPrinterStatus('ACTIVE')
                    }
                  }}
                  value={printerStatus}
                  color="primary"
                />
              }
              label={printerStatus}
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
                !printerName || 
                !ipAddress ||
                (ipAddress.length > 0 && !ipIsValid)
              } 
              onClick={() => {
                updatePrinter({ variables: {id: props.toUpdate.id, printerName, ipAddress, printerStatus} })
                .then(() => {
                  setPrinterName("");
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
