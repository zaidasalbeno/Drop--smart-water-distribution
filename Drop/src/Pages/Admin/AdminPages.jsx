import { useState } from 'react';
import { Button, MenuItem, Paper, Select, TextField } from '@mui/material';
import { Link } from 'react-router';
import { useApp } from '../../Hooks/useApp';
import {
  DataTable,
  Metric,
  Page,
  SectionTitle,
  Status,
} from '../../components/Shared/DashboardParts';

export function AdminDashboard() {
  const { data } = useApp();
  return (
    <Page title="Network overview" subtitle="A clear view of the whole DROP network.">
      <div className="metric-grid">
        <Metric
          label="TOTAL USERS"
          value={data.users.length}
          detail="Connected accounts"
          icon="♙"
        />
        <Metric
          label="SUPPLIERS"
          value={data.suppliers.length}
          detail={`${data.suppliers.filter((s) => s.verified).length} verified`}
          icon="◈"
        />
        <Metric
          label="OPEN REQUESTS"
          value={data.requests.filter((r) => r.status === 'Pending').length}
          detail="Awaiting response"
          icon="↗"
        />
        <Metric
          label="DELIVERED"
          value={data.requests.filter((r) => r.status === 'Delivered').length}
          detail="All-time network"
          icon="✓"
        />
      </div>
      <div className="dashboard-grid">
        <Paper className="panel">
          <SectionTitle title="Network activity" note="Delivery requests at a glance" />
          <div className="chart-area">
            <svg viewBox="0 0 600 140" preserveAspectRatio="none">
              <path
                d="M0 110 Q80 90 150 105 T300 65 T450 75 T600 20"
                fill="none"
                stroke="#087f8c"
                strokeWidth="4"
              />
            </svg>
            <div className="chart-x">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>
        </Paper>
        <Paper className="panel">
          <SectionTitle title="Needs attention" />
          <p>{data.suppliers.filter((s) => !s.verified).length} suppliers awaiting verification</p>
          <Button component={Link} to="/admin/suppliers">
            Review suppliers →
          </Button>
          <p>{data.complaints.filter((c) => c.status === 'Open').length} open complaints</p>
          <Button component={Link} to="/admin/complaints">
            Review complaints →
          </Button>
        </Paper>
      </div>
    </Page>
  );
}

export function AdminTable({ kind }) {
  const { data, patch, setNotice } = useApp();
  const [q, setQ] = useState('');
  let rows =
    kind === 'users'
      ? data.users
      : kind === 'suppliers'
        ? data.suppliers
        : kind === 'complaints'
          ? data.complaints
          : data.requests;
  rows = rows.filter((x) => JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  const change = (key, id, fn, msg) => {
    patch(key, (xs) => xs.map((x) => (x.id === id ? fn(x) : x)));
    setNotice(msg);
  };
  const title = {
    users: 'Users',
    suppliers: 'Suppliers',
    requests: 'Delivery requests',
    complaints: 'Complaints',
  }[kind];
  return (
    <Page title={title} subtitle={`Manage ${title.toLowerCase()} across the DROP network.`}>
      <div className="toolbar-filter">
        <TextField
          size="small"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <Paper className="panel">
        <DataTable
          headers={
            kind === 'users'
              ? ['USER', 'ROLE', 'STATUS', 'ACTIONS']
              : kind === 'suppliers'
                ? ['SUPPLIER', 'PRICE', 'CAPACITY', 'VERIFICATION', 'ACTIONS']
                : kind === 'requests'
                  ? ['ORDER', 'HOUSEHOLD', 'SUPPLIER', 'VOLUME', 'STATUS']
                  : ['CASE', 'SUBJECT', 'USER', 'STATUS', 'ACTIONS']
          }
        >
          {kind === 'users'
            ? rows.map((x) => (
                <tr key={x.id}>
                  <td>
                    <b>{x.name}</b>
                    <small>{x.email}</small>
                  </td>
                  <td>{x.role}</td>
                  <td>
                    <Status value={x.active ? 'Active' : 'Suspended'} />
                  </td>
                  <td>
                    <Button
                      size="small"
                      onClick={() =>
                        change(
                          'users',
                          x.id,
                          (r) => ({ ...r, active: !r.active }),
                          'User status updated.',
                        )
                      }
                    >
                      {x.active ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))
            : kind === 'suppliers'
              ? rows.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <b>{x.name}</b>
                    </td>
                    <td>${x.price}</td>
                    <td>{x.capacity} gal</td>
                    <td>
                      <Status value={x.verified ? 'Verified' : 'Unverified'} />
                    </td>
                    <td>
                      <Button
                        size="small"
                        onClick={() =>
                          change(
                            'suppliers',
                            x.id,
                            (r) => ({ ...r, verified: !r.verified }),
                            `Supplier verification updated.`,
                          )
                        }
                      >
                        {x.verified ? 'Revoke' : 'Verify'}
                      </Button>
                    </td>
                  </tr>
                ))
              : kind === 'requests'
                ? rows.map((x) => (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      <td>{data.users.find((u) => u.id === x.userId)?.name}</td>
                      <td>
                        {data.suppliers.find((s) => s.id === x.supplierId)?.name || 'Unassigned'}
                      </td>
                      <td>{x.gallons} gal</td>
                      <td>
                        <Select
                          size="small"
                          value={x.status}
                          onChange={(e) =>
                            change(
                              'requests',
                              x.id,
                              (r) => ({ ...r, status: e.target.value }),
                              'Delivery status updated.',
                            )
                          }
                        >
                          {['Pending', 'Accepted', 'In transit', 'Delivered', 'Rejected'].map(
                            (v) => (
                              <MenuItem value={v} key={v}>
                                {v}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </td>
                    </tr>
                  ))
                : rows.map((x) => (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      <td>{x.subject}</td>
                      <td>{data.users.find((u) => u.id === x.userId)?.name}</td>
                      <td>
                        <Status value={x.status} />
                      </td>
                      <td>
                        <Button
                          size="small"
                          onClick={() =>
                            change(
                              'complaints',
                              x.id,
                              (r) => ({ ...r, status: r.status === 'Open' ? 'Resolved' : 'Open' }),
                              'Complaint updated.',
                            )
                          }
                        >
                          {x.status === 'Open' ? 'Resolve' : 'Reopen'}
                        </Button>
                      </td>
                    </tr>
                  ))}
        </DataTable>
      </Paper>
    </Page>
  );
}
