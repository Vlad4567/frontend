import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { MasterGallery } from '../../components/MasterGallery/MasterGallery';
import './MasterGalleryPage.scss';
import { getMaster } from '../../api/master';
import * as publicMasterSlice from '../../features/publicMasterSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { showNotification } from '../../helpers/notifications';
import { ConnectWithMasterSection }
  from '../../components/ConnectWithMasterSection/ConnectWithMasterSection';

export const MasterGalleryPage: React.FC = () => {
  const urlParams = useParams();
  const dispatch = useAppDispatch();
  const publicMaster = useAppSelector(state => state.publicMasterSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if ((publicMaster.master.id.toString() !== urlParams.id)
      && urlParams.id) {
      getMaster(+urlParams.id)
        .then((res) => {
          dispatch(publicMasterSlice.updateMaster(res));
        })
        .catch(() => showNotification('error'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="master-gallery-page">
      <div className="master-gallery-page__back">
        <ArrowButton
          className="master-gallery-page__back-button"
          position="left"
          onClick={() => navigate(`/master/${urlParams.id}`)}
        />
        <h3
          className="master-gallery-page__back-title"
        >
          Portfolio
        </h3>
      </div>
      <MasterGallery
        subcategories={publicMaster.master.subcategories || []}
        className="master-gallery-page__gallery"
        type="portfolio"
      />
      <ConnectWithMasterSection
        name={`${publicMaster.master.firstName} ${publicMaster.master.lastName}`}
        contacts={publicMaster.master.contacts}
      />
    </main>
  );
};
