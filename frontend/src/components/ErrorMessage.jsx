import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ErrorMessage({
  title,
  message,
  onRetry = null,
}) {
  const { t } = useLanguage();

  return (
    <div className="alert alert-danger" role="alert">
      <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div className="alert-content">
        <div className="alert-title">{title || t('common.errorTitle')}</div>
        <div>{message || t('common.errorMessage')}</div>
        {onRetry && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRetry}
            style={{ marginTop: '0.75rem' }}
          >
            <RefreshCw size={14} /> {t('common.tryAgain')}
          </button>
        )}
      </div>
    </div>
  );
}
