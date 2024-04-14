import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { useAppDispatch } from '../../app/hooks';
import * as appSlice from '../../features/appSlice';
import { SpaceToEnjoySection } from '../../components/SpaceToEnjoySection/SpaceToEnjoySection';
import { WhatIsSection } from '../../components/WhatIsSection/WhatIsSection';
import './HomePage.scss';
import { FeelBeautySection } from '../../components/FeelBeautySection/FeelBeautySection';
import { HomeHeaderSection } from '../../components/HomeHeaderSection/HomeHeaderSection';

export const HomePage = () => {
  const dispatch = useAppDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(appSlice.setHeaderType('light'));

    return () => {
      dispatch(appSlice.setHeaderType('dark'));
    };
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
