import apiClient from '../client';

export const fiscalYearCloseAPI = {
    createFiscalYearClose: (fiscal_year, start_date, end_date) => apiClient.post('/fiscal-year/close', { fiscal_year, start_date, end_date }),
};