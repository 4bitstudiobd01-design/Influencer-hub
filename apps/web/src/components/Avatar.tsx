import clsx from 'clsx';

const GRADIENTS = [
  'from-amber to-forest-light',
  'from-forest-light to-charcoal',
  'from-platform-instagram to-amber',
  'from-platform-facebook to-forest-light',
];

function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % GRADIENTS.length;
  return Math.abs(h);
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={clsx(
        'flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white',
        GRADIENTS[hashName(name)],
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({ names, size = 28 }: { names: string[]; size?: number }) {
  return (
    <div className="flex items-center -space-x-2">
      {names.slice(0, 4).map((name, i) => (
        <div key={name + i} className="rounded-full ring-2 ring-white">
          <Avatar name={name} size={size} />
        </div>
      ))}
    </div>
  );
}
