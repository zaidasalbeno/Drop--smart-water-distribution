import { LinearProgress } from '@mui/material';

export function TankRow({ tank, onEdit, onDelete }) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round((Number(tank.level) / Number(tank.capacity)) * 100)),
  );
  return (
    <div className="tank-row">
      <div className="tank-icon">◉</div>
      <div className="tank-info">
        <b>{tank.name}</b>
        <small>
          {Number(tank.level).toLocaleString()} of {Number(tank.capacity).toLocaleString()} gallons
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
