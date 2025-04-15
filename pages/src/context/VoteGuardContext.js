import React, { createContext, useContext, useState } from 'react';
import { mockElections } from '../../../pages/mock/mockElections';

const VoteGuardContext = createContext();
export const useVoteGuard = () => useContext(VoteGuardContext);

export const VoteGuardProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [elections, setElections] = useState(mockElections);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert('Please install MetaMask!');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const castVote = (electionId) => {
    setElections((prevElections) =>
      prevElections.map((election) =>
        election.id === electionId
          ? { ...election, hasVoted: true }
          : election
      )
    );
  };
  

  const createElection = (title, candidates) => {
    const newElection = {
      id: Date.now(),
      title,
      candidates,
      hasVoted: false,
    };
    setElections((prevElections) => [...prevElections, newElection]);
  };

  return (
    <VoteGuardContext.Provider
      value={{
        currentAccount,
        connectWallet,
        elections,
        createElection,
        castVote
      }}
    >
      {children}
    </VoteGuardContext.Provider>
  );
};
