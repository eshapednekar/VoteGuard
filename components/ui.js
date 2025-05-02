// components/ui.js
import styled from 'styled-components';

// Constrains width, centers, adds padding
export const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

// Reusable button style
export const Button = styled.button`
  background: #0070f3;
  color: #fff;
  padding: 0.75rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  &:hover {
    background: #005bb5;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;   /* <-- 1rem (16px) gap between each button */
  margin-top: 1.5rem;
`;

// Soft‑shadow card container
export const Card = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

// Candidate tag/chip
export const Tag = styled.span`
  display: inline-block;
  background: #e0e0e0;
  color: #333;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;
