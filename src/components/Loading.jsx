/**
 * Loading spinner component.
 * fullPage prop centers it in the viewport.
 */
export default function Loading({ fullPage = false, message = 'Loading…', size = 'md' }) {
  const wrapper = fullPage ? 'loading loading--fullpage' : 'loading';
  return (
    <div className={wrapper} role="status" aria-live="polite">
      <div className={`loading__spinner loading__spinner--${size}`} aria-hidden="true" />
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
}
