export default function ErrorState({ message = 'Une erreur est survenue.', onRetry }) {
  return (
    <div className="card mx-auto max-w-md p-10 text-center">
      <i className="bi bi-exclamation-triangle text-4xl text-copper"></i>
      <p className="mt-4 text-forest-dark/70 dark:text-sand-dark">{message}</p>
      {onRetry && (
        <button className="btn-outline mt-6" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise"></i> Réessayer
        </button>
      )}
    </div>
  );
}
