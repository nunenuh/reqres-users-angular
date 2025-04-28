export const environment = {
  production: false,
  telemetry: {
    serviceName: 'reqres-users-angular',
    serviceVersion: '1.0.0',
    endpoint: '/v1/traces',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    console: true, // Enable console debugging
    probability: 1.0, // Sample 100% of traces
    instrumentations: {
      fetch: true,
      xmlHttpRequest: true,
      documentLoad: true,
      userInteraction: true
    }
  }
}; 