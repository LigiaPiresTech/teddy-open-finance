import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('observabilidade')
@Controller()
export class MetricsController {

  @Get('healthz')
  @ApiOperation({ summary: 'Verifica a saúde do sistema' })
  getHealth() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Expõe métricas básicas no formato Prometheus' })
  getMetrics() {
    const memoryUsage = process.memoryUsage();
    return `# HELP node_memory_usage_bytes Memoria alocada pelo Node.js\n` +
           `# TYPE node_memory_usage_bytes gauge\n` +
           `node_memory_usage_bytes{type="rss"} ${memoryUsage.rss}\n` +
           `node_memory_usage_bytes{type="heapTotal"} ${memoryUsage.heapTotal}\n` +
           `node_memory_usage_bytes{type="heapUsed"} ${memoryUsage.heapUsed}\n`;
  }
}