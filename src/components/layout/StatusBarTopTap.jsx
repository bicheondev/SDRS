export default function StatusBarTopTap({ onTap }) {
  return (
    <button
      className="status-bar-scroll-top-tap"
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={onTap}
    />
  );
}
