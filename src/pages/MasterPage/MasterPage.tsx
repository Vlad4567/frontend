import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMaster } from '../../api/master';
import { ServicesToSection }
  from '../../components/ServicesToSection/ServicesToSection';
import './MasterPage.scss';

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const [serviceInfo, setServiceInfo] = useState();

  useEffect(() => {
    if (id) {
      getMaster(+id)
        .then(window.console.dir);
    }
  }, [id]);

  return (
    <main className="master-page">
      <ServicesToSection />

    </main>
  );
};
