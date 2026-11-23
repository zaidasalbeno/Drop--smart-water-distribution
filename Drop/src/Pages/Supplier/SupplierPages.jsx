import { Paper } from '@mui/material';
import { useApp } from '../../Hooks/useApp';
import {
  DataTable,
  Metric,
  Page,
  SectionTitle,
  Status,
} from '../../components/Shared/DashboardParts';
import { prioritizeRequests } from '../../data';

export function SupplierDashboard() {
  const { data, user } = useApp();
  const r = data.requests.filter((x) => x.supplierId === user.id);
  return (
    <Page title={`Welcome, ${user.name}`} subtitle="Your delivery operations at a glance.">
      <div className="metric-grid">
        <Metric
          label="INCOMING REQUESTS"
          value={r.filter((x) => x.status === 'Pending').length}
          detail="Awaiting response"
          icon="↙"
        />
        <Metric
          label="ACTIVE DELIVERIES"
          value={r.filter((x) => ['Accepted', 'In transit'].includes(x.status)).length}
          detail="Accepted or on the way"
          icon="↗"
        />
        <Metric
          label="COMPLETED"
          value={r.filter((x) => x.status === 'Delivered').length}
          detail="All time"
          icon="✓"
        />
        <Metric
          label="AVAILABILITY"
          value={data.suppliers.find((s) => s.id === user.id)?.available ? 'Open' : 'Paused'}
          detail="Business status"
          icon="◉"
        />
      </div>
      <Paper className="panel">
        <SectionTitle
          title="Prioritized requests"
          note="Lowest tank percentage, urgency, then longest wait"
        />
        <RequestsMini
          rows={prioritizeRequests(
            r.filter((x) => x.status === 'Pending'),
            data.tanks,
          )}
        />
      </Paper>
    </Page>
  );
}

export function RequestsMini({ rows }) {
  const { data } = useApp();
  return (
    <DataTable headers={['ORDER', 'HOUSEHOLD', 'VOLUME', 'STATUS']}>
      {rows.map((r) => (
        <tr key={r.id}>
          <td>{r.id}</td>
          <td>{data.users.find((u) => u.id === r.userId)?.name}</td>
          <td>{r.gallons} gal</td>
          <td>
            <Status value={r.status} />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

export function History() {
  const { data, user } = useApp();
  const rows = data.requests.filter((r) => r.supplierId === user.id && r.status === 'Delivered');
  return (
    <Page title="Delivery history" subtitle="A record of completed deliveries.">
      <Paper className="panel">
        <DataTable headers={['ORDER', 'HOUSEHOLD', 'VOLUME', 'DATE']}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{data.users.find((u) => u.id === r.userId)?.name}</td>
              <td>{r.gallons} gallons</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </DataTable>
      </Paper>
    </Page>
  );
}
