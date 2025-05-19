import { Elysia } from 'elysia';

interface RouteInfo {
  method: string;
  path: string;
  handler: string;
}

export function logRoutes(app: any) {
  const routes: RouteInfo[] = [];
  
  function collectRoutes(instance: Elysia, prefix = '') {
    const currentRoutes = instance.routes;
    
    for (const route of currentRoutes) {
      const path = prefix + route.path;
      const method = route.method.toUpperCase();
      const handler = route.handler.name || 'anonymous';
      
      routes.push({ method, path, handler });
    }
  }
  
  collectRoutes(app);
  
  routes.sort((a, b) => a.path.localeCompare(b.path));
  
  console.log('\n🚀 Registered Routes:');
  console.log('='.repeat(50));
  console.log('Method\t\tPath');
  console.log('-'.repeat(50));
  
  routes.forEach(route => {
    const method = route.method.padEnd(8);
    console.log(`${method}\t${route.path}`);
  });
  
  console.log('='.repeat(50));
  console.log(`Total Routes: ${routes.length}\n`);
} 