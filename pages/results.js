import { useVoteGuard } from '../context/VoteGuardContext';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 2rem;
`;

const ResultCard = styled.div`
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

export default function ResultsPage() {
  const { elections } = useVoteGuard();

  return (
    <Wrapper>
      <h2>Election Results</h2>
      {elections.length === 0 ? (
        <p>No elections available yet.</p>
      ) : (
        elections.map((election) => (
          <ResultCard key={election.id}>
            <h3>{election.title}</h3>
            <ul>
              {election.candidates.map((candidate, index) => (
                <li key={index}>
                  {candidate} — {election.votes ? election.votes[index] || 0 : 0} votes
                </li>
              ))}
            </ul>
          </ResultCard>
        ))
      )}
    </Wrapper>
  );
}
