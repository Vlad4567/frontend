import { SpaceToEnjoySection } from '../../components/SpaceToEnjoySection/SpaceToEnjoySection';
import { WhatIsSection } from '../../components/WhatIsSection/WhatIsSection';
import { FeelBeautySection } from '../../components/FeelBeautySection/FeelBeautySection';
import { HomeHeaderSection } from '../../components/HomeHeaderSection/HomeHeaderSection';
import { useApp } from '../../hooks/useApp';
import { useEffect } from 'react';
import './HomePage.scss';

export const HomePage = () => {
  const { updateApp } = useApp();

  useEffect(() => {
    updateApp({ headerType: 'light' });

    return () => {
      updateApp({ headerType: 'dark' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="home-page">
      <HomeHeaderSection />

      <FeelBeautySection />

      <WhatIsSection />

      <SpaceToEnjoySection />
    </main>
  );
};
