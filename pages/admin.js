import { useState } from 'react';
import styled from 'styled-components';
import { useVoteGuard } from '../context/VoteGuardContext';

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
  padding: 0.75rem 1.5rem;
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
  const { createElection } = useVoteGuard();
  const [title, setTitle] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState('');
  const [created, setCreated] = useState(false);

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (newCandidate.trim()) {
      setCandidates([...candidates, newCandidate.trim()]);
      setNewCandidate('');
    }
  };

  const handleCreateElection = (e) => {
    e.preventDefault();
    createElection(title, candidates);
    setTitle('');
    setCandidates([]);
  };

  return (
    <Wrapper>
      <h2>Create a New Election</h2>

      {created && <p>✅ Election created (mock)!</p>}

      <Form onSubmit={handleCreateElection}>
        <label>Election Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Club President 2025"
        />

        <label>Add Candidate</label>
        <Input
          type="text"
          value={newCandidate}
          onChange={(e) => setNewCandidate(e.target.value)}
          placeholder="e.g., Alice"
        />
        <Button type="button" onClick={handleAddCandidate}>Add Candidate</Button>

        {candidates.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p>Added Candidates:</p>
            {candidates.map((c, idx) => <Tag key={idx}>{c}</Tag>)}
          </div>
        )}

        <Button type="submit" style={{ marginTop: '2rem' }}>Create Election</Button>
      </Form>
    </Wrapper>
  );
}
