import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

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


  if (error) return <p>Error :(</p>;

  return ( 
    <div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder='Name'/>

        <input value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder='IP Address'/>

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

        <button disabled={loading} onClick={() => {
            addPrinter({ variables: {name, ipAddress, status} })
            .then(() => {
              setName("");
              setIpAddress("")
              props.refetch()
            })
        }}>
          {
            loading ?
            "Loading...." :
            "Add"
          }
        </button>
    </div>
  );
}
