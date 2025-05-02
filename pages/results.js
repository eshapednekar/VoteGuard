import { getContract } from '../contract';
import { useState, useEffect } from 'react';
import { Wrapper, Card } from '../components/uii';


export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const c = await getContract();

        // figure out how many elections exist
        const nextIdBn = await c.nextElectionId();
        const nextId = nextIdBn.toNumber();

        // build an array of promises for each election
        const electionPromises = [];
        for (let id = 1; id < nextId; id++) {
          electionPromises.push(
            (async () => {
              const [title, countBn] = await Promise.all([
                c.getTitle(id),
                c.getCandidateCount(id),
              ]);
              const count = countBn.toNumber();

              // fetch names and votes in parallel for this election
              const names  = [];
              const votes  = [];
              for (let idx = 0; idx < count; idx++) {
                names.push(await c.getCandidate(id, idx));
                const vBn = await c.getVotes(id, idx);
                votes.push(vBn.toNumber());
              }

              return { id, title, candidates: names, votes };
            })()
          );
        }

        const all = await Promise.all(electionPromises);
        setResults(all);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <Wrapper>
        <h2>Election Results</h2>
        <p>Loading results…</p>
      </Wrapper>
    );
  }

  return (
      <Wrapper>
        <h2>Election Results</h2>
        {results.length === 0 ? (
        <p>No elections available yet.</p>
      ) : (
        results.map(({ id, title, candidates, votes }) => (
          <Card key={id}>
            <h3>{title}</h3>
            <ul>
              {candidates.map((name, idx) => (
                <li key={idx}>
                  {name} — {votes[idx] ?? 0} votes
                </li>
              ))}
            </ul>
          </Card>
        ))
      )}
    </Wrapper>
  );
}
