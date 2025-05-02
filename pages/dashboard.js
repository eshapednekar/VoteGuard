import { useVoteGuard } from '../context/VoteGuardContext';
import Link from 'next/link';
import styled from 'styled-components';
import ElectionList from '../pages/components/electionList';
import { getContract } from "../contract";
import { useState, useEffect } from 'react';

const Wrapper = styled.div`
  padding: 2rem;
`;

const AddressBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-family: monospace;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
`;

export default function Dashboard() {
  const { currentAccount, connectWallet } = useVoteGuard();
  const [ elections, setElections ] = useState([]);
  

  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const contract = await getContract();

        // 1) read how many elections exist
        const nextIdBn = await contract.nextElectionId();
        const count    = nextIdBn.toNumber();  

        // 2) build an array of promises for each election
        const electionPromises = [];
        for (let id = 1; id < count; id++) {
          electionPromises.push(
            Promise.all([
              contract.getTitle(id),
              contract.isElectionOpen(id)
            ]).then(([ title, isOpen ]) => ({ id, title, isOpen }))
          );
        }

        // 3) await all of them in parallel
        const results = await Promise.all(electionPromises);

        // 4) store in state
        setElections(results);

      } catch (err) {
        console.error("couldn't load elections", err);
      }
    };

    fetchAllElections();
  }, []);

  return (
    <Wrapper>
      <h2>Dashboard</h2>
      {!currentAccount ? (
        <div>
          <p>Please connect your wallet.</p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </div>
      ) : (
        <>
          <p>Wallet Connected:</p>
          <AddressBox>{currentAccount}</AddressBox>

          <h2>All Elections</h2>
          {elections.length === 0
            ? <p>No elections found.</p>
            : elections.map(e => (
                <div key={e.id} style={{ marginBottom: '1rem' }}>
                  <strong>#{e.id}:</strong> {e.title} &nbsp;
                  <em>({e.isOpen ? 'Open' : 'Closed'})</em>
                </div>
              ))
          }
        </>
      )}
    </Wrapper>
  );
}