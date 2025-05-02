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
  const { query } = useRouter();
  const { id } = parseInt(query.id, 10);

  const [ title, setTitle ]         = useState('');
  const [ candidates, setCandidates ] = useState([]);
  const [ isOpen, setIsOpen ]       = useState(false);
  const [ voted, setVoted ]         = useState(false);
  const [ loading, setLoading ]     = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const c = await getContract();

        const [ onChainTitle, openFlag, countBn ] = await Promise.all([
          c.getTitle(id),
          c.isElectionOpen(id),
          c.getCandidateCount(id)
        ]);

        setTitle(onChainTitle);
        setIsOpen(openFlag);

        // fetch each candidate string
        const count = countBn.toNumber();
        const names = await Promise.all(
          Array.from({ length: count }, (_, idx) =>
            c.getCandidate(id, idx)
          )
        );
        setCandidates(names);

        // optionally check if user already voted:
        // const hasVoted = await c.hasUserVoted(id, await c.signer.getAddress());
        // setVoted(hasVoted);
      } catch (err) {
        console.error("error loading election", err);
      }
    })();
  }, [id]);

  const castVote = async (candidateIndex) => {
    setLoading(true);
    try {
      const c = await getContract();
      const tx = await c.vote(id, candidateIndex);
      await tx.wait();
      setVoted(true);
    } catch (err) {
      console.error("vote failed", err);
    }
    setLoading(false);
  };



  if (!id) return <Wrapper>Loading…</Wrapper>;


  return (
    <Wrapper>
      <h2>{title || 'Election #' + id}</h2>
      {!isOpen && !voted ? (
        <p>This election is closed.</p>
      ) : voted ? (
        <p>Your vote has been recorded. Thank you!</p>
      ) : (
        <>
          <p>Select a candidate to vote for:</p>
          {candidates.map((name, idx) => (
            <CandidateButton
              key={idx}
              onClick={() => castVote(idx)}
              disabled={loading}
            >
              {loading ? 'Submitting…' : name}
            </CandidateButton>
          ))}
        </>
      )}
    </Wrapper>
  );
}