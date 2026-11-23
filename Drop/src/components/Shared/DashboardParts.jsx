import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export function Page({ title, subtitle, action, children }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            DROP NETWORK <span>·</span>{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <Typography variant="h4">{title}</Typography>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </>
  );
}

export function Metric({ label, value, detail, icon = '◈', tone = '' }) {
  return (
    <Card className="metric-card">
      <CardContent>
        <div className="metric-top">
          <span>{label}</span>
          <span className={`metric-icon ${tone}`}>{icon}</span>
        </div>
        <strong>{value}</strong>
        <small>{detail}</small>
      </CardContent>
    </Card>
  );
}

export function SectionTitle({ title, note, action }) {
  return (
    <div className="section-title">
      <div>
        <h3>{title}</h3>
        {note && <p>{note}</p>}
      </div>
      {action}
    </div>
  );
}

export function Status({ value }) {
  const type = String(value).toLowerCase().replaceAll(' ', '-');
  return (
    <Chip
      className={`status status-${type}`}
      size="small"
      label={
        <>
          <i />
          {value}
        </>
      }
    />
  );
}

export function DataTable({ headers, children, empty = 'Nothing to show here yet.' }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children || (
            <tr>
              <td colSpan={headers.length} className="empty">
                ◌<br />
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ModalForm({ open, onClose, title, fields, initial = {}, onSave }) {
  const [values, setValues] = useState(initial);
  const save = (e) => {
    e.preventDefault();
    onSave(values);
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={save}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {fields.map((f) => (
              <TextField
                key={f.name}
                required={f.required !== false}
                label={f.label}
                type={f.type || 'text'}
                select={!!f.options}
                value={values[f.name] ?? ''}
                inputProps={f.min !== undefined ? { min: f.min } : undefined}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value,
                  })
                }
              >
                {f.options?.map((o) => (
                  <MenuItem value={o} key={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
