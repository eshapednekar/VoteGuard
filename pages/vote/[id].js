import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useVoteGuard } from '../../context/VoteGuardContext';
import { getContract } from "../../contract";

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
  const electionId = id ? parseInt(id, 10) : null;

  const [ title, setTitle ]         = useState('');
  const [ candidates, setCandidates ] = useState([]);
  const [ isOpen, setIsOpen ]       = useState(false);
  const [ voted, setVoted ]         = useState(false);
  const [ loading, setLoading ]     = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    if (!router.isReady || electionId === null) return;

    (async () => {
      try {
        const c = await getContract();

        const [ onChainTitle, openFlag, countBn ] = await Promise.all([
          c.getTitle(electionId),
          c.isElectionOpen(electionId),
          c.getCandidateCount(electionId)
        ]);
        
        setTitle(onChainTitle);
        setIsOpen(openFlag);

        console.log("openFlag for", electionId, "is", openFlag);


        // fetch each candidate string
        const count = countBn.toNumber();
        const names = await Promise.all(
          Array.from({ length: count }, (_, idx) =>
            c.getCandidate(electionId, idx)
          )
        );
        setCandidates(names);

        // optionally check if user already voted:
        // const hasVoted = await c.hasUserVoted(id, await c.signer.getAddress());
        // setVoted(hasVoted);
      } catch (err) {
        console.error("error loading election", err);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [router.isReady, electionId]);

  const castVote = async (candidateIndex) => {
    setSubmitting(true);
    try {
      const c = await getContract();
      const tx = await c.vote(electionId, candidateIndex);
      await tx.wait();
      setVoted(true);
    } catch (err) {
      console.error("vote failed", err);
    }finally {
      setSubmitting(false);
    }
  };

  if (!router.isReady || loadingData) {
    return <Wrapper>Loading…</Wrapper>;
  }

  if (electionId === null) {
    return <Wrapper>Invalid election ID.</Wrapper>;
  }


  return (
    <Wrapper>
      <h2>{title || `Election #${electionId}` }</h2>
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
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : name}
            </CandidateButton>
          ))}
        </>
      )}
    </Wrapper>
  );
}