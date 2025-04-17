import Link from 'next/link';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #1e1e1e;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavTitle = styled.h1`
  color: white;
  font-size: 1.25rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Header() {
  return (
    <Nav>
      <NavTitle>VoteGuard</NavTitle>
      <NavLinks>
        <StyledLink href="/">Home</StyledLink>
        <StyledLink href="/dashboard">Dashboard</StyledLink>
        <StyledLink href="/admin">Admin</StyledLink>
        <StyledLink href="/results">Results</StyledLink> 
      </NavLinks>
    </Nav>
  );
}
