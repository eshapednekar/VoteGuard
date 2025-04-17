import Link from 'next/link';
import styled from 'styled-components';

const ElectionCard = styled.div`
  background-color: #f4f4f4;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
  margin-top: 1rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #0070f3;
  color: white;
  border-radius: 6px;
  text-decoration: none;

  &:hover {
    background-color: #005bb5;
  }
`;

const DisabledButton = styled.div`
  margin-top: 1rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #aaa;
  color: white;
  border-radius: 6px;
`;

export default function ElectionList({ elections }) {
  return (
    <div>
      {(elections || []).map((election) =>(
        <ElectionCard key={election.id}>
          <h3>{election.title}</h3>
          {election.hasVoted ? (
            <>
              <p>You have already voted.</p>
              <DisabledButton>Voting Closed</DisabledButton>
            </>
          ) : (
            <>
              <p>Voting open</p>
              <StyledLink href={`/vote/${election.id}`}>Vote Now</StyledLink>
            </>
          )}
        </ElectionCard>
      ))}
    </div>
  );
}
