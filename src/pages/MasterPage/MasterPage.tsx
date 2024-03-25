import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'usehooks-ts';
import { getMaster } from '../../api/master';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { showNotification } from '../../helpers/notifications';
import * as publicMasterSlice from '../../features/publicMasterSlice';
import './MasterPage.scss';

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { master } = useAppSelector(state => state.publicMasterSlice);

  useDocumentTitle(master.firstName || 'Master');

  useEffect(() => {
    if (id) {
      getMaster(+id)
        .then((res) => dispatch(publicMasterSlice.updateMaster(res)))
        .catch(() => showNotification('error'));
    }
  }, [dispatch, id]);

  return (
    <main className="master-page">
      {id}
    </main>
  );
};
