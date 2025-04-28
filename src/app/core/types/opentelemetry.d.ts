declare module '@opentelemetry/semantic-conventions' {
  export const SemanticResourceAttributes: {
    SERVICE_NAME: string;
    SERVICE_VERSION: string;
  };
}

declare module '@opentelemetry/sdk-trace-base' {
  export class BatchSpanProcessor {
    constructor(exporter: any);
  }
}

declare module '@opentelemetry/sdk-trace-web' {
  export class WebTracerProvider {
    constructor(config: { resource: any });
    addSpanProcessor(processor: any): void;
    register(config: { contextManager: any }): void;
  }

  export class ConsoleSpanExporter {
    constructor();
  }

  export class SimpleSpanProcessor {
    constructor(exporter: any);
  }
}

declare module '@opentelemetry/exporter-trace-otlp-http' {
  export class OTLPTraceExporter {
    constructor(config: { url: string; headers: Record<string, string> });
  }
}

declare module '@opentelemetry/instrumentation' {
  export function registerInstrumentations(config: { instrumentations: any[] }): void;
}

declare module '@opentelemetry/auto-instrumentations-web' {
  export function getWebAutoInstrumentations(config?: any): any[];
} 