import { SpaceToEnjoySection } from
  '../../components/SpaceToEnjoySection/SpaceToEnjoySection';
import { WhatIsSection } from '../../components/WhatIsSection/WhatIsSection';
import './HomePage.scss';

export const HomePage = () => {
  return (
    <main className="home-page">
      <WhatIsSection />

      <SpaceToEnjoySection />
    </main>
  );
};
