import { VoteGuardProvider } from '../pages/src/context/VoteGuardContext';
import Header from '../pages/components/header';

export default function App({ Component, pageProps }) {
  return (
    <VoteGuardProvider>
      <Header />
      <Component {...pageProps} />
    </VoteGuardProvider>
  );
}
