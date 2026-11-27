// Local demo account for reviewing the admin workspace. This is not a production auth system.
export const initialData = {
  users: [
    {
      id: 'admin-demo',
      name: 'DROP Admin',
      email: 'admin@drop.local',
      password: 'DropAdmin2026!',
      role: 'admin',
      phone: '',
      address: '',
      active: true,
    },
  ],
  tanks: [],
  suppliers: [],
  requests: [],
  complaints: [],
};

export function prioritizeRequests(requests, tanks) {
  const percent = (request) => {
    const tank = tanks.find((item) => item.id === request.tankId);
    if (
      !tank ||
      tank.capacity == null ||
      tank.level == null ||
      !Number.isFinite(Number(tank.capacity)) ||
      Number(tank.capacity) <= 0 ||
      !Number.isFinite(Number(tank.level))
    )
      return 101;
    return Math.max(0, Math.min(100, (Number(tank.level) / Number(tank.capacity)) * 100));
  };
  const urgency = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
  const time = (value) => {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  };
  return [...requests].sort(
    (a, b) =>
      percent(a) - percent(b) ||
      urgency(b.urgency) - urgency(a.urgency) ||
      time(a.createdAt) - time(b.createdAt),
  );
}

export function matchSuppliers(suppliers, gallons) {
  const amount = Number(gallons);
  if (!Number.isFinite(amount) || amount <= 0) return [];
  const rankValue = (value) =>
    value == null || value === '' || !Number.isFinite(Number(value)) ? Infinity : Number(value);
  return suppliers
    .filter(
      (supplier) =>
        supplier.available &&
        Number.isFinite(Number(supplier.capacity)) &&
        Number(supplier.capacity) >= amount,
    )
    .sort(
      (a, b) =>
        rankValue(a.price) - rankValue(b.price) || rankValue(a.distance) - rankValue(b.distance),
    );
}
