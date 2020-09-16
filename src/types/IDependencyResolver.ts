export interface IDependencyResolver {
    resolve: (type: InstanceType<any>, ...args: any[]) => InstanceType<any>;
}
