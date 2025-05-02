import { useVoteGuard } from '../context/VoteGuardContext';
import Link from 'next/link';
import styled from 'styled-components';
import { getContract } from "../contract";
import { useState, useEffect } from 'react';
import { Wrapper, Button, Card } from '../components/ui';
import { FaWallet } from 'react-icons/fa';


const AddressBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-family: monospace;
`;

const Title = styled.h1`
  margin-bottom: 16px;
  font-family: system-ui, sans-serif;
  color: #333; 
`;

const IconWrapper = styled.div`
  background: #0070F3;
  color: #fff;
  width: 64px; height: 64px;
  margin:  0 auto 32px; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
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
      <IconWrapper><FaWallet /></IconWrapper>
      <Title>Welcome!</Title>
      {!currentAccount ? (
        <div>
          <p>Please connect your wallet to get started.</p>
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
              <Link href={`/vote/${e.id}`} key={e.id}>
              <a 
              style={{
                textDecoration: 'none',
                color: 'inherit',        // ← make it inherit whatever the Card’s color is
              }}
               >
                <Card>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span><strong>#{e.id}:</strong> {e.title}</span>
                    <em>({e.isOpen ? 'Open' : 'Closed'})</em>
                  </div>
                </Card>
              </a>
            </Link>
         ))}
         </>
      )}
    </Wrapper>
  );
}