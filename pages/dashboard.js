import { useVoteGuard } from '../context/VoteGuardContext';
import Link from 'next/link';
import styled from 'styled-components';
import { getContract } from "../contract";
import { useState, useEffect } from 'react';
import { Wrapper, Button } from '../components/ui';
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

const ElectionCard = styled(Link)`
  display: block;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  color: inherit;           
  text-decoration: none;    
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`


export default function Dashboard() {
  const { currentAccount, connectWallet } = useVoteGuard();
  const [ elections, setElections ] = useState([]);
  

  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const contract = await getContract();

        const nextIdBn = await contract.nextElectionId();
        const count    = nextIdBn.toNumber();  

        const electionPromises = [];
        for (let id = 1; id < count; id++) {
          electionPromises.push(
            Promise.all([
              contract.getTitle(id),
              contract.isElectionOpen(id)
            ]).then(([ title, isOpen ]) => ({ id, title, isOpen }))
          );
        }

        const results = await Promise.all(electionPromises);

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
              <ElectionCard key={e.id} href={`/vote/${e.id}`}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
              }}>
              <strong>#{e.id}:</strong> {e.title}
              <em>({e.isOpen ? 'Open' : 'Closed'})</em>
            </div>
          </ElectionCard>
         ))}
         </>
      )}
    </Wrapper>
  );
}