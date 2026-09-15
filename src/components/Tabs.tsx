import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ label, items }: { label: string; items: TabItem[] }) {
  const [selected, setSelected] = useState(items[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const nextIndex = (index + delta + items.length) % items.length;
    const next = items[nextIndex];
    if (!next) return;
    setSelected(next.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            className="tab"
            id={`tab-${item.id}`}
            aria-controls={item.id}
            aria-selected={selected === item.id}
            tabIndex={selected === item.id ? 0 : -1}
            onClick={() => setSelected(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.id} className="tab-panel" id={item.id} role="tabpanel" aria-labelledby={`tab-${item.id}`} hidden={selected !== item.id}>
          {item.content}
        </div>
      ))}
    </>
  );
}
