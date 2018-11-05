import { promisify } from 'util';
import Service from './Service';

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];

type RemoteService<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : never;
}

function createService<T>(creator: () => T): RemoteService<T> {
  const service = creator();
  const proxy = new Proxy({}, { get: (_, property: string) => (...argumentList: any[]) => {
    const method: any = (service as any)[property];
      if (typeof method === 'function') {
        return method.apply(service, argumentList);
      }
  } })
  return proxy as RemoteService<T>;
}

function distributedApp(fn: () => void): void {
  fn();
}

export {
  createService,
  distributedApp,
  Service
}
