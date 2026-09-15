import { Check, Copy, Download, ExternalLink as ExternalIcon, Info, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useId, useState } from 'react';
import { ExternalLink } from '../components/ExternalLink';
import {
  CONTENT_LABELS,
  contentLabel,
  FIRMWARE,
  formatSize,
  searchText,
  SERIES_FILTERS,
  shortHash,
  type FirmwarePackage,
  type FirmwareSeries,
} from '../content/firmware';
import { useCopy } from '../hooks/useCopy';
import { contentUrl, firmwareUrl } from '../lib/urls';

const SEARCH_INDEX = new Map(FIRMWARE.map((pkg) => [pkg.file, searchText(pkg)]));

function FirmwareCard({ pkg }: { pkg: FirmwarePackage }) {
  const { status, copy } = useCopy();
  const titleId = useId();

  return (
    <article className={pkg.recommended ? 'fw recommended' : 'fw'} aria-labelledby={titleId}>
      <div>
        <h3 className="fw-model" id={titleId}>
          {pkg.model}
          {pkg.recommended && (
            <span className="tag accent">
              <Sparkles className="i" aria-hidden="true" /> Recommended
            </span>
          )}
          {pkg.badge && <span className="tag accent">{pkg.badge}</span>}
        </h3>
        <ul className="tags" aria-label="Package contents">
          {pkg.contents.map((content) => {
            const tone = CONTENT_LABELS[content].tone;
            return (
              <li key={content} className={tone ? `tag ${tone}` : 'tag'}>
                {contentLabel(pkg, content)}
              </li>
            );
          })}
        </ul>
        {pkg.note && (
          <p className="fw-note">
            <Info className="i" aria-hidden="true" />
            {pkg.note}
          </p>
        )}
      </div>
      <div className="fw-meta">
        <span>
          {formatSize(pkg.bytes)} · <span className="fw-file">{pkg.file}</span>
        </span>
        <button
          type="button"
          className={status === 'copied' ? 'sha ok' : 'sha'}
          onClick={() => copy(pkg.sha256)}
          title={`SHA-256: ${pkg.sha256}`}
        >
          <span>{status === 'copied' ? 'SHA-256 copied' : `SHA-256 ${shortHash(pkg.sha256)}`}</span>
          {status === 'copied' ? <Check className="i" aria-hidden="true" /> : <Copy className="i" aria-hidden="true" />}
        </button>
      </div>
      <a className="btn btn-primary btn-sm" href={firmwareUrl(pkg.file)} download aria-label={`Download ${pkg.model} firmware, ${formatSize(pkg.bytes)}`}>
        <Download className="i" aria-hidden="true" /> Download
      </a>
    </article>
  );
}

export function Downloads() {
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState<FirmwareSeries | 'all'>('all');

  const terms = query.toLowerCase().split(/[\s_+\-/.]+/).filter(Boolean);
  const visible = FIRMWARE.filter(
    (pkg) => (series === 'all' || pkg.series === series) && terms.every((term) => SEARCH_INDEX.get(pkg.file)?.includes(term)),
  );

  return (
    <section className="section section-alt" id="downloads" aria-labelledby="downloads-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">Downloads</p>
            <h2 id="downloads-title">Cudy intermediary OpenWrt firmware</h2>
            <p>
              Flash one of these through Cudy's own portal first (Step 2.2). Match both the <strong>model</strong> and the{' '}
              <strong>hardware version</strong> printed on the label under your router.
            </p>
          </div>
        </div>

        <div className="fw-toolbar">
          <div className="search">
            <Search className="i" aria-hidden="true" />
            <label className="visually-hidden" htmlFor="fw-search">
              Search firmware
            </label>
            <input
              type="search"
              id="fw-search"
              placeholder="Search model, e.g. WR3000E"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="chips" role="group" aria-label="Filter by series">
            {SERIES_FILTERS.map((filter) => (
              <button key={filter.id} className="chip" type="button" aria-pressed={series === filter.id} onClick={() => setSeries(filter.id)}>
                {filter.label}
              </button>
            ))}
          </div>
          <span className="fw-count" aria-live="polite">
            {visible.length} of {FIRMWARE.length} packages
          </span>
        </div>

        <div className="fw-list">
          {visible.map((pkg) => (
            <FirmwareCard key={pkg.file} pkg={pkg} />
          ))}
          {visible.length === 0 && (
            <div className="empty">
              <p>No firmware matches that search.</p>
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => {
                  setQuery('');
                  setSeries('all');
                }}
              >
                Show all packages
              </button>
            </div>
          )}
        </div>

        <div className="fw-foot">
          <span>
            <ShieldCheck className="i" aria-hidden="true" /> Check your download against <a href={contentUrl('firmware/SHA256SUMS.txt')}>SHA256SUMS.txt</a>
          </span>
          <span>
            <ExternalIcon className="i" aria-hidden="true" /> The final SNAPSHOT image comes from the{' '}
            <ExternalLink href="https://firmware-selector.openwrt.org/">OpenWrt Firmware Selector</ExternalLink> (Step 1.2)
          </span>
        </div>
      </div>
    </section>
  );
}
