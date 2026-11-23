/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, react-hooks/purity */
import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import { useApp } from '../../Hooks/useApp';
import {
  DataTable,
  Metric,
  ModalForm,
  Page,
  SectionTitle,
  Status,
} from '../../components/Shared/DashboardParts';
import { TankRow } from '../../components/Household/TankRow';
import { matchSuppliers, prioritizeRequests } from '../../data';

export function HouseholdDashboard() {
  const { data, user } = useApp();
  const tanks = data.tanks.filter((t) => t.userId === user.id);
  const requests = data.requests.filter((r) => r.userId === user.id);
  const active = requests.filter((r) => ['Pending', 'Accepted', 'In transit'].includes(r.status));
  const total = tanks.reduce((a, t) => a + Number(t.capacity), 0);
  const level = tanks.reduce((a, t) => a + Number(t.level), 0);
  return (
    <Page
      title={`Good morning, ${user.name.split(' ')[0]}`}
      subtitle="Here's what's happening with your water today."
      action={
        <Button variant="contained" component={Link} to="/household/new-request">
          ＋ New delivery
        </Button>
      }
    >
      <div className="metric-grid">
        <Metric
          label="TOTAL WATER"
          value={`${level.toLocaleString()} gal`}
          detail={`of ${total.toLocaleString()} gal capacity`}
          icon="◉"
        />
        <Metric
          label="TANK HEALTH"
          value={`${total ? Math.round((level / total) * 100) : 0}%`}
          detail="Average across your tanks"
          icon="⌁"
          tone="mint"
        />
        <Metric
          label="ACTIVE DELIVERIES"
          value={active.length}
          detail={`${active.filter((r) => r.status === 'In transit').length} currently on the way`}
          icon="↗"
          tone="amber"
        />
        <Metric
          label="THIS MONTH"
          value={requests.filter((r) => r.status === 'Delivered').length}
          detail="Successful deliveries"
          icon="▤"
        />
      </div>
      <div className="dashboard-grid">
        <Paper className="panel">
          <SectionTitle
            title="Tank overview"
            note="Your household water at a glance"
            action={
              <Button component={Link} to="/household/tanks" size="small">
                All tanks →
              </Button>
            }
          />
          {tanks.length ? (
            tanks.map((t) => <TankRow key={t.id} tank={t} />)
          ) : (
            <div className="empty-box">No tanks yet. Add a tank to start tracking.</div>
          )}
        </Paper>
        <Paper className="panel">
          <SectionTitle
            title="Recent deliveries"
            note="Your latest orders"
            action={
              <Button component={Link} to="/household/requests" size="small">
                View all →
              </Button>
            }
          />
          <DataTable headers={['ORDER', 'SUPPLIER', 'STATUS']}>
            {requests.slice(0, 3).map((r) => (
              <tr key={r.id}>
                <td>
                  <b>{r.id}</b>
                  <small>{r.gallons} gallons</small>
                </td>
                <td>{data.suppliers.find((s) => s.id === r.supplierId)?.name || 'Matching'}</td>
                <td>
                  <Status value={r.status} />
                </td>
              </tr>
            ))}
          </DataTable>
        </Paper>
      </div>
      <Paper className="tip-banner">
        <span>✳</span>
        <div>
          <b>A little planning goes a long way.</b>
          <small>
            Based on your usage, consider scheduling a refill when any tank drops below 30%.
          </small>
        </div>
        <Button component={Link} to="/household/suppliers">
          Find a supplier →
        </Button>
      </Paper>
    </Page>
  );
}

export function Tanks() {
  const { data, user, patch, setNotice } = useApp();
  const rows = data.tanks.filter((t) => t.userId === user.id);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const fields = [
    { name: 'name', label: 'Tank name' },
    { name: 'capacity', label: 'Capacity (gallons)', type: 'number', min: 1 },
    { name: 'level', label: 'Current water (gallons)', type: 'number', min: 0 },
  ];
  const save = (v) => {
    if (v.level > v.capacity) return setNotice('Water level cannot exceed tank capacity.', 'error');
    patch('tanks', (list) =>
      editing
        ? list.map((t) => (t.id === editing.id ? { ...t, ...v } : t))
        : [...list, { ...v, id: `t${Date.now()}`, userId: user.id }],
    );
    setOpen(false);
    setNotice('Tank saved successfully.');
  };
  return (
    <Page
      title="My tanks"
      subtitle="Keep your household water levels in check."
      action={
        <Button
          variant="contained"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          ＋ Add tank
        </Button>
      }
    >
      <Paper className="panel">
        <SectionTitle
          title="Your tanks"
          note={`${rows.length} tank${rows.length === 1 ? '' : 's'} connected`}
        />
        {rows.length ? (
          rows.map((t) => (
            <TankRow
              key={t.id}
              tank={t}
              onEdit={(v) => {
                setEditing(v);
                setOpen(true);
              }}
              onDelete={(v) => {
                if (confirm(`Delete ${v.name}?`)) {
                  patch('tanks', (list) => list.filter((x) => x.id !== v.id));
                  setNotice('Tank deleted.');
                }
              }}
            />
          ))
        ) : (
          <div className="empty-box">
            No tanks yet. Add your first tank to start tracking water.
          </div>
        )}
      </Paper>
      <ModalForm
        key={editing?.id || 'new'}
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit tank' : 'Add a tank'}
        fields={fields}
        initial={editing || { name: '', capacity: 1000, level: 0 }}
        onSave={save}
      />
    </Page>
  );
}

export function Suppliers() {
  const { data, user, patch, setNotice } = useApp();
  const myTanks = data.tanks.filter((t) => t.userId === user.id);
  const [gallons, setGallons] = useState(500);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended');
  const ranked = matchSuppliers(data.suppliers, gallons)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'distance' ? a.distance - b.distance : sort === 'rating' ? b.rating - a.rating : 0,
    );
  const create = (s) => {
    const tank = myTanks[0];
    if (!tank) return setNotice('Add a tank before requesting a delivery.', 'error');
    const req = {
      id: `D-${Date.now().toString().slice(-5)}`,
      userId: user.id,
      supplierId: s.id,
      tankId: tank.id,
      gallons: Number(gallons),
      urgency: tank.level / tank.capacity < 0.2 ? 3 : 2,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      address: user.address,
    };
    patch('requests', (r) => [req, ...r]);
    setNotice(`Request sent to ${s.name}.`);
  };
  return (
    <Page
      title="Find a supplier"
      subtitle="Compare trusted local suppliers for your next delivery."
    >
      <Paper className="match-banner">
        <span>✳</span>
        <div>
          <b>Smart matching, made simple.</b>
          <small>We rank available suppliers by price and distance for your delivery size.</small>
        </div>
        <TextField
          label="Delivery size (gal)"
          type="number"
          size="small"
          value={gallons}
          onChange={(e) => setGallons(Number(e.target.value))}
          inputProps={{ min: 1 }}
        />
      </Paper>
      <div className="toolbar-filter">
        <TextField
          size="small"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select size="small" value={sort} onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="recommended">Recommended</MenuItem>
          <MenuItem value="distance">Nearest first</MenuItem>
          <MenuItem value="rating">Top rated</MenuItem>
        </Select>
      </div>
      <div className="supplier-grid">
        {ranked.map((s, i) => (
          <Card key={s.id} className="supplier-card">
            <CardContent>
              <div className="supplier-card-top">
                <Avatar>{s.name[0]}</Avatar>
                <div>
                  <b>{s.name}</b>
                  <small>
                    ★ {s.rating} · {s.distance} mi away
                  </small>
                </div>
                {s.verified && (
                  <Chip size="small" label="Verified" color="success" variant="outlined" />
                )}
              </div>
              {i === 0 && <div className="best-match">✳ BEST MATCH</div>}
              <p>{s.services}</p>
              <Divider />
              <div className="supplier-facts">
                <span>
                  PRICE / GAL<b>${Number(s.price).toFixed(3)}</b>
                </span>
                <span>
                  AVAILABLE CAPACITY<b>{Number(s.capacity).toLocaleString()} gal</b>
                </span>
              </div>
              <Button fullWidth variant="contained" onClick={() => create(s)}>
                Request delivery · ${(Number(s.price) * gallons).toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        ))}
        {!ranked.length && (
          <Paper className="panel empty-box">
            No available suppliers can fill {gallons || 0} gallons. Try a smaller delivery size.
          </Paper>
        )}
      </div>
      <p className="algorithm-note">
        MATCHING ALGORITHM · Available suppliers with enough capacity are ranked by lower price,
        then shorter distance.
      </p>
    </Page>
  );
}

export function NewRequest() {
  const nav = useNavigate();
  const { data, user, patch, setNotice } = useApp();
  const tanks = data.tanks.filter((t) => t.userId === user.id);
  const [vals, setVals] = useState({ tankId: tanks[0]?.id || '', gallons: 500, urgency: 2 });
  const matches = matchSuppliers(data.suppliers, vals.gallons);
  const [supplier, setSupplier] = useState('');
  useEffect(() => setSupplier(matches[0]?.id || ''), [vals.gallons, data.suppliers]);
  const submit = (e) => {
    e.preventDefault();
    if (!vals.tankId) return setNotice('Please add a tank before requesting a delivery.', 'error');
    const tank = tanks.find((t) => t.id === vals.tankId);
    if (vals.gallons > tank.capacity)
      return setNotice('Delivery size cannot exceed tank capacity.', 'error');
    const target = data.suppliers.find((s) => s.id === supplier);
    const req = {
      id: `D-${Date.now().toString().slice(-5)}`,
      userId: user.id,
      tankId: tank.id,
      supplierId: target?.id || null,
      gallons: Number(vals.gallons),
      urgency: Number(vals.urgency),
      status: target ? 'Pending' : 'Pending',
      createdAt: new Date().toISOString(),
      address: user.address,
    };
    patch('requests', (r) => [req, ...r]);
    setNotice('Delivery request created.');
    nav('/household/requests');
  };
  return (
    <Page
      title="New delivery request"
      subtitle="Tell us what you need and we'll find the right supplier."
    >
      <Paper className="panel form-panel">
        <form onSubmit={submit}>
          <Stack spacing={2.5}>
            <TextField
              required
              select
              label="Deliver to tank"
              value={vals.tankId}
              onChange={(e) => setVals({ ...vals, tankId: e.target.value })}
            >
              {tanks.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name} · {t.level}/{t.capacity} gal
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              type="number"
              label="Delivery size (gallons)"
              value={vals.gallons}
              inputProps={{ min: 1 }}
              onChange={(e) => setVals({ ...vals, gallons: Number(e.target.value) })}
            />
            <TextField
              select
              label="Urgency"
              value={vals.urgency}
              onChange={(e) => setVals({ ...vals, urgency: Number(e.target.value) })}
            >
              <MenuItem value={1}>Flexible</MenuItem>
              <MenuItem value={2}>Standard</MenuItem>
              <MenuItem value={3}>Urgent</MenuItem>
            </TextField>
            <TextField
              select
              label="Supplier match"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            >
              <MenuItem value="">Find a supplier automatically</MenuItem>
              {matches.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} · ${s.price}/gal · {s.distance} mi
                </MenuItem>
              ))}
            </TextField>
            <Alert severity="info">
              {matches.length
                ? `${matches.length} available supplier match${matches.length === 1 ? '' : 'es'} for this request.`
                : 'No supplier meets this capacity. You can still submit for admin review.'}
            </Alert>
            <Stack direction="row" spacing={1}>
              <Button type="button" onClick={() => nav(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit request →
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Page>
  );
}

export function Requests({ audience = 'household' }) {
  const { data, user, patch, setNotice } = useApp();
  const [filter, setFilter] = useState('All'),
    [query, setQuery] = useState('');
  let rows = data.requests.filter((r) =>
    audience === 'household'
      ? r.userId === user.id
      : audience === 'supplier'
        ? r.supplierId === user.id
        : true,
  );
  rows = prioritizeRequests(
    rows.filter((r) => filter === 'All' || r.status === filter),
    data.tanks,
  ).filter((r) =>
    [r.id, r.address || '', data.users.find((u) => u.id === r.userId)?.name || '']
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const update = (id, status) => {
    patch('requests', (items) => items.map((r) => (r.id === id ? { ...r, status } : r)));
    setNotice(`Request ${id} updated to ${status.toLowerCase()}.`);
  };
  return (
    <Page
      title={audience === 'supplier' ? 'Incoming requests' : 'Delivery requests'}
      subtitle={
        audience === 'supplier'
          ? 'Review, prioritize, and update your assigned deliveries.'
          : 'Track every delivery request from one place.'
      }
    >
      <div className="toolbar-filter">
        <TextField
          size="small"
          placeholder="Search orders..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {['All', 'Pending', 'Accepted', 'In transit', 'Delivered', 'Rejected'].map((v) => (
            <MenuItem key={v} value={v}>
              {v === 'All' ? 'All statuses' : v}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Paper className="panel">
        <DataTable
          headers={
            audience === 'supplier'
              ? ['ORDER', 'HOUSEHOLD', 'DELIVERY', 'PRIORITY', 'STATUS', 'ACTIONS']
              : ['ORDER', 'SUPPLIER', 'DELIVERY', 'STATUS', 'PLACED', 'ACTIONS']
          }
        >
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <b>{r.id}</b>
                <small>{r.gallons} gallons</small>
              </td>
              <td>
                {audience === 'supplier'
                  ? data.users.find((u) => u.id === r.userId)?.name
                  : data.suppliers.find((s) => s.id === r.supplierId)?.name || 'Finding match'}
              </td>
              <td>{r.address || '—'}</td>
              {audience === 'supplier' && <td>{r.urgency === 3 ? 'Urgent' : 'Standard'}</td>}
              <td>
                <Status value={r.status} />
              </td>
              {audience !== 'supplier' && <td>{new Date(r.createdAt).toLocaleDateString()}</td>}
              <td>
                <Stack direction="row" spacing={0.5}>
                  {audience === 'supplier' && r.status === 'Pending' && (
                    <>
                      <Button size="small" onClick={() => update(r.id, 'Accepted')}>
                        Accept
                      </Button>
                      <Button size="small" color="error" onClick={() => update(r.id, 'Rejected')}>
                        Decline
                      </Button>
                    </>
                  )}
                  {audience === 'supplier' && r.status === 'Accepted' && (
                    <Button size="small" onClick={() => update(r.id, 'In transit')}>
                      Start delivery
                    </Button>
                  )}
                  {audience === 'supplier' && r.status === 'In transit' && (
                    <Button size="small" onClick={() => update(r.id, 'Delivered')}>
                      Mark delivered
                    </Button>
                  )}
                  {audience === 'household' && (
                    <Button size="small" component={Link} to={`/household/track/${r.id}`}>
                      Track →
                    </Button>
                  )}
                  {audience === 'admin' && (
                    <Select
                      size="small"
                      value={r.status}
                      onChange={(e) => update(r.id, e.target.value)}
                    >
                      {['Pending', 'Accepted', 'In transit', 'Delivered', 'Rejected'].map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Stack>
              </td>
            </tr>
          ))}
        </DataTable>
      </Paper>
      {audience !== 'supplier' && (
        <p className="algorithm-note">
          PRIORITY ORDER · Lowest tank water percentage, highest urgency, then longest waiting time.
        </p>
      )}
    </Page>
  );
}

export function TrackRoute() {
  const { id } = useParams(),
    { data, user } = useApp();
  const r = data.requests.find((x) => x.id === id && x.userId === user.id);
  return (
    <Page title={`Track ${id}`} subtitle="Delivery progress, updated by your supplier.">
      <Paper className="panel">
        <Status value={r?.status || 'Unknown'} />
        <h2>{data.suppliers.find((s) => s.id === r?.supplierId)?.name || 'Order not found'}</h2>
        <p>
          {r?.gallons} gallons · {r?.address}
        </p>
        <p className="algorithm-note">Pending → Accepted → In transit → Delivered</p>
      </Paper>
    </Page>
  );
}

export function Profile({ role }) {
  const { data, user, setUser, patch, setNotice } = useApp();
  const person = data.users.find((x) => x.id === user.id) || user;
  const [v, setV] = useState({
    name: person.name,
    email: person.email,
    phone: person.phone || '',
    address: person.address || '',
  });
  const sup = data.suppliers.find((x) => x.id === user.id);
  const [price, setPrice] = useState(sup?.price || 0),
    [capacity, setCapacity] = useState(sup?.capacity || 0),
    [services, setServices] = useState(sup?.services || ''),
    [available, setAvailable] = useState(sup?.available ?? true);
  const save = (e) => {
    e.preventDefault();
    patch('users', (xs) => xs.map((x) => (x.id === user.id ? { ...x, ...v } : x)));
    setUser({ ...user, ...v });
    if (role === 'supplier')
      patch('suppliers', (xs) =>
        xs.map((x) =>
          x.id === user.id
            ? { ...x, price: Number(price), capacity: Number(capacity), services, available }
            : x,
        ),
      );
    setNotice('Profile saved successfully.');
  };
  return (
    <Page
      title={role === 'supplier' ? 'Business profile' : 'Your profile'}
      subtitle="Manage your DROP account and service details."
    >
      <Paper className="panel form-panel">
        <form onSubmit={save}>
          <Stack spacing={2}>
            {Object.keys(v).map((k) => (
              <TextField
                key={k}
                label={k[0].toUpperCase() + k.slice(1)}
                value={v[k]}
                onChange={(e) => setV({ ...v, [k]: e.target.value })}
                required
              />
            ))}
            {role === 'supplier' && (
              <>
                <TextField
                  label="Services offered"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                />
                <TextField
                  label="Price per gallon"
                  type="number"
                  value={price}
                  inputProps={{ step: 0.001, min: 0 }}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                  label="Available capacity (gallons)"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <Select
                  value={available ? 'Available' : 'Unavailable'}
                  onChange={(e) => setAvailable(e.target.value === 'Available')}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Unavailable">Unavailable</MenuItem>
                </Select>
              </>
            )}
            <Button variant="contained" type="submit" sx={{ alignSelf: 'flex-start' }}>
              Save changes
            </Button>
          </Stack>
        </form>
      </Paper>
    </Page>
  );
}
