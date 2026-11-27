import { LinearProgress } from '@mui/material';

export function TankRow({ tank, onEdit, onDelete }) {
  const capacity = Number(tank.capacity);
  const level = Number(tank.level);
  const pct =
    Number.isFinite(level) && Number.isFinite(capacity) && capacity > 0
      ? Math.max(0, Math.min(100, Math.round((level / capacity) * 100)))
      : 0;
  return (
    <div className="tank-row">
      <div className="tank-icon">◉</div>
      <div className="tank-info">
        <b>{tank.name}</b>
        <small>
          {level.toLocaleString()} of {capacity.toLocaleString()} gallons
        </small>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={pct < 30 ? 'warning' : 'primary'}
        />
      </div>
      <strong>{pct}%</strong>
      {onEdit && (
        <div className="row-actions">
          <button onClick={() => onEdit(tank)}>Edit</button>
          <button onClick={() => onDelete(tank)}>Delete</button>
        </div>
      )}
    </div>
  );
}
