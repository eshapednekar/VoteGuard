import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useState } from 'react';
import { useVoteGuard } from '../../context/VoteGuardContext';

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

export default function VotePage() {
  const router = useRouter();
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

  if (!election) return <Wrapper>Election not found.</Wrapper>;

  return (
    <Wrapper>
      <h2>{election.title}</h2>
      {voted ? (
        <p>Your vote has been recorded.</p>
      ) : (
        <>
          <p>Select a candidate to vote for:</p>
          {election.candidates.map((name) => (
            <CandidateButton key={name} onClick={() => saveVote(name)}>
              {name}
            </CandidateButton>
          ))}
        </>
      )}
    </Wrapper>
  );
}
