import { Injectable } from '@angular/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { environment } from '../../../environments/environment';
import { trace, Context } from '@opentelemetry/api';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-web';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private readonly config = environment.telemetry;

  constructor() {
    console.log('Initializing TelemetryService with config:', this.config);
    this.initializeTracing();
  }

  private initializeTracing(): void {
    try {
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.config.serviceVersion,
        'environment': environment.production ? 'production' : 'development'
      });

      console.log('Created resource:', resource);

      const provider = new WebTracerProvider({
        resource: resource,
      });

      console.log('Created WebTracerProvider');

      // Create and add the OTLP exporter
      const otlpExporter = new OTLPTraceExporter({
        url: this.config.endpoint,
        headers: this.config.headers,
      });
      
      // Add both console and OTLP exporters in development
      if (this.config.console && !environment.production) {
        const consoleExporter = new ConsoleSpanExporter();
        provider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
        console.log('Added ConsoleSpanProcessor for development debugging');
      }

      // Add the main OTLP exporter
      provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));
      console.log('Added BatchSpanProcessor with OTLP exporter');

      // Register the tracer provider
      provider.register({
        contextManager: new ZoneContextManager(),
      });

      console.log('Registered tracer provider');

      // Register auto-instrumentations
      registerInstrumentations({
        instrumentations: [
          getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-fetch': {
              enabled: this.config.instrumentations.fetch,
              propagateTraceHeaderCorsUrls: /.*/,
              clearTimingResources: true,
            },
            '@opentelemetry/instrumentation-xml-http-request': {
              enabled: this.config.instrumentations.xmlHttpRequest,
              propagateTraceHeaderCorsUrls: /.*/,
              clearTimingResources: true,
            },
            '@opentelemetry/instrumentation-user-interaction': {
              enabled: this.config.instrumentations.userInteraction,
            },
            '@opentelemetry/instrumentation-document-load': {
              enabled: this.config.instrumentations.documentLoad,
            }
          }),
        ],
      });

      console.log('Registered auto-instrumentations');

      // Create a test span to verify everything is working
      this.createTestSpan();

    } catch (error) {
      console.error('Error initializing tracing:', error);
    }
  }

  private createTestSpan(): void {
    try {
      const tracer = trace.getTracer('test-tracer');
      const testSpan = tracer.startSpan('test-span');
      testSpan.setAttribute('test.attribute', 'test-value');
      testSpan.setAttribute('service.name', this.config.serviceName);
      
      // Add some more test attributes
      testSpan.setAttributes({
        'test.timestamp': new Date().toISOString(),
        'test.environment': environment.production ? 'production' : 'development',
        'test.endpoint': this.config.endpoint
      });

      testSpan.end();
      console.log('Created and completed test span');
    } catch (error) {
      console.error('Error creating test span:', error);
    }
  }
} 