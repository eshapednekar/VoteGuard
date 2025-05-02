import { useState } from 'react';
import styled from 'styled-components';
import { useVoteGuard } from '../context/VoteGuardContext';
import { getContract } from "../contract";

const Wrapper = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  margin-top: 1rem;
`;

const Input = styled.input`
  display: block;
  margin-bottom: 1rem;
  padding: 0.75rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.0rem;
  margin: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const Tag = styled.span`
  background-color: #eaeaea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-right: 0.5rem;
  display: inline-block;
`;

export default function AdminPanel() {
  const [ title, setTitle ]               = useState('');
  const [ candidates, setCandidates ]     = useState([]);
  const [ newCandidate, setNewCandidate ] = useState('');
  const [ creating, setCreating ]         = useState(false);
  const [ txHash, setTxHash ]             = useState(null);
  const [ error, setError ]               = useState(null);


  const handleAddCandidate = (e) => {
    e.preventDefault();
    const name = newCandidate.trim();
    if (!name) return;
    setCandidates(prev => [...prev, name]);
    setNewCandidate('');
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (!title.trim() || candidates.length === 0) {
      setError('Provide a title and at least one candidate.');
      return;
    }

    try {
      setCreating(true);
      const c = await getContract();
      const tx = await c.createElection(title.trim(), candidates);
      const receipt = await tx.wait();

      setTxHash(receipt.transactionHash);
      setTitle('');
      setCandidates([]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Transaction failed');
    } finally {
      setCreating(false);
    }
  };
  return (
    <Wrapper>
      <h2>Create a New Election</h2>

      {error && <p style={{ color: 'crimson' }}> {error}</p>}
      {txHash && (
        <p style={{ color: 'green' }}>
          Election created!  
          <br />
          Tx: <a href={`https://your-explorer/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
        </p>
      )}

      <Form onSubmit={handleCreateElection}>
        <label>Election Title</label>
        <Input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Club President 2025"
          disabled={creating}
        />

        <label>Add Candidate</label>
        <Input
          type="text"
          value={newCandidate}
          onChange={e => setNewCandidate(e.target.value)}
          placeholder="e.g., Alice"
          disabled={creating}
        />
        <Button
          type="button"
          onClick={handleAddCandidate}
          disabled={creating || !newCandidate.trim()}
          variant="secondary"
        >
          + Add Candidate
        </Button>

        {candidates.length > 0 && (
          <div style={{ margin: '1rem 0' }}>
            <p>Current Candidates:</p>
            {candidates.map((c, i) => (
              <Tag key={i}>{c}</Tag>
            ))}
          </div>
        )}

        <Button type="submit" disabled={creating}>
          {creating ? 'Creating…' : 'Create Election'}
        </Button>
      </Form>
    </Wrapper>
  );
}