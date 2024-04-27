import { useNavigate, useParams } from 'react-router-dom';
import { ArrowButton } from '../../components/ArrowButton';
import { MasterGallery } from '../../components/MasterGallery/MasterGallery';
import { ConnectWithMasterSection } from '../../components/ConnectWithMasterSection';
import './MasterGalleryPage.scss';
import { useMaster } from '../../hooks/useMaster';

export const MasterGalleryPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    master: { data: master },
  } = useMaster(+(id as string));

  return (
    master && (
      <main className="master-gallery-page">
        <div className="master-gallery-page__back">
          <ArrowButton
            className="master-gallery-page__back-button"
            position="left"
            onClick={() => navigate(`/master/${id}`)}
          />
          <h3 className="master-gallery-page__back-title">Portfolio</h3>
        </div>
        <MasterGallery
          subcategories={master.subcategories || []}
          className="master-gallery-page__gallery"
          type="portfolio"
        />
        <ConnectWithMasterSection
          name={`${master.firstName} ${master.lastName}`}
          contacts={master.contacts}
        />
      </main>
    )
  );
};
