import Icon from './Icon';

export default function Fab({ onClick, label = 'Add' }) {
  return (
    <button className="fab" onClick={onClick} aria-label={label}>
      <Icon name="plus" />
    </button>
  );
}
