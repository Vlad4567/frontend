import { MasterCard } from '../../components/MasterCard/MasterCard';
import { useFavorite } from '../../hooks/useFavorite';
import './SavedPage.scss';

export const SavedPage: React.FC = () => {
  const { favorite } = useFavorite(true);

  return (
    !!favorite.data?.pages.length && (
      <div className="saved-page">
        {favorite.data.pages.flatMap(page =>
          page.content.map(master => (
            <MasterCard master={master} key={master.id} />
          )),
        )}
      </div>
    )
  );
};
