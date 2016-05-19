import { FilterConfig } from './filterConfig';
export function filter(targetOrNameOrConfig, key, descriptor) {
    const configurableDecorate = (target, key2, descriptor2) => {
        const actualTarget = key2 ? target.constructor : target;
        const config = FilterConfig.getDefaultConfig(key2);
        if (typeof targetOrNameOrConfig === 'string') {
            config.parameterName = targetOrNameOrConfig;
        }
        else {
            Object.assign(config, targetOrNameOrConfig);
        }
        return new FilterConfig(config).register(actualTarget, descriptor2);
    };
    if (key) {
        const targetTemp = targetOrNameOrConfig;
        targetOrNameOrConfig = null;
        return configurableDecorate(targetTemp, key, descriptor);
    }
    return configurableDecorate;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlckFubm90YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0I7QUFFM0MsdUJBQXVCLG9CQUFtRCxFQUFFLEdBQVksRUFBRSxVQUFtQjtJQUN6RyxNQUFNLG9CQUFvQixHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXO1FBQ25ELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUN4RCxNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkQsRUFBRSxDQUFDLENBQUMsT0FBTyxvQkFBb0IsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsb0JBQW9CLENBQUM7UUFDaEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDO0lBRUYsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNOLE1BQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO1FBQ3hDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUM1QixNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0FBQ2hDLENBQUMiLCJmaWxlIjoiZmlsdGVyQW5ub3RhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RmlsdGVyQ29uZmlnfSBmcm9tICcuL2ZpbHRlckNvbmZpZyc7XHJcbmltcG9ydCB7SUZpbHRlckNvbmZpZ30gZnJvbSAnLi9jb250cmFjdHMvSUZpbHRlckNvbmZpZyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXIodGFyZ2V0T3JOYW1lT3JDb25maWc/OiBzdHJpbmcgfCBJRmlsdGVyQ29uZmlnIHwgYW55LCBrZXk/OiBzdHJpbmcsIGRlc2NyaXB0b3I/OiBPYmplY3QpOiBhbnkge1xyXG4gICAgY29uc3QgY29uZmlndXJhYmxlRGVjb3JhdGUgPSAodGFyZ2V0LCBrZXkyLCBkZXNjcmlwdG9yMikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFRhcmdldCA9IGtleTIgPyB0YXJnZXQuY29uc3RydWN0b3IgOiB0YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gRmlsdGVyQ29uZmlnLmdldERlZmF1bHRDb25maWcoa2V5Mik7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0T3JOYW1lT3JDb25maWcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5wYXJhbWV0ZXJOYW1lID0gdGFyZ2V0T3JOYW1lT3JDb25maWc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihjb25maWcsIHRhcmdldE9yTmFtZU9yQ29uZmlnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJDb25maWcoY29uZmlnKS5yZWdpc3RlcihhY3R1YWxUYXJnZXQsIGRlc2NyaXB0b3IyKTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGtleSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldFRlbXAgPSB0YXJnZXRPck5hbWVPckNvbmZpZztcclxuICAgICAgICB0YXJnZXRPck5hbWVPckNvbmZpZyA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYWJsZURlY29yYXRlKHRhcmdldFRlbXAsIGtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29uZmlndXJhYmxlRGVjb3JhdGU7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
