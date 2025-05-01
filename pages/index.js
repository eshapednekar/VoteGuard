import Link from 'next/link';
import styled from 'styled-components';
import { useVoteGuard } from '../context/VoteGuardContext';

const Wrapper = styled.div`
  padding: 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #555;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #0070f3;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    background-color: #005bb5;
  }
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


export default function Home() {
  const { currentAccount, connectWallet } = useVoteGuard();
  return (
    <Wrapper>
      <Title>Welcome to VoteGuard</Title>
      <Subtitle>Secure and transparent voting on the blockchain.</Subtitle>
      <div>
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
      </div>
      <ButtonGroup>
        <StyledLink href="/dashboard">Go to Dashboard</StyledLink>
        <StyledLink href="/admin">Go to Admin Panel</StyledLink>
      </ButtonGroup>
    </Wrapper>
  );
}