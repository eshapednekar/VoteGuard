import { useVoteGuard } from '../pages/src/context/VoteGuardContext';
import Link from 'next/link';
import styled from 'styled-components';
import ElectionList from '../pages/components/electionList';

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
  const { elections } = useVoteGuard();

  return (
    <Wrapper>
      <h2>Dashboard</h2>
      {!currentAccount ? (
        <div>
          <p>No wallet connected.</p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </div>
      ) : (
        <div>
          <p>Wallet Connected:</p>
          <AddressBox>{currentAccount}</AddressBox>
        </div>
      )}
      <br />
      <Link href="/">← Back to Home</Link>
      <h2>Active Elections</h2>
      <ElectionList elections={elections} />
    </Wrapper>
  );
}
