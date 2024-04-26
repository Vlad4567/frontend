import { useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import errorImg from '../../img/error.svg';
import { RoundButton } from '../../components/RoundButton/RoundButton';
import { useApp } from '../../hooks/useApp';
import './NotFoundPage.scss';

export const NotFoundPage: React.FC = () => {
  const { updateApp } = useApp();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    updateApp({ footerShown: false });

    return () => {
      updateApp({ footerShown: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <main className="not-found-page">
      <article className="not-found-page__error">
        <img className="not-found-page__error-img" src={errorImg} alt="error" />

        <div className="not-found-page__error-text">
          <h1 className="not-found-page__error-title">oh, no</h1>
          <p className="not-found-page__error-subtitle">
            Sorry, we did not find the page you were looking for
          </p>
        </div>
      </article>

      <div className="not-found-page__button-go-back">
        <RoundButton onClick={goBack}>Go back</RoundButton>
      </div>
    </main>
  );
};
