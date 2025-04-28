export const environment = {
  production: true,
  telemetry: {
    serviceName: 'reqres-users-angular',
    serviceVersion: '1.0.0',
    endpoint: 'YOUR_PRODUCTION_SIGNOZ_ENDPOINT', // Update this with your production SigNoz endpoint
    headers: {
      // Add any production-specific headers here
    },
  }
}; 