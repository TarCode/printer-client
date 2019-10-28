import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch
} from '@material-ui/core'

import {Add} from '@material-ui/icons';

import { validateIPaddress } from '../utils'

const ADD_PRINTER = gql`
    mutation AddPrinter($printerName: String!, $ipAddress: String!, $printerStatus: StatusType!) {
    addPrinter(printerName: $printerName, ipAddress: $ipAddress, printerStatus: $printerStatus) {
        id
        printerName
        ipAddress
        printerStatus
    }
}`

export function AddPrinter(props) {
  const [addPrinter, { loading, error }] = useMutation(ADD_PRINTER);

  const [printerName, setPrinterName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [printerStatus, setPrinterStatus] = useState("ACTIVE");

  const [openAdd, setOpenAdd] = useState(false);

  const ipIsValid = validateIPaddress(ipAddress);


  if (error) return <p>Error :(</p>;

  return ( 
    <div>
        <h2>
          Printers
          <IconButton onClick={() => setOpenAdd(true)}>
            <Add/>
          </IconButton>
        </h2>

        <Dialog 
          fullWidth 
          maxWidth='sm' 
          open={openAdd} 
          onClose={() => setOpenAdd(false)}
        >
          <DialogTitle>Add Printer</DialogTitle>
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
            <Button onClick={() => setOpenAdd(false)}>
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
                addPrinter({ variables: {printerName, ipAddress, printerStatus} })
                .then(() => {
                  setPrinterName("");
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
