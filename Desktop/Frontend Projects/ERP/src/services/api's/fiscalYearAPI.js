import apiClient from '../client';

export const fiscalYearAPI = {
    createFiscalYear: (fiscal_year) => apiClient.post('/fiscal-year', { fiscal_year }),
};