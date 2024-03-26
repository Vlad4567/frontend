import { useState } from 'react';
import { SwitchButtons } from '../SwitchButtons/SwitchButtons';
import './ServicesToSection.scss';

const serviceCards = [{
  id: 22, name: 'Therapeutic pedicure', price: 1000.00, duration: 90, subcategoryId: 17, masterCardId: 214,
}, {
  id: 20, name: 'Hair highlighting', price: 1000.00, duration: 120, subcategoryId: 6, masterCardId: 214,
}, {
  id: 21, name: 'Nail decoration', price: 700.00, duration: 30, subcategoryId: 15, masterCardId: 214,
}, {
  id: 19, name: 'Face peeling', price: 300.00, duration: 60, subcategoryId: 2, masterCardId: 214,
}, {
  id: 23, name: 'Chocolate wrap', price: 800.00, duration: 60, subcategoryId: 12, masterCardId: 214,
}, {
  id: 24, name: 'Anti-cellulite massage', price: 1000.00, duration: 60, subcategoryId: 13, masterCardId: 214,
}];

export const ServicesToSection: React.FC = () => {
  const [serviceInfo, setServiceInfo] = useState();

  return (
    <section className="master-page">
      <div className="master-page__buttons">
        <SwitchButtons
          size="large"
          buttons={['Haircut', 'Hair coloring']}
          onChange={() => {}}
        />
      </div>

      <hr className="master-page__hr" />

      <div className="master-page__information">
        <div className="master-page__information-header">
          <small className="master-page__information-title">Service</small>
          <small className="master-page__information-title">Price, ₴</small>
          <small className="master-page__information-title">Duration</small>
        </div>
        <ul className="master-page__information-list">
          {serviceCards.map(item => {
            const {
              id, name, price, duration,
            } = item;

            return (
              <div className="master-page__information-items" key={id}>
                <li className="master-page__information-item">{name}</li>
                <li className="master-page__information-item">{price}</li>
                <li className="master-page__information-item">{duration}</li>
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
