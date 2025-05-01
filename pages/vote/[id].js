import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useState } from 'react';
import { useVoteGuard } from '../../context/VoteGuardContext';
import abi from "../contractABI.json";

const Wrapper = styled.div`
  padding: 2rem;
`;

const CandidateButton = styled.button`
  display: block;
  margin: 1rem 0;
  padding: 0.75rem 1.25rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;


const contractAddress = "0xfD1Dda485D613Ecf0109EFfc0Ef0E236f05EeC0e";

export default function VotePage() {
  /*const router = useRouter();
  const { id } = router.query;

  const { elections } = useVoteGuard();
  const election = elections.find((e) => e.id === parseInt(id));
  const [voted, setVoted] = useState(false);
  const { castVote } = useVoteGuard();

  const saveVote = (candidate) => {
    console.log(`Voted for ${candidate} in election ID ${id}`);
    castVote(election.id);
    setVoted(true);

  };

  if (!election) return <Wrapper>Election not found.</Wrapper>;*/

  const signer = useSigner();
  const [title, setTitle] = useState('');
  const [candidates, setCandidates] = useState('');

  const handleSubmit = async () => {
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, abi, signer);
    await contract.createElection(title, candidates.split(',').map(s => s.trim()));
    alert("Election Created!");
  };

  return (
    <Wrapper>
      <div>
      <h2>Create Election</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Election Title" />
      <input value={candidates} onChange={(e) => setCandidates(e.target.value)} placeholder="Candidates (comma-separated)" />
      <button onClick={handleSubmit}>Create</button>
    </div>
    </Wrapper>
  );
}
